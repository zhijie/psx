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
 
PSX.Filter.Convolution= {};

//This is the main convolution process. It will use weights which is a matrix
//to apply convolution
PSX.Filter.Convolution.main=function(src,dst,weights)
{
	// weights can be 5x5 or 3x3 or of any other dimension. Hence get Wside on run time
	var Wside=Math.round(Math.sqrt(weights.length));
	
	//half will be used in convolution
	var half=Math.floor(Wside/2);
	var srcWidth=src.width;
	var srcHeight=src.height;
	
	//tempprary Image Data
	var tmpData=PSX.Util.cloneImageData(src);
	
	//Implementation of convolution. Every pixel will be effected by the neighbouring
	//pixels . No of neighbouring pixels will be decided by the size of weights matrix
	for(var sy=0;sy<srcHeight;++sy)
	{
		for(var sx=0;sx<srcWidth;++sx)
		{
			var doffset=(sy*srcWidth+sx)*4;
			
			//r,g,b components
			var r=0,g=0,b=0,a=0;
			for(var wy=0;wy<Wside;++wy)
			{
				for(var wx=0;wx<Wside;++wx)
				{
				 
					var tx=sx+wx-half;
					var ty=sy+wy-half;
					
					//taking care of boundary conditions
					if(tx>=0&&tx<srcWidth&&ty>=0&&ty<srcHeight)
					{
					
						var offset=(ty*srcWidth+tx)*4;
						var wt=weights[wy*Wside+wx];
						r+=src.data[offset]*wt;
						g+=src.data[offset+1]*wt;
						b+=src.data[offset+2]*wt;
												
					}
				
				}
			}
			tmpData.data[doffset]=r;
			tmpData.data[doffset+1]=g;
			tmpData.data[doffset+2]=b;
			tmpData.data[doffset+3]=255;
			
		}
	}
	
	PSX.Util.copyArray(tmpData.data,dst.data);

}
