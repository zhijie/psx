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
 * implements operations in Photoshop cs6 menu:Filter->Stylize
 */

PSX.Filter.Stylize = {};

// solarize in photoshop,i.e. over exposuse
PSX.Filter.Stylize.solarize = function(src, dst)
{
	var len = src.width * src.height * 4;
	for(var i =0;  i < len; i+=4){
		for(var ch =0; ch < 3; ch++){
			var v = src.data[i + ch];
			dst.data[i + ch] = v <128 ? v:255 -v;
		}		
	}
}

PSX.Filter.Stylize.emboss = function(src, _dst)
{
    var dst = _dst;
    if(dst == src){
        dst = PSX.Util.copyImageData(src);
    }
	var nChannel = 4;
	var widthStep = src.width * nChannel;
    for(var h = 1; h < src.height -1; h++){
		var psrc = nChannel + h * widthStep;
		var psrcUp = psrc - widthStep - nChannel;
		var psrcDown = psrc + widthStep + nChannel;
		var pdst = nChannel + h * widthStep;
		for(var w =1; w < src.width -1; w++){
			for(var ch =0; ch < 3; ch++){
				dst.data[pdst + ch] = PSX.Util.clamp0255(src.data[psrcUp] * 2 - src.data[psrc] - src.data[psrcDown] + 128);
			}
			psrc +=4;
			psrcUp +=4;
			psrcDown +=4;
			pdst +=4;
		}
	}
	// TODO : boarder process
	
    if(dst != _dst){
        _dst = PSX.Util.copyImageData(dst);
    }
}