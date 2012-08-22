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
 * implements operations in Photoshop cs6 menu:Image->Mode
 * color space conversion 
 */
PSX.Image.Mode = {};

PSX.Image.Mode.rgb2gray = function(src,dst) 
{
    var len = src.data.length;
    for(var i =0; i < len; i+= 4) {
    	var gray = (src.data[i]>>2) + (src.data[i + 1] >> 1) + (src.data[i + 2] >> 2);	
        for (var ch=0; ch <3; ch++) {
            dst.data[i + ch] = gray;
        };
    }
};

PSX.Image.Mode.rgb2yuv = function(src,_dst) 
{
    var dst = _dst;
    if(dst == src){
        //TODO: bug here
        dst = PSX.Util.copyImageData(src);
        
    }
    var len = src.data.length;
    for(var i =0; i < len; i+= 4) {
		dst.data[i] = PSX.Util.clamp0255((src.data[i] * 0.257 ) + (src.data[i + 1] * 0.504) + (src.data[i + 2] * 0.098) + 16); // y
		dst.data[i + 1] = PSX.Util.clamp0255((src.data[i] * 0.439) - (src.data[i + 1] * 0.368) - (src.data[i + 2] * 0.071) + 128); // u
		dst.data[i + 2] = PSX.Util.clamp0255(- (src.data[i] * 0.148) - (src.data[i + 1] * 0.291) + (src.data[i + 2] * 0.439) + 128); // v
    }
    if(dst != _dst){
        //_dst = PSX.Util.copyImageData(dst);
        PSX.Util.copyArray(dst.data,_dst.data);
    }
};


PSX.Image.Mode.yuv2rgb = function(src,_dst) 
{
    var dst = _dst;
    if(dst == src){
        dst = PSX.Util.copyImageData(src);
    }
    var len = src.data.length;
    for(var i =0; i < len; i+= 4) {
		var y1 = 1.164 * (src.data[i] - 16);
		dst.data[i] = PSX.Util.clamp0255(y1 + 2.018 * (src.data[i + 1] - 128)); // y
		dst.data[i + 1] = PSX.Util.clamp0255(y1 - 0.813 * (src.data[i + 2] - 128) - 0.391 *(src.data[i + 1] - 128)); // u
		dst.data[i + 2] = PSX.Util.clamp0255(y1 + 1.596 * (src.data[i + 2] - 128)); // v
    }
    if(dst != _dst){
        //_dst = PSX.Util.copyImageData(dst);
        PSX.Util.copyArray(dst.data,_dst.data);
    }
};


PSX.Image.Mode.rgb2hsv = function(src,dst) 
{
    var len = src.data.length;
    for(var i =0; i < len; i+= 4) {
		var R = src.data[i]/255.0;
		var G = src.data[i + 1] / 255.0;
		var B = src.data[i + 2] / 255.0;
		var value = Math.max(R, Math.max(G, B));
		var saturation = value ==0 ? 0 :( 1.0 - Math.min(R,Math.min(G,B))/value);
		var hue = 0;
		if (value == R)
		{
			hue = 60 * (G - B)/saturation;
		}
		else if (value == G)
		{
			hue = 120 + 60 * (B - R) / saturation;
		}
		else
		{
			hue = 240 + 60 * (R - G ) / saturation;
		}
		if (hue < 0)
		{
			hue += 360;
		}
		dst.data[i] = hue/2; // h
		dst.data[i + 1] = saturation * 255;//s
		dst.data[i + 2] = value * 255;//
    }
};

PSX.Image.Mode.hsv2rgb = function(src,dst) 
{
    var len = src.data.length;
    for(var i =0; i < len; i+= 4) {
		var hue = src.data[i] * 2;
		var saturation = src.data[i + 1];
		var value = src.data[i + 2];
        
		var tmp = hue / 60.0;
		var hi = floor(tmp)%6;
		var f = tmp - floor(tmp);
		var p = value * (255 - saturation)/255;
		var q = value * (255 - f * saturation)/255;
		var t = value * (255 - (1 - f) * saturation)/255;
		var rgb = [
			[value,t,p],
			[q,value,p],
			[p,value,t],
			[p,q,value],
			[t,p,value],
			[value,p,q]
		];
		dst.data[i] = rgb[hi][i];
		dst.data[i + 1] = rgb[hi][i + 1];
		dst.data[i + 2] = rgb[hi][i + 2];
    }
};

PSX.Image.Mode.rgb2hsl = function(src,dst) 
{
    var len = src.data.length;
    for(var i =0; i < len; i+= 4) {
		var h = 0, s = 0, l = 0;
		// normalizes red-green-blue values
		var r = src.data[i] / 255.0;
		var g = src.data[i + 1] / 255.0;
		var b = src.data[i + 2] / 255.0;
        
		var maxVal = Math.max(r, Math.max(g, b));
		var minVal = Math.min(r, Math.min(g, b));
        
		if (maxVal == minVal){
			h = 0;
		}else if (maxVal == r){
			h = 60.0 * (g - b) / (maxVal - minVal);
		}else if (maxVal == g){
			h = 60.0 * (b - r) / (maxVal - minVal) + 120.0;
		}else if (maxVal == b){
			h = 60.0 * (r - g) / (maxVal - minVal) + 240.0;
		}
        
		if (h < 0) {
			h += 360;
		}
        
		l = (maxVal + minVal) / 2.0;
        
		// saturation
		if (maxVal == minVal){
			s = 0;
		}else if (l < 0.5){
			s = (maxVal - minVal) / (maxVal + minVal);
		}else if (l >= 0.5){
			s = (maxVal - minVal) / (2 - maxVal - minVal);
		}
		dst.data[i] = h / 2;
		dst.data[i + 1] = s * 255;
		dst.data[i + 2] = l * 255;
    }
};
/*
PSX.Image.Mode.rgb2hsl = function(src,dst) 
{
    var len = src.data.length;
    for(var i =0; i < len; i+= 4) {
		var h = src.data[i] * 2;
		var s = src.data[i + 1] / 255.0;
		var l = src.data[i + 2] / 255.0;
        
        
		var r, g, b;
		if (src.data[i + 1] == 0){
			r = g = b = l * 255.0;
		}else{
			var q = (l < 0.5) ? (l * (1.0 + s)) : (l + s - (l * s));
			var p = (2.0 * l) - q;
			var Hk = h / 360.0;
			var T = new Array();
			T[i] = Hk + 0.3333333f;
			T[i + 1] = Hk;
			T[i + 2] = Hk - 0.3333333f;
            
			for (var i = 0; i < 3; i++)
			{
				if (T[i] < 0) T[i] += 1.0;
				if (T[i] > 1) T[i] -= 1.0;
				if ((T[i] * 6) < 1){
					T[i] = p + ((q - p) * 6.0 * T[i]);
				}else if ((T[i] * 2.0) < 1){
					T[i] = q;
				}else if ((T[i] * 3.0) < 2)  {// 0.5<=T[i] && T[i]<(2.0/3.0){
					T[i] = p + (q - p) * ((2.0 / 3.0) - T[i]) * 6.0;
                }else{
                    T[i] = p;
                }
            }

            r = T[i] * 255.0;
            g = T[i + 1] * 255.0;
            b = T[i + 2] * 255.0;
        }
        dst.data[i] = PSX.Util.clamp0255(r);
        dst.data[i + 1] = PSX.Util.clamp0255(g);
        dst.data[i + 2] = PSX.Util.clamp0255(b);
    }
};
*/


