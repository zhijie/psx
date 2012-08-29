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


// image data type use for all these functions are  

PsxEffects = {};

// preload image resources
PsxEffects.initialize = function(){
    // put all filenames here
    var RESOURCE_FILES = ['vignette.jpg'];
    
    var RESOURCE_PATH = './PsxEffects/resource/';
    for(var i=0,j=RESOURCE_FILES.length; i<j; i++){
        // file name without extension as id
        var id = RESOURCE_FILES[i].substr(0,RESOURCE_FILES[i].length-4);
    	document.write('<img id="'+id+'" src="'+RESOURCE_PATH+RESOURCE_FILES[i]+'" width="512" height ="512" style="display:none" />');//style="display:none" 
    };
}
