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
PS.Util = {};

PS.Util.isArray =function(value)
{
	return typeof(value)=='object'&&(value instanceof(Array));
}

// src dst should be pre allocated.
PS.Util.copyArray = function(src,dst,srcStart,dstStart,length)
{
	srcStart = typeof(srcStart) == 'undefined' ? 0 : srcStart;
	dstStart = typeof(dstStart) == 'undefined' ? 0 : dstStart;
	length = typeof(length) == 'undefined' ? 0 : length;
	length = Math.min(length,src.length - srcStart, dst.length - dstStart);
	for(var i =0; i < length; i++){
		dst[dstStart +i] = src[srcStart + i];
	}
}

PS.Util.clamp0255 = function(value)
{
	 return value > 255 ? 255 : ( value < 0 ? 0 : value);
};
PS.Util.clamp = function(val, from, to)
{
	return ((val) < (from) ? (from) : ((val) > (to) ? (to): (val)));
};

PS.Util.mix = function(x, y, alpha)
{
	return (x * (1 - alpha) + y * (alpha));
};
PS.Util.sqr = function (x)
{
	return x * x;
};

PS.Util.cloneImageData = function(imageData) 
{
	  var canvas, context;
	  canvas = document.createElement('canvas');
	  canvas.width = imageData.width;
	  canvas.height = imageData.height;
	  context = canvas.getContext('2d');
	  context.putImageData(imageData, 0, 0);
	  return context.getImageData(0, 0, imageData.width, imageData.height);
};

// run convolution on ImageData
PS.Util.convolution = function(src,_dst,kernel)
{
	var dst = _dst;
    if(dst == src){
        dst = PS.Util.copyImageData(src);
    }
    var kh = kernal.length;
	var kw = kernal[0].length;
	
    if(dst != _dst){
        _dst = PS.Util.copyImageData(dst);
    }
}

// resize ImageData
PS.Util.resize = function(src,dst)
{
	
}