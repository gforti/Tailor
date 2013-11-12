/* 
 * Copyright (c) 2013, Gabriel N Forti
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


var Util = { 
    Event: {
        $: function (id) {
            var elem = id;
            if (this.oType(id) == "string") {
                elem = document.getElementById(id);
                elem = (elem && elem.id && elem.id == id ? elem : null);
            }
            return elem;
        },
        oType : function(o){
            var listTypes = [], types = "Boolean Number String Function Array Date RegExp Object".split(" "), i = types.length;
            while(i--) listTypes["[object " + types[i] + "]"] = types[i].toLowerCase();
            return listTypes[Object.prototype.toString.call(o)] || "object";
        },
        add: function (obj, evt, fn) {
            obj = this.$(obj);
            if (!obj) return this;
            if (obj.addEventListener) {
                obj.addEventListener(evt, fn, false);
            } else if (obj.attachEvent) {
                obj.attachEvent('on' + evt, fn);
            }
            return this;
        }
    }
};

var samples = function() {
        
    var tailorDivID = "tailor",
        evtName = 'click';
        
    var methods = {
        
        test1 : function() {
            Tailor.animate(tailorDivID,{
                'width':"100px",
                'height': "50px", 
                'border-color':"#F2597F", 
                'border-width': "10px", 
                'color':"#FFF", 
                'background-color':"#251EAA",
                'position' : 'absolute',
                'top' : "50px",
                'left' : "600px"
            });
        },
        test2 : function() {
             Tailor.animate(tailorDivID,{
                'margin': "1em",
                'padding' : "9px",
                'height' : "26px",
                'width' : "500px",
                'border' : "1px solid #548954",
                'background-color' : "#355c33",
                'color' : "#79af72",
                'text-shadow' : "1px 1px #21341d",
                'position' : "static",
                'top' : "0px",
                'left' : "0px",
                'opacity' : "100"
            });
        },
        test3 : function() {
             Tailor.animate(tailorDivID,{'opacity' : "0"});
        },
        test4 : function() {
            Tailor.animate(tailorDivID,{'opacity' : "100"});
        },
        test5 : function() {
             Tailor.animate(tailorDivID,{ 'position' : "absolute", 'left' : "-200px", 'top' : '-200px'});
        },
        test6 : function() {
           Tailor.animate(tailorDivID,{ 'position' : "absolute", 'left' : "30%", 'top' : '5%'});
        },
        test7 : function() {
             Tailor.animate(tailorDivID,{ 'background-color' : "#F0F934"});
        },
        test8 : function() {
           Tailor.animate(tailorDivID,{ 'background-color' : "#F93465"});
        },
        test9 : function() {
             Tailor.animate(tailorDivID,{ 'color' : "#F0F934", 'font-size': "30pt", 'top' : '1%', 'left' : "20%", 'width' : "500px"});
        },
        test10 : function() {
           Tailor.animate(tailorDivID,{ 'color' : "#F93465", 'font-size': "12pt"});
        },        
        test11 : function() {
            Tailor.animate(tailorDivID,{ 'color' : "#000", 'background-color' : "#fff"});
        },
        test12 : function() {
             Tailor.animate(tailorDivID,{ 'color' : "#fff", 'background-color' : "#000"});
        },
         test13 : function() {
            Tailor.animate(tailorDivID,{ 'border-radius' : "25px", 'border-width' : "15px"});
        },
        test14 : function() {
             Tailor.animate(tailorDivID,{ 'border-radius' : "0px", 'border-width' : "5px"});
        }
    };
    
    var loadDemo = function() {      
        methods.test2();
        for ( var i = 1; i <= 14; i++ ) {
            Util.Event.add('test'+i,evtName,methods['test'+i]);
        }        
    };
    
    Util.Event.add(window,'load',loadDemo );
    
};

samples();