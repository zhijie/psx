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
 * implements operations in Photoshop cs6 menu:Filter->Other
 */

PSX.Filter.Other = {};

// minimum filter
PSX.Filter.Other.minimum = function(src,_dst,filterRadius)
{
	var dst = _dst;
	if(src == dst) {
		dst = PSX.Util.cloneImageData(src);
	}
	
    var filterWidth=(filterRadius<<1)+1;
/* TODO:
    for (var h=0;h<src.height - filterWidth; h++){
        for (var w=0;w<src.width - filterWidth; w++){
            //copy filter region to array ,find minimum
            var block =[];
            for (int f=0;f<filterWidth;f++){
                memcpy(parr,pExt,filterWidth);
                p+=ext->widthStep;
                parr+=filterWidth;
            }
            *pDst++=*std::min_element(arr,arr+arrSize);
            pExt++;
        }
    }
  */ 
    if(dst != _dst){
    	_dst = PSX.Util.cloneImageData(dst);
    }
};