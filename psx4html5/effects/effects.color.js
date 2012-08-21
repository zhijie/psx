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

Effects.Color = {};

// blackwhite
Effects.Color.blackwhite = function(src, dst) {
	PS.Image.Adjustment.desaturate(src,dst);
};

// invert colors 
Effects.Color.invertColor = function(src, dst){
	PS.Image.Adjustment.invertColor(src,dst);
};

Effects.Color.infrared = function(src,dst)
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
	PS.Image.Adjustment.mapping(src,dst,colormap);
}