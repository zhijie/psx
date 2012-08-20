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
 * implements operations in Photoshop cs6 menu:Image->Adjustments
 */

PS.Image.Adjustment = {};

// desaturate
PS.Image.Adjustment.desaturate = function(src,dst)
{
    var len = src.width*src.height*4;
    for(var i =0; i < len; i+= 4) {
        var r = src[i];
        var g = src[i + 1];
        var b = src[i + 2];
        var minV=b>g?g:b;
        minV=minV>r?r:minV;
        var maxV=b<g?g:b;
        maxV=minV<r?r:maxV;

        minV=(minV+maxV)/2;
        dst[i] = minV;
        dst[i + 1] = minV;
        dst[i + 2] = minV;
    }
};

//invert color
PS.Image.Adjustment.invertColor = function(src,dst)
{
    var len = src.width*src.height*4;
    for(var i =0; i < len; i+= 4) {
        for (var ch=0; ch <3; ch++) {
            dst[i + ch] = 255 - src[i - ch];
        };
    }
};


