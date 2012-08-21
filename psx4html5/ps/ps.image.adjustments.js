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
    var len = src.data.length;
    for(var i =0; i < len; i+= 4) {
        var r = src.data[i];
        var g = src.data[i + 1];
        var b = src.data[i + 2];
        var minV= Math.min(b,g,r);
        var maxV= Math.max(b,g,r);

        minV=(minV+maxV)/2;
        dst.data[i] = minV;
        dst.data[i + 1] = minV;
        dst.data[i + 2] = minV;
    }
};

//invert color
PS.Image.Adjustment.invertColor = function(src,dst)
{
	var len = src.data.length;
    for(var i =0; i < len; i+= 4) {
        for (var ch=0; ch <3; ch++) {
            dst.data[i + ch] = 255 - src.data[i + ch];
        };
    }
};

PS.Image.Adjustment.posterize = function(src,dst,level)
{	
	// level = level || 4;
	level = typeof level != 'undefined' ? level : 4;
	var len = src.width*src.height*4;
    for(var i =0; i < len; i+= 4) {
        for (var ch=0; ch <3; ch++) {
            dst.data[i + ch] = Math.floor(src.data[i + ch]/255.0*(level-1)+0.5)/(level -1)*255;
        };
    }
};

PS.Image.Adjustment.threshold = function(src,dst,thresholdValue)
{	
	// thresholdValue = thresholdValue || 128;
	thresholdValue = typeof thresholdValue != 'undefined' ? thresholdValue : 128;
	var len = src.width*src.height*4;
    for(var i =0; i < len; i+= 4) {
        for (var ch=0; ch <3; ch++) {
            dst.data[i + ch] = src.data[i + ch] > thresholdValue ? 255 : 0;
        };
    }
};

// parameter: map must be array of size 1x256 or 3x256
// used by gradientMap,curve, level.
// no corresponding operation in PS
PS.Image.Adjustment.mapping = function(src,dst,map)
{
	var len = src.width*src.height*4;
	if(map.length == 3){//3*356
		for(var i =0; i < len; i+= 4) {
			for (var ch=0; ch <3; ch++) {
				dst.data[i + ch] = map[ch][src.data[i + ch]];
			};
		}
	}else {//1x256
		for(var i =0; i < len; i+= 4) {
			for (var ch=0; ch <3; ch++) {
				dst.data[i + ch] = map[src.data[i + ch]];
			};
		}
	}
}

// posleft must be smaller than posRight, see photoshop for details 
PS.Image.Adjustment.level(src, dst, posLeft, posRight)
{
    var scale = 255.0 / (posRight - posLeft);
	var map = new Array();
	for(var i =0; i < 256; i++) {
		if(i < posLeft){
			map[i] =0;
		}else if(i > posRight){
			map[i] = 255;
		}else {
			map[i] = (i - posLeft) * scale;
		}
	}
    mapping(src,dst,map);
}
// parameter: map must be array of size 1x256 or 3x256
PS.Image.Adjustment.gradientmap = function(src,_dst,map)
{
	var dst = _dst;
	if(src == dst) {
		dst = PS.Util.cloneImageData(src);
	}
	// grayscale
	PS.Image.Mode.rgb2gray(src,dst);
	// map
	mapping(src,dst,map);
	
	if(dst != _dst){
    	_dst = PS.Util.cloneImageData(dst);
    }
}
// parameter: points should be a array of points, formated like this:[[0,0],[128,200],[255,255]]
PS.Image.Adjustment.curve = function(src,_dst,points)
{
	var secondDerivative = function(controlPts)
    {
		var derivative = new Array();
        // assume 0 boundary condition
        var matrix = new Array();
		for(var i =0; i < points.length; i++){
			matrix[i] = new Array();
		}
        matrix[0][1]=1.0;
        for(var i=1;i<count-1;i++) {
            matrix[i][0]=(controlPts[i][0]-controlPts[i-1][0])/6.0;
            matrix[i][1]=(controlPts[i+1][0]-controlPts[i-1][0])/3.0;
            matrix[i][2]=(controlPts[i+1][0]-controlPts[i][0])/6.0;
            result[i]=(1.0*controlPts[i+1][1]-controlPts[i][1])/(controlPts[i+1][0]-controlPts[i][0]) - (controlPts[i][1]-controlPts[i-1][1])/(controlPts[i][0]-controlPts[i-1][0]);
        }
        matrix[count-1][1]=1;

        // solving pass1 (up->down)
        for(var i=1;i<count;i++) {
            var k = matrix[i][0]/matrix[i-1][1];
            matrix[i][1] -= k*matrix[i-1][2];
            matrix[i][0] = 0;
            result[i] -= k*result[i-1];
        }
        // solving pass2 (down->up)
        for(var i=count-2;i>=0;i--) {
            var k = matrix[i][2]/matrix[i+1][1];
            matrix[i][1] -= k*matrix[i+1][0];
            matrix[i][2] = 0;
            result[i] -= k*result[i+1];
        }

        for(var i=0;i<count;i++){
            derivative[i]=result[i]/matrix[i][1];
        }
		return derivative;
    }

    // input : controlPts, control points sorted by x, value should be in [0,255]
    //         count, number of control points
    // output: unsigned char map[256]
    var generateCurve = function(controlPts)
    {
		var map = new Array();
        // make sure control points are sorted by x
        for(var i =0;i < count - 1; i++){
            if(controlPts[i][0] > controlPts[i +1][0]){
                return nil;
            }
        }
        var start = 0;
        var end = count -1;
        while(controlPts[++start][0] == controlPts[0][0]){
            ;
        }
        start--;
        while(controlPts[--end][0] == controlPts[count-1][0]){
            ;
        }
        end++;
        var p = secondDerivative(controlPts.slice(start,end));
        //secondDerivative(controlPts,count, p);

        for(var i = 0; i< controlPts[0][0]; i++){
            map[i]= controlPts[0][1];
        }
        for(var i = controlPts[count-1][0] ; i< 256; i++){
            map[i]= controlPts[count - 1][1];
        }
		var FUNC = function(x){
			return ((x) * (x) * (x) - (x));
		}
		
        for(var i =0; i < count -1; i++){
            var u = controlPts[i+1][0] - controlPts[i][0];
            for(var pos = controlPts[i][0]; pos <controlPts[i +1][0]; pos++){
                var t = (pos - controlPts[i][0])/u;
                map[pos] = t * controlPts[i +1][1] + (1-t)*controlPts[i][1] + u * u *
                    (FUNC(t) * p[i+1] + FUNC(1-t) * p[i])/6;
            }
        }
		return map;
    }

	
	var dst = _dst;
	if(src == dst) {
		dst = PS.Util.cloneImageData(src);
	}
	// generate curve
	var map = generateCurve(points);
	// map
	mapping(src,dst,map);
	
	if(dst != _dst){
    	_dst = PS.Util.cloneImageData(dst);
    }
}