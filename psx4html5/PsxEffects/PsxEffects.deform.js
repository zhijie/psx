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

PsxEffects.Deform = {};

PsxEffects.Deform.mirror = function(src,dst,type)
{
	if(dst != src){
		PSX.Util.copyArray(src.data,dst.data);
	}
    var left2right = function(src,dst) {
        var widthStep = src.width*4;
        for(var h =0; h < src.height; h++) {
            var offset = h * src.width*4;
			for(var i =0; i <widthStep/2; i += 4){
				for(var ch =0; ch < 4; ch++) {
					dst.data[offset + widthStep - i - 4 + ch] = dst.data[offset + i + ch];
                }
			}
        }
    };
    var right2left = function(src,dst) {
        var widthStep = src.width*4;
        for(var h =0; h < src.height; h++) {
            var offset = h * src.width*4;
			for(var i =0; i <widthStep/2; i += 4){
				for(var ch =0; ch < 4; ch++) {
					dst.data[offset + i + ch] = dst.data[offset + widthStep - i - 4 + ch];
                }
			}
        }
    };
    var top2bottom = function(src,dst) {        
        var widthStep = src.width*4;
		var psrc =0;
		var pdst = dst.data.length - widthStep;
        for(var h =0; h < src.height/2; h++) {
            PSX.Util.copyArray(src.data,dst.data,psrc,pdst,widthStep);
            psrc += widthStep;
            pdst -= widthStep;
        }
    };
    var bottom2top = function(src,dst) {
        var widthStep = src.width*4;
		var pdst =0;
		var psrc = dst.data.length - widthStep;
        for(var h =0; h < src.height/2; h++) {
            PSX.Util.copyArray(src.data,dst.data,psrc,pdst,widthStep);
            psrc -= widthStep;
            pdst += widthStep;
        }
    };
    switch(type) {
        case "left2right":
            left2right(src,dst);
            break;
        case "right2left":
            right2left(src,dst);
            break;
        case "top2bottom":
            top2bottom(src,dst);
            break;
        case "bottom2top":
            bottom2top(src,dst);
            break;
    }
};

// used by effects below
PsxEffects.Deform.reshaper = function(src,_dst,func)
{
    var dst = _dst;
    if(dst == src){
        dst = PSX.Util.cloneImageData(src);
    }
    var radiusLength = function(coord) {
        return Math.sqrt(coord[0] * coord[0] + coord[1] * coord[1]);
    }
    for(var h =0; h < dst.width; h++){
        var pdst = h * dst.width * 4;
        for(var w =0; w < dst.width; w++){
            // change coordinates to [-1,1]            
            var normalCoord = [2.0 * w/src.width -1,2.0 * h/src.height -1];
            var radius = radiusLength(normalCoord);
            var phase = Math.atan2(normalCoord[1],normalCoord[0]);
            var t = func(radius,phase);
            radius = t[0];
            phase = t[1];
            var newx = radius * Math.cos(phase);
            var newy = radius * Math.sin(phase);
            var centerX = (newx + 1)/2 * src.width;
            var centerY = (newy +1)/2 * src.height;
            
            var baseX = Math.floor(centerX);
            var baseY = Math.floor(centerY);
            var ratioR = centerX - baseX;
            var ratioL = 1 - ratioR;
            var ratioB = centerY - baseY;
            var ratioT = 1 -ratioB;
            if(baseX < 0 || baseY <0 || baseX >= src.width || baseY >= src.height){
                pdst +=4;
                continue;
            }
            // topleft
            var pstl = (baseX + baseY * src.width) * 4;
            // topright
            var pstr = pstl + 4;
            // bottomleft
            var psbl = pstl + src.width * 4;
            // bottom right
            var psbr = psbl +4;
            for(var ch =0; ch < 4; ch++){
                var tc = src.data[ pstl++] * ratioL + src.data[ pstr++] * ratioR;
                var bc = src.data[ psbl++] * ratioL + src.data[ psbr++] * ratioR;
                dst.data[pdst++] = tc * ratioT + bc * ratioB;
            }
        }
    }
	if(dst != _dst){
        PSX.Util.copyArray(dst.data,_dst.data);
    }
}
PsxEffects.Deform.fisheye = function(src,dst)
{
    var param = 1.5;// [0.1, 4]
    var func = function(r,p) {
        return [Math.pow(r,param)/Math.sqrt(2),p];
    }
    PsxEffects.Deform.reshaper(src,dst,func);
};
PsxEffects.Deform.shrink = function(src,dst)
{
    var param1 = 1.8;        // [1, 3]
    var param2 = 0.8;        // [0.1, 2]
    var func = function(r,p) { 
        return [Math.pow(r,1.0/param1)*param2, p];
    }
    PsxEffects.Deform.reshaper(src,dst,func);
};

PsxEffects.Deform.swirl = function(src,dst)
{
    var param1 = 0.5;          // [0, 2]
    var param2 = 4.0;          // [1, 9]
    var func = function(r,p) {
        p = p + (1.0 - PSX.Util.smoothstep(r, -param1, param1)) * param2;
        return [r, p];
    }
    PsxEffects.Deform.reshaper(src,dst,func);
};

PsxEffects.Deform.wave = function(src,dst)
{
    //TODO:
};

PsxEffects.Deform.mosaic = function(src,dst)
{
	var tilesize = 10;
	var widthStep = src.width*4;
	var pdst =0;
	for(var h =0; h < src.height; h++) {
	    if( h % tilesize == 0){
	        for(var w =0; w < src.width; w ++){
    	        if(w % tilesize == 0){
    	            for(var ch =0; ch < 4; ch++) {
                        dst.data[pdst + ch] = src.data[pdst + ch];              
                    }
    	        }else {
    	            for(var ch =0; ch < 4; ch++) {                 
                        dst.data[pdst + ch] = dst.data[pdst -4 + ch];               
                    }
    	        }
    	        pdst += 4;
    	    }
	    }else {
	        PSX.Util.copyArray(dst.data,dst.data,pdst - widthStep,pdst,widthStep);
	        pdst += widthStep;
	    }
	}
};