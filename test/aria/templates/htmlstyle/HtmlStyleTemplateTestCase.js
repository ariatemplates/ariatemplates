/*
 * Copyright 2012 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

Aria.classDefinition({
    $classpath : "test.aria.templates.htmlstyle.HtmlStyleTemplateTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies:["aria.utils.Dom"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
       this.setTestEnv({
            template : "test.aria.templates.htmlstyle.HtmlStyleTemplate"
        });

    },
    $prototype : {
        runTemplateTest : function () {
            this.__checkStyle();
            /*aria.core.Timer.addCallback({
                fn : this.__checkStyle,
                scope : this,
                delay : 1000
            });*/


        },

        __checkStyle : function(){
            this.__testCase1();
            this.__testCase2();
            this.__testCase3();
            this.__testCase4();
            this.__finishTest();


        },
        __testCase1:function(){
            var domId, domStyle;

             domId = this.getWidgetInstance("id1")._domId;
             domStyle =  aria.utils.Dom.getElementById(domId);

             this.assertTrue(domStyle.style.height == "100px", "The TPL1 height is not correct " + domStyle.style.height);
             this.assertTrue(domStyle.style.width == "200px", "The TPL1 width is not correct " + domStyle.style.width);
        },
        __testCase2:function(){
             var domId, domStyle;
             domId = this.getWidgetInstance("id2")._domId;
             domStyle =  aria.utils.Dom.getElementById(domId);

             this.assertTrue(domStyle.style.height == "150px", "The TPL2 height is not correct " + domStyle.style.height);
             this.assertTrue(domStyle.style.width == "400px", "The TPL2 width is not correct " + domStyle.style.width);
        },
        __testCase3:function(){
             var domId, domStyle;
             domId = this.getWidgetInstance("id3")._domId;
             domStyle =  aria.utils.Dom.getElementById(domId);

             this.assertTrue(domStyle.style.height === "", "The TPL3 height is not correct " + domStyle.style.height);
             this.assertTrue(domStyle.style.width === "", "The TPL3 width is not correct " + domStyle.style.width);

        },
        __testCase4:function(){
             var domId, domStyle;
             domId = this.getWidgetInstance("id4")._domId;
             domStyle =  aria.utils.Dom.getElementById(domId);

             this.assertTrue(domStyle.style.height === "", "The TPL4 height is not correct " + domStyle.style.height);
             this.assertTrue(domStyle.style.width === "", "The TPL4 width is not correct " + domStyle.style.width);
        },
        __finishTest : function(){
             this.notifyTemplateTestEnd();
        }
    }
});
