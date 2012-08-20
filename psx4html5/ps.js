/**
 * Copyright (c) <2012> <Zhijie Lee / onezeros.lee at gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

/**
 */

PS = {};


/*


// "level" in Photoshop
Level(src, dst, int posLeft, int posRight)
{
    if(posLeft >= posRight){
        LOGE("posLeft( = %d) should be smaller than posRight( = %d)\n",posLeft,posRight);
        return;
    }
    float scale = 255.f / (posRight - posLeft);
    unsigned char* psrc = (unsigned char*)src->imageData;
    unsigned char* pdst = (unsigned char*)dst->imageData;
    for(int i = 0; i < src->imageSize; i++){
        if(*psrc <= posLeft ){
            *pdst = 0;
        }else if(*psrc >= posRight ){
            *pdst = 255;
        }else {
            *pdst = (*psrc - posLeft) * scale;
        }
        *pdst++ ;
        *psrc++ ;
    }
}

// RGB adjustment
// deta is the value to change,deta[0] deta[1] deta[2] correspond to R G B
AdjustRGB(src, dst,int* deta)
{
    for(int h =0; h < src->height; h++){
        unsigned char* psrc = (unsigned char*)src->imageData + src->widthStep * h;
        unsigned char* pdst = (unsigned char*)dst->imageData + dst->widthStep * h;
        for(int w =0; w  < src->width; w++){
            int r = psrc[2] + deta[0];
            int g = psrc[1] + deta[1];
            int b = psrc[0] + deta[2];
            *pdst ++= RANGE0255(b);
            *pdst ++= RANGE0255(g);
            *pdst ++= RANGE0255(r);
            psrc += 3;
        }
    }
}

// softglow filter in GIMP
Softglow(src, dst,float radius,float brightness, float sharpness)
{
    // desaturate
    gray = cvCreateImage(cvGetSize(src),8,1);
    cvCvtColor(src,gray,CV_RGB2GRAY);

    //sigmoidal transfer
    for(int h =0; h < gray->height; h++){
        unsigned char* pgray = (unsigned char*)gray->imageData + gray->widthStep * h;
        for(int w =0; w  < gray->width; w++){
            float t = *pgray/255.0;
            t = 255.0/(1 + exp(-(2 + sharpness * 20)*(t - 0.5)));
            t *= brightness;
            *pgray ++ = RANGE0255(t);
        }
    }
    // blur
    cvSmooth(gray, gray, CV_GAUSSIAN,radius * 2 +1);

    int tmp;
    for(int h =0; h < src->height; h++){
        unsigned char* pgray = (unsigned char*)gray->imageData + gray->widthStep * h;
        unsigned char* psrc = (unsigned char*)src->imageData + src->widthStep * h;
        unsigned char* pdst = (unsigned char*)dst->imageData + dst->widthStep * h;
        for(int w =0; w  < src->width; w++){
            for(int ch = 0 ; ch < src->nChannels; ch++){
                *pdst = 255 - (255 - *psrc)*(255 - *pgray)/255;
                *pdst ++;
                *psrc ++;
            }
            *pgray++;
        }
    }
    cvReleaseImage(&gray);
}

// solarize in photoshop,i.e. over exposuse
Solarize(src, _dst)
{
    dst = _dst;
    if(dst == src){
        dst = cvCreateImage(cvGetSize(src),8,src->nChannels);
    }
    psInvertColor(src, dst);
    psBlendingDarken(src,dst, dst);

    if(dst != _dst){
        cvCopy(dst,_dst);
        cvReleaseImage(&dst);
    }
}

// adjust hue, lightness, saturation. input:
//   increment of hsl:incHue[-180, 180], incLightness[-100, 100], incSaturation[-100, 100]
//   range of hue to adjust, hueStart[0, 180), hueEnd(hueStart,180]
AdjustHLS(src, dst,int incHue , int incLightness ,
    int incSaturation , int hueStart,int hueEnd )
{
    incHue = RANGE(incHue,-180,180);
    incLightness = RANGE(incLightness,-100,100);
    incSaturation = RANGE(incSaturation,-100,100);

    incHue /= 2;
    incLightness = incLightness/100.0 * 255;
    incSaturation = incSaturation/100.0 * 255;

    cvCvtColor(src, dst, CV_BGR2HLS);
    for(int h =0; h < src->height; h++){
        unsigned char* pdata = (unsigned char*)dst->imageData + h* dst->widthStep;
        for(int w =0; w <src->width; w++){
            int hue = pdata[0]; // range of hue value in IplImage is [0,180]
            int lightness = pdata[1];
            int saturation = pdata[2];
            if(hue >= hueStart && hue <= hueEnd){
                hue += incHue;
                if(hue < 0){
                    hue += 180;
                }else if(hue >180){
                    hue -=180;
                }
                lightness += incLightness;
                lightness = RANGE0255(lightness);
                saturation += incSaturation;
                saturation = RANGE0255(saturation);
            }
            *pdata++ = hue;
            *pdata++ = lightness;
            *pdata++ = saturation;
        }
    }
    cvCvtColor(dst, dst, CV_HLS2BGR);
}

// curve adjustment tool
// map gray value to given map
// input mapMat should be cvMat(256,3,CV_8UC1) or cvMat(256,1,CV_8UC1)
AdjustCurve(src, dst,CvMat mapMat)
{
    unsigned char* colormap= mapMat.data.ptr;

    for(int h=0;h<src->height;h++){
        unsigned char* psrc=(unsigned char*)src->imageData+h*src->widthStep;
        unsigned char* pdst=(unsigned char*)dst->imageData+h*dst->widthStep;
        for (int w=0;w<src->width;w++){
            for(int ch = 0; ch < dst->nChannels; ch++){
                if(mapMat.cols == 1){
                    *pdst ++ = colormap[*psrc++];
                }else {
                    *pdst ++ = colormap[*psrc++ * mapMat.step + ch];
                }
            }
        }
    }
}
// input :detaContrast[-100 , 100]
AdjustContrast(src, dst, int detaContrast )
{
    detaContrast = RANGE(detaContrast,-100,100);
    unsigned char map[256] = {0};
    double k = tan((45+44*detaContrast/100.0)/180*CV_PI);
    for(int i =0 ; i< 256; i++){
        int color = (i - 127.5 ) * k + 127.5 ;
        map[i] = RANGE0255(color);
    }
    CvMat mat = cvMat(256,1,CV_8UC1,map);
    psAdjustCurve(src,dst,mat);
}
// input : detaBrightness[-100, 100]
// algorithm resemble GIMP: alpha blending with white and black
AdjustBrightness(src, dst, int detaBrightness )
{
    detaBrightness = RANGE(detaBrightness,-100,100);
    unsigned char map[256] = {0};
    for(int i =0 ; i< 256; i++){
        int color = i;
        float alpha = detaBrightness/200.0f;
        if(detaBrightness > 0){
            color = 255 * alpha + color * (1-alpha);
        }else {
            color = color * (1 + alpha);
        }
        map[i] = RANGE0255(color);
    }
    CvMat mat = cvMat(256,1,CV_8UC1,map);
    psAdjustCurve(src,dst,mat);
}

// generate a gradient image like gimp or photoshop
// input: startPoint and endPoint resemble operations in ps
// output: dst is where the gradient image will be stored
GenerateGradient(dst,CvPoint startPoint, CvPoint endPoint, GradientParam params)
{
    if(startPoint.x == endPoint.x && startPoint.y == endPoint.y){
        unsigned char* map = params.getGradientMap();
        cvSet(dst,cvScalar(map[255],map[255],map[255],map[255]));
        return;
    }

    for(int h = 0; h < dst->height; h ++){
        unsigned char* p = (unsigned char*)dst->imageData + h * dst->widthStep;
        for(int w =0; w < dst->width; w++){
            unsigned char value= GetColor(cvPoint(w,h),startPoint,endPoint,params);
            for(int ch = 0; ch < dst->nChannels; ch++){
                *p ++ = value;
            }
        }
    }
}

// get the color at given position
unsigned char CPsOperation::GetColor(CvPoint position, CvPoint startPoint, CvPoint endPoint, GradientParam params)
{
    // distance(startPoint, position)/distance(startPoint,endPoint)
    // the method to calculate distance varies in different gradient shape
    float ratio = 0;
    float dist1 = 1;
    float dist2 = 1;
    switch(params.getGradientShape()){
        case GS_RADICAL:
            dist1 = distance(position,startPoint);
            dist2 = distance(startPoint,endPoint);
            if(dist1 < params.getOffset()*dist2){
                return params.getGradientMap()[0];
            }else if(dist1 > dist2){
                return params.getGradientMap()[255];
            }else{
                ratio = (dist1 - params.getOffset()*dist2)/(dist2 * (1- params.getOffset()));
            }
            break;
        default :
            break;
    }
    // index ratio to params.map
    switch(params.getGradientType()){
        case GT_LINEAR:
            //ratio = ratio;
            break;
        case GT_SINE:
            ratio = sin(ratio * CV_PI/2);
            break;
        default :
            break;
    }
    return params.getGradientMap()[int(255 * ratio)];
}

// distance between two points
float CPsOperation::distance(CvPoint p1, CvPoint p2)
{
    return sqrt((p1.x - p2.x)*(p1.x-p2.x) + (p1.y - p2.y)*(p1.y - p2.y));
}

// whether a point is in the range of an image
bool CPsOperation::isPointInImage(image, CvPoint point)
{
    if(point.x < image->width && point.x >= 0 &&
        point.y < image->height && point.y >= 0){
        return true;
    }
    return false;
}

// using only by psGenerateCurve
static void secondDerivative(CvPoint* controlPts,int count,float* derivative)
{
    // assume 0 boundary condition
    float (*matrix)[3] = new float[count][3];
    memset(matrix,0,sizeof(float)*count*3);
    float* result = new float[count];
    memset(result,0,sizeof(float)*count);
    matrix[0][1]=1;
    for(int i=1;i<count-1;i++) {
        matrix[i][0]=(float)(controlPts[i].x-controlPts[i-1].x)/6;
        matrix[i][1]=(float)(controlPts[i+1].x-controlPts[i-1].x)/3;
        matrix[i][2]=(float)(controlPts[i+1].x-controlPts[i].x)/6;
        result[i]=(float)(controlPts[i+1].y-controlPts[i].y)/(controlPts[i+1].x-controlPts[i].x) - (float)(controlPts[i].y-controlPts[i-1].y)/(controlPts[i].x-controlPts[i-1].x);
    }
    matrix[count-1][1]=1;

    // solving pass1 (up->down)
    for(int i=1;i<count;i++) {
        float k = matrix[i][0]/matrix[i-1][1];
        matrix[i][1] -= k*matrix[i-1][2];
        matrix[i][0] = 0;
        result[i] -= k*result[i-1];
    }
    // solving pass2 (down->up)
    for(int i=count-2;i>=0;i--) {
        float k = matrix[i][2]/matrix[i+1][1];
        matrix[i][1] -= k*matrix[i+1][0];
        matrix[i][2] = 0;
        result[i] -= k*result[i+1];
    }

    for(int i=0;i<count;i++){
        derivative[i]=result[i]/matrix[i][1];
    }
    delete[] matrix;
    delete[] result;
}

// input : controlPts, control points sorted by x, value should be in [0,255]
//         count, number of control points
// output: unsigned char map[256]
GenerateCurve(CvPoint* controlPts,int count, unsigned char* map)
{
    // make sure control points are sorted by x
    for(int i =0;i < count - 1; i++){
        if(controlPts[i].x > controlPts[i +1].x){
            return;
        }
    }
    float* p = new float[count];
    int start = 0;
    int end = count -1;
    while(controlPts[++start].x == controlPts[0].x){
        ;
    }
    start--;
    while(controlPts[--end].x == controlPts[count-1].x){
        ;
    }
    end++;
    secondDerivative(controlPts+start,end -start +1, p);
    //secondDerivative(controlPts,count, p);

    for(int i = 0; i< controlPts[0].x; i++){
        map[i]= controlPts[0].y;
    }
    for(int i = controlPts[count-1].x ; i< 256; i++){
        map[i]= controlPts[count - 1].y;
    }

    #define FUNC(x) ((x) * (x) * (x) - (x))
    for(int i =0; i < count -1; i++){
        float u = controlPts[i+1].x - controlPts[i].x;
        for(int pos = controlPts[i].x; pos <controlPts[i +1].x; pos++){
            float t = (pos - controlPts[i].x)/u;
            map[pos] = t * controlPts[i +1].y + (1-t)*controlPts[i].y + u * u *
                (FUNC(t) * p[i+1] + FUNC(1-t) * p[i])/6;
        }
    }
    delete[] p;
}

// blend a RGB image with an image with ARGB channels
// roi supported
BlendWithARGB(src, srcARGB, dst)
{
    // heigth and with of these three rect should be the same, and x, y > 0
    CvRect rcSrc = cvGetImageROI(src);
    CvRect rcArgb = cvGetImageROI(srcARGB);
    CvRect rcDst = cvGetImageROI(dst);

    unsigned char* psrc = (unsigned char*)src->imageData+ rcSrc.y * src->widthStep + rcSrc.x * src->nChannels;
    unsigned char* pdst = (unsigned char*)dst->imageData+ rcDst.y * dst->widthStep + rcDst.x * dst->nChannels;
    unsigned char* pargb = (unsigned char*)srcARGB->imageData+ rcArgb.y * srcARGB->widthStep + rcArgb.x * srcARGB->nChannels;
    for(int h =0 ; h < rcSrc.height; h++){
        unsigned char* ps = psrc+ h * src->widthStep;
        unsigned char* pd = pdst+ h * dst->widthStep;
        unsigned char* pa = pargb+ h * srcARGB->widthStep;
        for(int w=0; w < rcSrc.width; w++){
            for(int ch =0 ; ch < 3; ch++){
                pd[ch] = (ps[ch] * (255 - pa[3]) + pa[ch] * pa[3])/255;
            }
            ps += 3;
            pd += 3;
            pa += 4;
        }
    }
}

// "selective color " in photoshop
// input: rgbIn,color to change,other parameters are corresponding to photoshop
//      "selective color" setting panel
// output: rgbOut,processed color
// const int SELECTIVE_COLOR_RED = 2;
// const int SELECTIVE_COLOR_GREEN = 1;
// const int SELECTIVE_COLOR_BLUE = 0;
// const int SELECTIVE_COLOR_CYAN = 3;
// const int SELECTIVE_COLOR_MAGENTA = 4;
// const int SELECTIVE_COLOR_YELLOW = 5;
// const int SELECTIVE_COLOR_WHITE = 6;
// const int SELECTIVE_COLOR_NEUTRAL = 7;
// const int SELECTIVE_COLOR_BLACK = 8;
SelectiveColor(unsigned char* rgbIn,unsigned char* rgbOut,int detaCyan,
            int detaMagenta,int detaYellow ,int detaKey ,int selectedColor, bool isRelative)
{
    detaCyan = RANGE(detaCyan,-100,100);
    detaYellow = RANGE(detaYellow,-100,100);
    detaMagenta = RANGE(detaMagenta,-100,100);
    unsigned char r = rgbIn[2];
    unsigned char g = rgbIn[1];
    unsigned char b = rgbIn[0];
    // range of change
    int changeRange = 0;
    // selected Color
    int rgbColor = -1,cmyColor = -1,grayColor =-1;
    if(r > g && r > b){
        rgbColor = SELECTIVE_COLOR_RED;
        changeRange = r - max(g,b);
    }else if(g > r && g > b){
        rgbColor = SELECTIVE_COLOR_GREEN;
        changeRange = g - max(r,b);
    }else if(b > g && b > r){
        rgbColor = SELECTIVE_COLOR_BLUE;
        changeRange = b - max(r,g);
    }
    // whether this color can be selected
    if(selectedColor != rgbColor && selectedColor != cmyColor &&
        selectedColor != grayColor){//only rgb mode can be selected for now
        memcpy(rgbOut,rgbIn,3);
        return;
    }


    // increase cyan == decrease red
    // increase yellow == decrease blue
    // increase magenta == decrease green
    // vice versa
    if(isRelative){
        if(detaCyan>0){
            r -= changeRange * detaCyan /255./100. ;
        }else{
            r += (r - 255 ) * detaCyan * changeRange/255./100. ;
        }
        if(detaYellow>0){
            b -= changeRange * detaYellow /255./100. ;
        }else{
            b += (b - 255 ) * detaYellow * changeRange/255./100. ;
        }
        if(detaMagenta>0){
            g -= changeRange * detaMagenta /255./100. ;
        }else{
            g += (g - 255 ) * detaMagenta * changeRange/255./100. ;
        }
    }else{//only relative supported for now
    }

    rgbOut[0] = b;
    rgbOut[1] = g;
    rgbOut[2] = r;
}

HighPassFilter(src ,_dst,int radius )
{
    dst = _dst;
    if(dst == src){
        dst = cvCreateImage(cvGetSize(src),8,src->nChannels);
    }
    radius = radius * 2 +1;
    cvSmooth(src,dst,CV_BLUR,radius);
    for(int h =0 ; h < src->height; h ++){
        unsigned char* ps  =(unsigned char*)src->imageData + h* src->widthStep;
        unsigned char* pd  =(unsigned char*)dst->imageData + h* dst->widthStep;
        for(int w = 0 ; w < src->width; w ++){
            for(int n =0 ; n < src->nChannels; n++){
                *pd = (*ps + 255 - *pd )/2;
                pd ++;
                ps ++;
            }
        }
    }
    if(dst != _dst){
        cvCopyImage(dst,_dst);
        cvReleaseImage(&dst);
    }
}

// color balance , algorithm from gimp
// all parameters correspond to gimp panel:
//      incXXXXXX, ranges in [-100,100]
ColorBalance(src, dst,int incCyanRed , int incMagentaGreen,
    int incYellowBlue , bool isPreserveLuminosity )
{
    incCyanRed = RANGE(incCyanRed,-100,100);
    incMagentaGreen = RANGE(incMagentaGreen,-100,100);
    incYellowBlue = RANGE(incYellowBlue,-100,100);
    float  cyan_red = incCyanRed;
    float  magenta_green = incMagentaGreen;
    float  yellow_blue =incYellowBlue;

    unsigned char   r_lookup[256];
    unsigned char   g_lookup[256];
    unsigned char   b_lookup[256];

    //  for lightening  
    float  color_add[256] ;
    //  for darkening  
    float  color_sub[256] ;
    // create table
    for (int i = 0; i < 256; i++){
        //float low = (1.075 - 1 / ((float) i / 16.0 + 1));
        float mid = 0.667 * (1 - SQR ((i - 127.0) / 127.0));
        color_add[i] = mid;
        color_sub[i] = mid;
    }

    float *cyan_red_transfer;
    float *magenta_green_transfer;
    float *yellow_blue_transfer;

    cyan_red_transfer =(cyan_red > 0) ? color_add : color_add;
    magenta_green_transfer = (magenta_green > 0) ? color_add : color_add;
    yellow_blue_transfer = (yellow_blue > 0) ? color_add : color_sub;

    for (int i = 0; i < 256; i++){
        int r_n = i;
        int g_n = i;
        int b_n = i;

        r_n += cyan_red * cyan_red_transfer[r_n];
        r_n = RANGE0255 (r_n);
        g_n += magenta_green * magenta_green_transfer[g_n];
        g_n = RANGE0255 (g_n);
        b_n += yellow_blue * yellow_blue_transfer[b_n];
        b_n = RANGE0255 (b_n);

        r_lookup[i] = r_n;
        g_lookup[i] = g_n;
        b_lookup[i] = b_n;
    }
    // look up table
    back = cvCloneImage(src);
    for(int h =0; h < src->height; h ++){
        unsigned char* ps = (unsigned char*)src->imageData + src->widthStep * h;
        unsigned char* pd = (unsigned char*)dst->imageData + dst->widthStep * h;
        for(int w =0; w < src->width; w++){
            *pd ++ = b_lookup[*ps++];
            *pd ++ = g_lookup[*ps++];
            *pd ++ = r_lookup[*ps++];
        }
    }
    // luminosity
    if(isPreserveLuminosity){
        cvCvtColor(back,back,CV_BGR2HLS);
        cvCvtColor(dst,dst,CV_BGR2HLS);
        cvSetImageCOI(back,2);
        cvSetImageCOI(dst,2);
        cvCopyImage(back,dst);
        cvSetImageCOI(back,0);
        cvSetImageCOI(dst,0);

        cvCvtColor(dst,dst,CV_HLS2BGR);
    }
    cvReleaseImage(&back);
}

PhotoFilter(src, dst,CvScalar color,int density ,bool isPreserveLuminosity )
{
    back = cvCloneImage(src);
    colorLayer = cvCreateImage(cvGetSize(src),8,3);
    cvSet(colorLayer,color);
    psBlendingMultiply(src,colorLayer,dst);
    psBlendingAlpha(dst,back,density/100.,dst);

    // luminosity
    if(isPreserveLuminosity){
        cvCvtColor(back,back,CV_BGR2HLS);
        cvCvtColor(dst,dst,CV_BGR2HLS);
        cvSetImageCOI(back,2);
        cvSetImageCOI(dst,2);
        cvCopyImage(back,dst);
        cvSetImageCOI(back,0);
        cvSetImageCOI(dst,0);

        cvCvtColor(dst,dst,CV_HLS2BGR);
    }
    cvReleaseImage(&colorLayer);
    cvReleaseImage(&back);
}

*/