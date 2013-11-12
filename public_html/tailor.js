/* 
 * Copyright (c) 2010, Gabriel N Forti
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

/*
    Tailor :
            A small JavaScript framework that takes an element from the DOM
            and applies CSS with or without animation. The Framework works 
            as a singleton so only one animation can run at a time.
            
            Runs most CSS properties with numeric values and has support for color animation.
            
            Orginal Framework was created in 2010 and last modified in 2013
*/
var Tailor = function () {

    //Private variables
    var variables = {
            singletonInstance : null,
            elem : null,
            timer : null,
            nonPXUnits : /(z-?index|font-?weight|opacity|zoom|line-?height)/i,
            unitRegex : /^[+-]?[0-9]+(px|em|ex|%|in|cm|mm|pt|pc)$/i,
            cssGoal : null,
            isAnimating : false,
            intervalRate : 30,
            canAnimate : false,
            callback : null
    };

    //Private Methods
    var methods = {
        init : function(id,css,cb) {
                variables.elem = this.$(id);
                variables.cssGoal = css;
                variables.callback = cb;
                this.clearTimer();
                if ( this.oType(variables.cssGoal) == "object" && this.oType(variables.elem) == "object") variables.canAnimate = true;	
                return this;
        },
        // simple way to get the element
        $ : function(id) {                                                      
            var elem = id;
            if (this.oType(id) == "string") {
                elem = document.getElementById(id);
                // IE needs this extra check to return the ID and not the name of an element it finds.
                elem = (elem && elem.id && elem.id == id ? elem : null);
            }
            return elem;
        },
        /*  Better way to get actual object type. Official list of object types for JavaScript used.
            Each browser has a different name for each type of object so object is returned for 
            the cases where a match is not found from the list */
        oType : function(o){
            var listTypes = [], types = "Boolean Number String Function Array Date RegExp Object".split(" "), i = types.length;
            while(i--) listTypes["[object " + types[i] + "]"] = types[i].toLowerCase();
            return listTypes[Object.prototype.toString.call(o)] || "object";
        },
        getCSSUnit : function(val) {
            return ( variables.unitRegex.test(val) ? val.match(variables.unitRegex)[1] : "" );
        },
        /* Javascript names for CSS properties are camel case */
        camelCase : function(str) {
            return str.toString().replace(/\-(.)/g, function(m, l){return l.toUpperCase()}); //camelCase
        },
        /* opacity is not supported in IE */
        setStyle : function(prop, val) { 
            if (!variables.canAnimate)  return this;
            prop = this.camelCase(prop);
            if ( prop.toString().match(/opacity/gi)) {
                    val = parseInt(val, 10);
                    val = (val >= 100)?100:(val<=0)? 0: val;
                    if ('filter' in variables.elem.style )
                            variables.elem.style["filter"] = "alpha(opacity:"+val+")";
                    if ('opacity' in variables.elem.style )
                            variables.elem.style["opacity"] = (val/100);										 
            } else if (prop in variables.elem.style) {
                    variables.elem.style[prop] = val; 
            }			
            return this;
        },
        css : function() {
            if (!variables.canAnimate)  return this;			
            for (var prop in variables.cssGoal) {
                if(!variables.cssGoal.hasOwnProperty(prop)) continue;
                    this.setStyle(prop, variables.cssGoal[prop]); 
            }
            return this;          
        },
        startTimer : function() {
            if (!variables.canAnimate)  return this;
            variables.isAnimating = true;
            variables.timer = setInterval(function(){methods.animate();}, variables.intervalRate);
            return this;
        },
        clearTimer : function() {
            variables.timer = window.clearInterval(variables.timer);
        },
        animate :  function() {
            if (!variables.canAnimate) { this.clearTimer(); return this; }
            if (!variables.isAnimating)	this.clearTimer();

            var isDone = 0, objLength = 0;										

            for (var prop in variables.cssGoal) {
                if(!variables.cssGoal.hasOwnProperty(prop)) continue;	

                var obj = variables.elem, objVal = 0, propVal = variables.cssGoal[prop], goal = parseInt(propVal, 10), valueToSet = goal, rate = 0, unit = this.getCSSUnit(propVal);
                objLength++;
                prop = this.camelCase(prop);			

                /* Color is not numeric so we need to animate it.  Needs to be converted to RGB to determine animation colors */		
                if ( prop.toString().match(/color/gi) ) {
                    goal = (propVal.toString().match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/) ? propVal.toString().match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/).splice(1,4) : this.HexToRGB(propVal.toString().match(/\#{0,1}[0-9a-fA-F]{3,6}/)) );
                    objVal = (prop in obj.style && obj.style[prop]) ? (obj.style[prop].toString().match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/) ? obj.style[prop].toString().match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/).splice(1,4) : this.HexToRGB(obj.style[prop].toString().match(/\#{0,1}[0-9a-fA-F]{3,6}/)) ) : [0,0,0];

                    if(this.RGBToHex(goal) != this.RGBToHex(objVal)) {
                            valueToSet = this.colorRate(goal,objVal);
                            this.setStyle(prop, valueToSet);															
                    } else {
                            isDone++;
                    }

                    continue;
                }

                // if it's not numeric and does not have a unit type, it should not be animated
                if ( this.oType(propVal) != "number" && ! unit.length && !prop.toString().match(/opacity/gi) ){
                    this.setStyle(prop, propVal); 
                    isDone++;
                    continue;
                }

                // do all numeric animations; opacity is not supported in IE so check filter		
                if ( prop.toString().match(/opacity/gi) )
                    objVal = ('opacity' in obj.style ) ? (obj.style.opacity) ? 	parseInt(obj.style.opacity*100, 10) : 100 : ('filter' in obj.style) ? (obj.style.filter) ? parseInt(obj.style.filter.toString().replace(/[^0-9]/gi,''), 10) : 100 : null;	
                else 
                    objVal = (prop in obj.style && obj.style[prop]) ? new Number(obj.style[prop].toString().replace(/[^0-9\-]/gi,'')) : 0;

                /* rate controls the tween or feel of how smooth the animation runs. Dividing the higher value
                   of the element or the goal will make the process faster	*/
                rate = Math.max(objVal.toString().replace(/[^0-9]/gi,''),goal.toString().replace(/[^0-9]/gi,''));
                rate = parseInt(rate / 10, 10)+1;

                /* value has to meet the goal by either subtracting or adding	*/
                if ( objVal < goal )
                        valueToSet = ( (objVal+rate) < goal ? (objVal+rate) : goal );
                else if ( objVal > goal )
                        valueToSet = ( (objVal-rate) > goal ? (objVal-rate) : goal );						

                this.setStyle(prop, valueToSet+unit);
                if (valueToSet == goal) isDone++;

            }

            /* 	if all CSS properties meet the goal we are done, callback function can now be called */
            if(isDone == objLength) {
                variables.isAnimating = false;
                if( this.oType(variables.callback) == "function" ) variables.callback(variables.elem);
            }

        },
        HexToRGB : function (color) {
            if (!color) return [0,0,0];
            color = color.toString().replace(/[^0-9a-fA-F]/gi,'');
            if(color.length == 3)
                color = color.substring(0,1)+color.substring(0,1)+color.substring(1,2)+color.substring(1,2)+color.substring(2,3)+color.substring(2,3);				
            return [parseInt(color.substring(0,2),16), parseInt(color.substring(2,4),16), parseInt(color.substring(4,6),16)];
        },
        RGBToHex : function(rgb) {
            var chars = "0123456789ABCDEF",hex = "";
            for (c in rgb) {
                if(!rgb.hasOwnProperty(c)) continue;
                if (parseInt(rgb[c], 10) == 0) hex += '00';
                else hex += String(chars.charAt(Math.floor(rgb[c] / 16))) + String(chars.charAt(rgb[c] - (Math.floor(rgb[c] / 16) * 16)));
            }
            return hex;
        },
        /* Sets the next goal for an RBG color to get closer to the goal color	*/
        colorRate : function(goalRGB, currentRGB) {	
            for (var i=0, len=currentRGB.length, rgb = [], Rate = 0, valueToSet; i < len; i++) {

                Rate = Math.max(currentRGB[i].toString().replace(/[^0-9]/gi,''), goalRGB[i].toString().replace(/[^0-9]/gi,'') );
                Rate = parseInt(Rate / 10, 10)+1;

                valueToSet = goalRGB[i];
                if ( currentRGB[i] < goalRGB[i] )
                    valueToSet = ( (currentRGB[i]+Rate) < goalRGB[i] ? (currentRGB[i]+Rate) : goalRGB[i] );
                else if ( currentRGB[i] > goalRGB[i] )
                    valueToSet = ( (currentRGB[i]-Rate) > goalRGB[i] ? (currentRGB[i]-Rate) : goalRGB[i] );						

                rgb[i] = valueToSet;
            }						
            return '#'+this.RGBToHex(rgb);
        },
        // Get the instance of the class.
        getInstance : function() {
            if (null === variables.singletonInstance)				
                variables.singletonInstance = _createInstance();			
            return variables.singletonInstance;
        }	
    };
    /* 	Public Methods that can be used	*/
    var _createInstance = function() {
        return {
            css : function(id,css){
                methods.init(id,css).css();
            },
            animate : function(id,css,cb){
                methods.init(id,css,cb).startTimer();
            }
        };
    }	

    return methods.getInstance();	
}();