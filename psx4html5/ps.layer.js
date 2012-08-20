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
 * implements operations for blending mode in Photoshop cs6 Layer panel
 */
// image data type use for all these functions are  

// for layer blending, alpha is not considered here, alpha is assumed to be 255 which is general situation

PS.Layer = {};

_blendNormal= function(F, B)
{
    return F;
};
_blendLighten= function(F, B)
{
     return (B > F) ? B:F;
};
_blendDarken= function(F, B)
{
    return (B > F) ? F:B;
};
_blendMultiply= function(F, B)
{
    return (F * B) / 255;
};
_blendAverage= function(F, B)
{
    return (F + B) / 2;
};
_blendAdd= function(F, B)
{
    return Math.min(255, (F + B));
};
_blendSubtract= function(F, B)
{
    return (F + B < 255) ? 0:(F + B - 255);
};
_blendDifference= function(F, B)
{
    return Math.abs(F - B);
};
_blendNegation= function(F, B)
{
    return 255 - Math.abs(255 - F - B);
};
_blendScreen= function(F, B)
{
    return 255 - (((255 - F) * (255 - B)) >> 8);
};
_blendExclusion= function(F, B)
{
    return F + B - 2 * F * B / 255;
};
_blendOverlay= function(F, B)
{
    return (B < 128) ? (2 * F * B / 255):(255 - 2 * (255 - F) * (255 - B) / 255);
};
_blendSoftLight= function(F, B)
{
    return (B < 128)?(2*((F>>1)+64))*(B/255.0):(255-(2*(255-((F>>1)+64))*(float)(255-B)/255));
};
_blendHardLight= function(F, B)
{
     return _blendOverlay(B,F);
};
_blendColorDodge= function(F, B)
{
    return (B == 255) ? B:Math.min(255, ((F << 8 ) / (255 - B)));
};
_blendColorBurn= function(F, B)
{
    return (B == 0) ? B:Math.max(0, (255 - ((255 - F) << 8 ) / B));
};
_blendLinearDodge= function(F, B)
{
    return _blendAdd(F, B);
};
_blendLinearBurn= function(F, B)
{
    return _blendSubtract(F, B);
};
_blendLinearLight= function(F, B)
{
    return B < 128?_blendLinearBurn(F,(2 * B)):_blendLinearDodge(F,(2 * (B - 128)));
};
_blendVividLight= function(F, B)
{
    return B < 128?_blendColorBurn(F,(2 * B)):_blendColorDodge(F,(2 * (B - 128)));
};
_blendPinLight= function(F, B)
{
    return B < 128?_blendDarken(F,(2 * B)):_blendLighten(F,(2 * (B - 128)));
};
_blendHardMix= function(F, B)
{
    return (_blendVividLight(F, B) < 128) ? 0:255;
};
_blendReflect= function(F, B)
{
    return (B == 255) ? B:Math.min(255, (F * F / (255 - B)));
};
_blendGlow= function(F, B)
{
    return _blendReflect(B,F);
};
_blendPhoenix= function(F, B)
{
    return Math.min(F, B) - Math.max(F, B) + 255;
};
_blendAlpha = function(F,B, O)
{
    return O * F + (1 - O) * B;
};

_blending = function(background, forground, dst, func) {
    var len = src.width*src.height*4;
    for(var i =0; i < len; i+= 4) {
        for(var ch =0; ch < 3; ch++) {
            dst.data[i + ch] = func(forground.data[i + ch],background.data[i+ch]);
        }
        //dst.data[i + 3] = 255;
    }
};

PS.Layer.blendNormal = function(background, foreground, dst)
{
    _blending(background, foreground, dst, _blendNormal);
};

PS.Layer.blendLighten = function(background, foreground, dst)
{
    _blending(background, foreground, dst, _blendLighten);
};

PS.Layer.blendDarken = function(background, foreground, dst)
{
    _blending(background, foreground, dst, _blendDarken);
};

PS.Layer.blendMultiply = function(background, foreground, dst){

    _blending(background, foreground, dst, _blendMultiply);
};

PS.Layer.blendAverage = function(background, foreground, dst)
{
    _blending(background, foreground, dst, _blendAverage);
};

PS.Layer.blendAdd = function(background, foreground, dst)
{
    _blending(background, foreground, dst, _blendAdd);
};

PS.Layer.blendSubtract = function(background, foreground, dst)
{
    _blending(background, foreground, dst, _blendSubtract);
};

PS.Layer.blendDifference = function(background, foreground, dst)
{
    _blending(background, foreground, dst, _blendDifference);
};

PS.Layer.blendNegation = function(background, foreground, dst)
{
    _blending(background, foreground, dst, _blendNegation);
};

PS.Layer.blendScreen = function(background, foreground, dst)
{
    _blending(background, foreground, dst, _blendScreen);
};

PS.Layer.blendExclusion = function(background, foreground, dst)
{
    _blending(background, foreground, dst, _blendExclusion);
};

PS.Layer.blendOverlay = function(background, foreground, dst)
{
    _blending(background, foreground, dst, _blendOverlay);
};

PS.Layer.blendSoftLight = function(background, foreground, dst)
{
    _blending(background, foreground, dst, _blendSoftLight);
};

PS.Layer.blendHardLight = function(background, foreground, dst)
{
    _blending(background, foreground, dst, _blendHardLight);
};

PS.Layer.blendColorDodge = function(background, foreground, dst)
{
    _blending(background, foreground, dst, _blendColorDodge);
};

PS.Layer.blendColorBurn = function(background, foreground, dst)
{
    _blending(background, foreground, dst, _blendColorBurn);
};

PS.Layer.blendLinearDodge = function(background, foreground, dst)
{
    _blending(background, foreground, dst, _blendLinearDodge);
};

PS.Layer.blendLinearBurn = function(background, foreground, dst)
{
    _blending(background, foreground, dst, _blendLinearBurn);
};

PS.Layer.blendLinearLight = function(background, foreground, dst)
{
    _blending(background, foreground, dst, _blendLinearLight);
};

PS.Layer.blendVividLight = function(background, foreground, dst)
{
    _blending(background, foreground, dst, _blendVividLight);
};

PS.Layer.blendPinLight = function(background, foreground, dst)
{
    _blending(background, foreground, dst, _blendPinLight);
};

PS.Layer.blendHardMix = function(background, foreground, dst)
{
    _blending(background, foreground, dst, _blendHardMix);
};

PS.Layer.blendReflect = function(background, foreground, dst)
{
    _blending(background, foreground, dst, _blendReflect);
};
PS.Layer.blendGlow = function(background, foreground, dst)
{
    _blending(background, foreground, dst, _blendGlow);
};

PS.Layer.blendPhoenix = function(background, foreground, dst)
{
    _blending(background, foreground, dst, _blendPhoenix);
};

// alpha blending , alpha ranges in [0.0, 1.0]
PS.Layer.blendAlpha = function(background, foreground, alpha, dst)
{
    var len = src.width*src.height*4;
    for(var i =0; i < len; i+= 4) {
        for(var ch =0; ch < 3; ch++) {
            dst.data[i + ch] = _blendAlpha(forground.data[i + ch],background.data[i+ch], alpha);
        }
        dst.data[i + 3] = 255;
    }
};

PS.Layer.blendLuminosity = function(background, foreground, dst)
{
    // TODO:
};


PS.Layer.blendColor = function(background, foreground, dst)
{
    // TODO:
};


PS.Layer.blendHue = function(background, foreground, dst)
{
    // TODO:
};


PS.Layer.blendSaturation = function(background, foreground, dst)
{
    // TODO:
};
