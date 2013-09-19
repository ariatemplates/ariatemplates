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
    $classpath : "test.aria.utils.css.Effects",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.css.Effects", "aria.utils.Dom"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this.defaultTestTimeout = 100000;
    },
    $prototype : {
        _animProperties : [
            { name : "backgroundPositionX",
              value : "60px" },
            { name : "backgroundPositionY",
              value : "60px" },
            { name : "borderWidth",
              value : "20px" },
            { name : "borderBottomWidth",
              value : "20px" },
            { name : "borderLeftWidth",
              value : "20px" },
            { name : "borderRightWidth",
              value : "20px" },
            { name : "borderTopWidth",
              value : "20px" },
            { name : "borderSpacing",
              value : "10px" },
            { name : "margin",
              value : "60px" },
            { name : "marginBottom",
              value : "60px" },
            { name : "marginLeft",
              value : "60px" },
            { name : "marginRight",
              value : "60px" },
            { name : "marginTop",
              value : "60px" },
            { name : "opacity",
              value : "0.3" },
            { name : "outlineWidth",
              value : "20px" },
            { name : "padding",
              value : "60px" },
            { name : "paddingBottom",
              value : "60px" },
            { name : "paddingLeft",
              value : "60px" },
            { name : "paddingRight",
              value : "60px" },
            { name : "paddingTop",
              value : "60px" },
            { name : "height",
              value : "160px" },
            { name : "width",
              value : "60px" },
            { name : "maxHeight",
              value : "20px" },
            { name : "maxWidth",
              value : "30px" },
            { name : "minHeight",
              value : "160px" },
            { name : "minWidth",
              value : "240px" },
            { name : "fontSize",
              value : "20px" },
            { name : "bottom",
              value : "60px" },
            { name : "left",
              value : "60px" },
            { name : "right",
              value : "60px" },
            { name : "top",
              value : "60px" },
            { name : "letterSpacing",
              value : "20px" },
            { name : "wordSpacing",
              value : "60px" },
            { name : "lineHeight",
              value : "60px" },
            { name : "textIndent",
              value : "60px" }
        ],

        setUp : function () {
            var document = Aria.$window.document;
            this.container = document.createElement("div");
            this.div1 = document.createElement("div");
            this.div2 = document.createElement("div");

            this.container.innerHTML = "<div id=\"testContainer\" style=\"height:300px; width:300px; overflow:scroll;\"></div>";
            this.div1.innerHTML = "<div id=\"testDiv1\" style=\"height:50px; width:50px; background:red\"></div>";
            this.div2.innerHTML = "<div id=\"testDiv2\" style=\"height:50px; width:50px; background:red\"></div>";

            this.container.appendChild(this.div1);
            this.container.appendChild(this.div2);
            document.body.appendChild(this.container);

        },

        tearDown : function () {
            this.container.parentNode.removeChild(this.container);
            this.container = null;
        },

        _testSinglePropertyEffect : function () {
            var prop = this._animProperties[this.propIndex];
            var props = {};
            props[prop.name] = prop.value;

            aria.utils.css.Effects.animate(this.div1, props,
            {
                duration: 50,
                onEndAnimation: {
                    fn: function(){
                        if(prop.name == "opacity"){
                            this._checkOpacity(this.div1, prop.value);
                        }
                        else{
                            this.assertEquals(prop.value, this.div1.style[prop.name], 'The property has not been set to its final value');
                        }
                        if(++this.propIndex < this._animProperties.length){
                            this._testSinglePropertyEffect()
                        }
                        else{
                            this.notifyTestEnd('testAsyncAllPropertiesEffects');
                        }
                    },
                    scope: this
                }
            });

        },

        _checkOpacity : function (div, value) {
            if(aria.core.Browser.isIE){
                this.assertEquals("alpha(opacity = "+(value*100)+")", div.style["filter"], 'The property has not been set to its final value');
            }
            else{
                this.assertEquals(value+"", div.style["opacity"], 'The property has not been set to its final value');
            }
        },

        _testMultipleAnim : function (divNum) {
            if(divNum == 1){
                this.assertEquals("80px", this.div1.style["width"], 'The property has not been set to its final value');
                this.assertEquals("460px", this.div1.style["marginLeft"], 'The property has not been set to its final value');
                this._checkOpacity(this.div1, 0.2);
            }
            else{
                this.assertEquals("20em", this.div2.style["top"], 'The property has not been set to its final value');
                this.assertEquals("460px", this.div2.style["left"], 'The property has not been set to its final value');
            }
            if(this.semaphore){
                this.notifyTestEnd('testAsyncMultipleAnimations');
            }
            else{
                this.semaphore = true;
            }
        },

        testAsyncAllPropertiesEffects : function () {
            this.propIndex = 0;
            this._testSinglePropertyEffect();
        },

        testAsyncMultipleAnimations : function () {
            this.semaphore = false;

            aria.utils.css.Effects.animate(this.div1, {
                width: 80,
                marginLeft: 460,
                opacity: 0.2
            },
            {
                duration: 50,
                onEndAnimation: {
                    fn: function(){
                        this._testMultipleAnim(1);
                    },
                    scope: this
                }
            });

            aria.utils.css.Effects.animate(this.div2, {
                top: "20em",
                left: 460
            },
            {
                duration: 50,
                onEndAnimation: {
                    fn: function(){
                        this._testMultipleAnim(2);
                    },
                    scope: this
                }
            });
        },


        testAsyncDefaultQueue : function () {
            this.previousAnimation = 0;

            aria.utils.css.Effects.animate("testDiv1", {
                top: 123
            },
            {
                queue: true,
                duration: 50,
                onEndAnimation: {
                    fn: function(){
                        this.previousAnimation = 1;
                    },
                    scope: this
                }
            });

            aria.utils.css.Effects.animate("testDiv1", {
                top: 321
            },
            {
                queue: true,
                duration: 50,
                onStartAnimation: {
                    fn: function(){
                        this.assertEquals(1, this.previousAnimation, 'The 2nd animation did not start after the 1st ');
                    },
                    scope: this
                },
                onEndAnimation: {
                    fn: function(){
                        this.previousAnimation = 2;
                    },
                    scope: this
                }
            });

            aria.utils.css.Effects.animate("testDiv1", {
                top: 456
            },
            {
                queue: true,
                duration: 50,
                onStartAnimation: {
                    fn: function(){
                        this.assertEquals(2, this.previousAnimation, 'The 3rd animation did not start after the 2nd ');
                    },
                    scope: this
                },
                onEndAnimation: {
                    fn: function(){
                        this.previousAnimation = 3;
                    },
                    scope: this
                }
            });

            aria.utils.css.Effects.animate("testDiv1", {
                top: 789
            },
            {
                queue: true,
                duration: 50,
                onStartAnimation: {
                    fn: function(){
                        this.assertEquals(3, this.previousAnimation, 'The 4th animation did not start after the 3rd ');
                        this.notifyTestEnd('testDefaultQueue');
                    },
                    scope: this
                }
            });
        },


        testAsyncUserQueue : function () {
            // 2 different queues
            this.previousAnimationA = 0;
            this.previousAnimationB = 0;

            aria.utils.css.Effects.animate("testDiv1", {
                top: 123
            },
            {
                queue: "A",
                duration: 200,
                onStartAnimation: {
                    fn: function(){
                        this.previousAnimationA = 1;
                    },
                    scope: this
                }
            });

            aria.utils.css.Effects.animate("testDiv1", {
                top: 321
            },
            {
                queue: "A",
                duration: 200,
                onStartAnimation: {
                    fn: function(){
                        this.assertTrue((this.previousAnimationB >= 1), 'The 1st animation of queue B did not start before the 2nd animation of queue A');
                        this.assertEquals(1, this.previousAnimationA, 'The 1nd animation of queue A did not start before the 2nd animation of queue B');
                        this.previousAnimationA = 2;
                    },
                    scope: this
                }
            });


            aria.utils.css.Effects.animate("testDiv1", {
                top: 456
            },
            {
                queue: "A",
                duration: 200,
                onStartAnimation: {
                    fn: function(){
                        this.assertTrue((this.previousAnimationB >= 2), 'The 2nd animation of queue B did not start before the 3nd animation of queue A');
                        this.assertEquals(2, this.previousAnimationA, 'The 1nd animation of queue A did not start before the 2nd animation of queue B');
                        this.previousAnimationA = 3;
                    },
                    scope: this
                },
                onEndAnimation: {
                    fn: function(){
                        this.notifyTestEnd('testAsyncUserQueue');
                    },
                    scope: this
                }
            });

            aria.utils.css.Effects.animate("testDiv2", {
                top: 300
            },
            {
                queue: "B",
                duration: 200,
                onStartAnimation: {
                    fn: function(){
                        this.previousAnimationB = 1;
                    },
                    scope: this
                }
            });

            aria.utils.css.Effects.animate("testDiv2", {
                top: 725
            },
            {
                queue: "B",
                duration: 200,
                onStartAnimation: {
                    fn: function(){
                        this.assertTrue((this.previousAnimationA >= 1), 'The 1nd animation of queue A did not start before the 2nd animation of queue B');
                        this.assertEquals(1, this.previousAnimationB, 'The 1nd animation of queue A did not start before the 2nd animation of queue B');
                        this.previousAnimationB = 2;
                    },
                    scope: this
                }
            });
        }

    }
});
