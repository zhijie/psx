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

PsxEffects.Color = {};

// blackwhite
PsxEffects.Color.blackwhite = function(src, dst) {
	PSX.Image.Adjustment.desaturate(src,dst);
};

// invert colors 
PsxEffects.Color.invertColor = function(src, dst){
	PSX.Image.Adjustment.invertColor(src,dst);
};

PsxEffects.Color.solarize = function(src, dst){
	PSX.Filter.Stylize.solarize(src,dst);
};

PsxEffects.Color.emboss = function(src, dst){
	PSX.Filter.Stylize.emboss(src,dst);
};

PsxEffects.Color.infrared = function(src,dst)
{
	var colormap = [[],[],[]];
	for (var i=0;i<128;i++){
		colormap[0][i]=i<<1;
		colormap[1][i]=0;
		colormap[2][i]=255-colormap[0][i];
		colormap[0][i+128]=colormap[1][i];
		colormap[1][i+128]=colormap[2][i];
		colormap[2][i+128]=0;
	}
	PSX.Image.Adjustment.mapping(src,dst,colormap);
};
// sepia/brown color tone, 
PsxEffects.Color.sepia = function(src, dst){
PSX.Image.Mode.rgb2yuv(src,dst);
return;
    // TODO: constant pre calculation
	var r = 130;
	var g = 220;
	var b = 81;
	var u = r * -0.168736 + g * -0.331264 + b *  0.500000 + 128;
	var v = r *  0.500000 + g * -0.418688 + b * -0.081312 + 128;
	PSX.Image.Mode.rgb2yuv(src,dst);
	var len = src.data.length;
	for(var i=0;i < len; i+=4) {
		dst.data[i + 1] = u;
		dst.data[i + 2] = v;
	}
	PSX.Image.Mode.yuv2rgb(dst,dst);
};

// blue color tone
PsxEffects.Color.bluetone = function(src, dst){
    // TODO: constant pre calculation
	var r = 130;
	var g = 220;
	var b = 81;
	var u = r * -0.168736 + g * -0.331264 + b *  0.500000 + 128;
	var v = r *  0.500000 + g * -0.418688 + b * -0.081312 + 128;
	PSX.Image.Mode.rgb2yuv(src,dst);
	var len = src.data.length;
	for(var i=0;i < len; i+=4) {
		dst.data[i + 1] = v;
		dst.data[i + 2] = u;
	}
	PSX.Image.Mode.yuv2rgb(dst,dst);
};