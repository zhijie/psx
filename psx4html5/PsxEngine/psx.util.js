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


// utility functions
PSX.Util = {};

PSX.Util.isArray =function(value)
{
	return typeof(value)=='object'&&(value instanceof(Array));
}

// src dst should be pre allocated.
PSX.Util.copyArray = function(src,dst,srcStart,dstStart,length)
{
	srcStart = typeof(srcStart) == 'undefined' ? 0 : srcStart;
	dstStart = typeof(dstStart) == 'undefined' ? 0 : dstStart;
	length = typeof(length) == 'undefined' ? src.length : length;
	length = Math.min(length,src.length - srcStart, dst.length - dstStart);
	for(var i =0; i < length; i++){
		dst[dstStart +i] = src[srcStart + i];
	}
}

PSX.Util.clamp0255 = function(value)
{
	 return value > 255 ? 255 : ( value < 0 ? 0 : value);
};
PSX.Util.clamp = function(val, from, to)
{
	return ((val) < (from) ? (from) : ((val) > (to) ? (to): (val)));
};

PSX.Util.mix = function(x, y, alpha)
{
	return (x * (1 - alpha) + y * (alpha));
};
PSX.Util.sqr = function (x)
{
	return x * x;
};
PSX.Util.smoothstep = function(x,edge0,edge1)
{
    x = PSX.Util.clamp((x -edg0) / (edge1 - edge0),0.0,1.0);
    return x * x * (3 - 2 * x);
}

PSX.Util.cloneImageData = function(imageData) 
{
	  var canvas, context;
	  canvas = document.createElement('canvas');
	  canvas.width = imageData.width;
	  canvas.height = imageData.height;
	  context = canvas.getContext('2d');
	  context.putImageData(imageData, 0, 0);
	  return context.getImageData(0, 0, imageData.width, imageData.height);
};

PSX.Util.createImageData = function(width,height) 
{
	var canvas, context;
	canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	context = canvas.getContext('2d');
	return context.getImageData(0, 0, width, height);
};

// run convolution on ImageData
PSX.Util.convolution = function(src,_dst,kernel)
{
	var dst = _dst;
    if(dst == src){
        dst = PSX.Util.copyImageData(src);
    }
    var kh = kernal.length;
	var kw = kernal[0].length;
	//TODO:
    
    
    if(dst != _dst){
        _dst = PSX.Util.copyImageData(dst);
    }
}

// paremeters:
//	src,dst:ImageData. 
//	type : BILINEAR(default) or NEARST
PSX.Util.resize= function(src,dst,type)
{
	if(src.width == dst.width && src.height == dst.height) {
		copyArray(src.data,dst.data);
		return;
	}
	type = typeof(type) == 'undefined' ? 'BILINEAR' : type;
	var scaleW = 1.0*src.width/dst.width;
	var scaleH = 1.0*src.height/dst.height;
	if(type == 'NEARST'){
		var newW = new Array();
		var newH = new Array();
		for(var w =0; w < dst.width; w++){
			newW[w] = Math.round(w * scaleW);
		}
		for(var h =0; h < dst.width; h++){
			newH[h] = Math.round(h * scaleH);
		}		
		for(var h =0; h < dst.width; h++){
			var psrc = newH[h] * src.width * 4;
			var pdst = h * dst.width * 4;
			for(var w =0; w < dst.width; w++){
				var ps = psrc + newW[w] * 4;
				for(var ch =0; ch < 4; ch++){
					dst.data[pdst++] = src.data[ ps++];
				}
			}
		}
	}else {// BILINEAR
		// return subpixel position of corresponding pixel in src
		var getOrgPos = function(w,h) {
			var orgpos = new Array();
			orgpos[0] = w * scaleW;
			orgpos[1] = h * scaleH;
			return orgpos;
		};
		
		for(var h =0; h < dst.width; h++){
			var pdst = h * dst.width * 4;
			for(var w =0; w < dst.width; w++){
				var orgxy = getOrgPos(w,h);
				var centerX = orgxy[0];
				var centerY = orgxy[1];
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
	}
}