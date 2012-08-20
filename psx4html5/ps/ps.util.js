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