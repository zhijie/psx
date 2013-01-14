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
PsxEffects.Convolution = {};
PsxEffects.Convolution.edgedetect=function(src,dst)
{
	var edgeDetectFilter=[-1,-1,-1,
						  -1, 8,-1,
				          -1,-1,-1];
	PSX.Filter.Convolution.main(src,dst,edgeDetectFilter);
}
PsxEffects.Convolution.sharpen=function(src,dst)
{
	var sharpenFilter=[-1,-1,-1,
					   -1, 9,-1,
				       -1,-1,-1];
	PSX.Filter.Convolution.main(src,dst,sharpenFilter);
}
PsxEffects.Convolution.unsharpen=function(src,dst)
{
	var unsharpenFilter=[-1,-1,-1,
					   -1, 17,-1,
				       -1,-1,-1];
	PSX.Filter.Convolution.main(src,dst,unsharpenFilter);
}
PsxEffects.Convolution.emboss=function(src,dst)
{
	var embossFilter= [2,0,0,
					   0,-1,0,
				       0,0,-1];
	PSX.Filter.Convolution.main(src,dst,embossFilter);
}

PsxEffects.Convolution.blur=function(src,dst)
{
	var blurFilter=[1/9,1/9,1/9,
					1/9,1/9,1/9,
					1/9,1/9,1/9];
	PSX.Filter.Convolution.main(src,dst,blurFilter);
}

