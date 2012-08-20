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

Effects.Deform = {};

Effects.Deform.mirror = function(src,dst,type)
{
    var left2right = function(src,dst) {
        var widthStep = src.width*4;
        for(var h =0; h < len; h++) {
            var offset = h * src.width*4;
            for(var w =0; w < src.width/2; w++){
                for(var ch =0; ch < 4; ch++) {
                    
                }
            }
        }
    }
    var right2left = function(src,dst) {
        
    }
    var top2bottom = function(src,dst) {
        
    }
    var bottom2top = function(src,dst) {
        
    }
    switch(type) {
        case "left2right":
            left2right(src,dst);
            break;
        case "right2left":
            right2left(src,dst);
            break;
        case "top2bottom":
            top2bottom(src,dst);
            break;
        case "bottom2top":
            bottom2top(src,dst);
            break;
    }
}
