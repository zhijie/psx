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

PsxEffects.Overlay = {};
PsxEffects.Overlay.textoverlay=function(src,dst){

    //temporary image data
    var tmpData=PSX.Util.cloneImageData(src);
    var overlayData=PSX.Util.getImageDataById("canvas_text");
    var srcWidth=src.width;
    var srcHeight=src.height;
    var r,g,b;

    for(var i=0;i<srcWidth*srcHeight*4;i=i+4)
    {
        r=src.data[i];
        g=src.data[i+1];
        b=src.data[i+2];
        var k=50;
        var u=205;
        //black
        if(overlayData.data[i]<k&&overlayData.data[i+1]<k&&overlayData.data[i+2]<k)
        {

            tmpData.data[i]=r-50;
            tmpData.data[i+1]=g-50;
            tmpData.data[i+2]=b-50;

        }
        else
        if(overlayData.data[i]>u&&overlayData.data[i+1]<k&&overlayData.data[i+2]<k)
        {
            //red
            tmpData.data[i]=r-50;
            tmpData.data[i+1]=g;
            tmpData.data[i+2]=b
        }
        else
        if(overlayData.data[i]<k&&overlayData.data[i+1]>u&&overlayData.data[i+2]<k)
        {
            //green
            tmpData.data[i]=r;
            tmpData.data[i+1]=g-50;
            tmpData.data[i+2]=b;
        }
        else
        if(overlayData.data[i]<k&&overlayData.data[i+1]<k&&overlayData.data[i+2]>u)
        {

            //blue
            tmpData.data[i]=r;
            tmpData.data[i+1]=g;
            tmpData.data[i+2]=b-180;
        }
        else
        {
            tmpData.data[i]=r;
            tmpData.data[i+1]=g;
            tmpData.data[i+2]=b;
        }
    }
    PSX.Util.copyArray(tmpData.data,dst.data);
}

PsxEffects.Overlay.imageoverlay=function(src,dst){

    var tmpData=PSX.Util.cloneImageData(src);
    var overlayData=PSX.Util.getImageDataById("steve_jobs");
    var srcWidth=src.width;
    var srcHeight=src.height;
    var r,g,b;
    for(var i=0;i<srcWidth*srcHeight*4;i=i+4)
    {
        r=src.data[i];
        g=src.data[i+1];
        b=src.data[i+2];
        var w=115;
        var k=40;
        if(overlayData.data[i]>w&&overlayData.data[i+1]>w&&overlayData.data[i+2]>w)
        {
            tmpData.data[i]=r;
            tmpData.data[i+1]=g;
            tmpData.data[i+2]=b;
        }
        else
        {

            tmpData.data[i]=r-k;
            tmpData.data[i+1]=g-k;
            tmpData.data[i+2]=b-k;

        }


    }
    PSX.Util.copyArray(tmpData.data,dst.data);
}

PsxEffects.Overlay.border1=function(src,dst){

    var tmpData=PSX.Util.cloneImageData(src);
    var overlayData=PSX.Util.getImageDataById("border1");
    var srcWidth=src.width;
    var srcHeight=src.height;
    var r,g,b;
    var k=50;
    for(var i=0;i<srcWidth*srcHeight*4;i=i+4)
    {

        r=src.data[i];
        g=src.data[i+1];
        b=src.data[i+2];
        if(overlayData.data[i+3]==0)
        {
            tmpData.data[i]=r;
            tmpData.data[i+1]=g;
            tmpData.data[i+2]=b;
        }
        else
        {

            tmpData.data[i]=r-k;
            tmpData.data[i+1]=g-k;
            tmpData.data[i+2]=b-k;

        }


    }
    PSX.Util.copyArray(tmpData.data,dst.data);
}

PsxEffects.Overlay.border2=function(src,dst){

    var tmpData=PSX.Util.cloneImageData(src);
    var overlayData=PSX.Util.getImageDataById("border1");
    var srcWidth=src.width;
    var srcHeight=src.height;
    var r,g,b;
    var k=10;
    for(var i=0;i<srcWidth*srcHeight*4;i=i+4)
    {

        r=src.data[i];
        g=src.data[i+1];
        b=src.data[i+2];
        var h=.1;
        if(i%12000==0)
            k=Math.random()*100;
        if(overlayData.data[i+3]==0)
        {
            tmpData.data[i]=r+r*h;
            tmpData.data[i+1]=g+g*h;
            tmpData.data[i+2]=b+b*h;
        }
        else
        {

            tmpData.data[i]=r-k;
            tmpData.data[i+1]=g-k;
            tmpData.data[i+2]=b-k;

        }


    }
    PSX.Util.copyArray(tmpData.data,dst.data);
}

