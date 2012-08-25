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

PsxEffects.ColorShift = {};

// colorshift effect reserves given hue value in the picture and turn other pixels gray
// paramters: hueCenter,the hue you want to reserve, value ranges in [0,360]; 
//            radius, range of similar color that can be reserved
PsxEffects.ColorShift.colorshift = function(src,_dst,hueCenter,radius)
{
    var dst = _dst;
    if(dst == src){
        dst = PSX.Util.cloneImageData(src);
    }
    var hsv = PSX.Util.cloneImageData(src);
    PSX.Image.Mode.rgb2hsv(src,hsv);
    
    PSX.Image.Mode.rgb2gray(src,dst);
    hueCenter /= 2;
    radius /= 2;
    var len = src.data.length;
    for (var i=0; i < len; i+=4) {
        var dist = Math.abs(hsv.data[i] - hueCenter);
        if( dist < radius || dist > 180 - radius){
            for(var ch =0; ch < 4; ch++){
                dst.data[i + ch] = src.data[i + ch];
            }
        }
    };
    if(dst != _dst){
        PSX.Util.copyArray(dst.data,_dst.data);
    }
}

PsxEffects.ColorShift.color1 = function(src,dst)
{
    PsxEffects.ColorShift.colorshift(src,dst,36,36);
}

PsxEffects.ColorShift.color2 = function(src,dst)
{
    PsxEffects.ColorShift.colorshift(src,dst,108,36);
}

PsxEffects.ColorShift.color3 = function(src,dst)
{
    PsxEffects.ColorShift.colorshift(src,dst,180,36);
}

PsxEffects.ColorShift.color4 = function(src,dst)
{
    PsxEffects.ColorShift.colorshift(src,dst,252,36);
}

PsxEffects.ColorShift.color5 = function(src,dst)
{
    PsxEffects.ColorShift.colorshift(src,dst,324,36);
}
