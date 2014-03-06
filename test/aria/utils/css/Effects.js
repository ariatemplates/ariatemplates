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
        _animProperties : [{
                    name : "backgroundPositionX",
                    value : "60px"
                }, {
                    name : "backgroundPositionY",
                    value : "60px"
                }, {
                    name : "borderWidth",
                    value : "20px"
                }, {
                    name : "borderBottomWidth",
                    value : "20px"
                }, {
                    name : "borderLeftWidth",
                    value : "20px"
                }, {
                    name : "borderRightWidth",
                    value : "20px"
                }, {
                    name : "borderTopWidth",
                    value : "20px"
                }, {
                    name : "borderSpacing",
                    value : "10px"
                }, {
                    name : "margin",
                    value : "60px"
                }, {
                    name : "marginBottom",
                    value : "60px"
                }, {
                    name : "marginLeft",
                    value : "60px"
                }, {
                    name : "marginRight",
                    value : "60px"
                }, {
                    name : "marginTop",
                    value : "60px"
                }, {
                    name : "opacity",
                    value : "0.3"
                }, {
                    name : "outlineWidth",
                    value : "20px"
                }, {
                    name : "padding",
                    value : "60px"
                }, {
                    name : "paddingBottom",
                    value : "60px"
                }, {
                    name : "paddingLeft",
                    value : "60px"
                }, {
                    name : "paddingRight",
                    value : "60px"
                }, {
                    name : "paddingTop",
                    value : "60px"
                }, {
                    name : "height",
                    value : "160px"
                }, {
                    name : "width",
                    value : "60px"
                }, {
                    name : "maxHeight",
                    value : "20px"
                }, {
                    name : "maxWidth",
                    value : "30px"
                }, {
                    name : "minHeight",
                    value : "160px"
                }, {
                    name : "minWidth",
                    value : "240px"
                }, {
                    name : "fontSize",
                    value : "20px"
                }, {
                    name : "bottom",
                    value : "60px"
                }, {
                    name : "left",
                    value : "60px"
                }, {
                    name : "right",
                    value : "60px"
                }, {
                    name : "top",
                    value : "60px"
                }, {
                    name : "letterSpacing",
                    value : "20px"
                }, {
                    name : "wordSpacing",
                    value : "60px"
                }, {
                    name : "lineHeight",
                    value : "60px"
                }, {
                    name : "textIndent",
                    value : "60px"
                }],

        setUp : function () {
            var document = Aria.$window.document;
            this.container = document.createElement("div");
            this.container.style.height = "300px";
            this.container.style.width = "300px";
            this.div1 = document.createElement("div");
            this.div2 = document.createElement("div");

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

            aria.utils.css.Effects.animate(this.div1, props, {
                duration : 50,
                onEndAnimation : {
                    fn : function () {
                        if (prop.name == "opacity") {
                            this._checkOpacity(this.div1, prop.value);
                        } else if (prop.name == "backgroundPositionX" || prop.name == "backgroundPositionY") {
                            var val = this.div1.style["backgroundPosition"].split(" ");
                            this.assertEquals(prop.value, ((prop.name == "backgroundPositionX") ? val[0] : val[1]), 'The property has not been set to its final value: %1 =! %2');
                        } else {
                            this.assertEquals(prop.value, this.div1.style[prop.name], 'The property has not been set to its final value: %1 =! %2');
                        }
                        if (++this.propIndex < this._animProperties.length) {
                            this._testSinglePropertyEffect();
                        } else {
                            this.notifyTestEnd('testAsyncAllPropertiesEffects');
                        }
                    },
                    scope : this
                }
            });

        },

        _checkOpacity : function (div, value) {
            var browser = aria.core.Browser;
            if (browser.isIE6 || browser.isIE7 || browser.isIE8) {
                this.assertEquals("alpha(opacity = " + (value * 100) + ")", div.style["filter"], 'The property has not been set to its final value: %1 =! %2');
            } else {
                this.assertEquals(value + "", div.style["opacity"], 'The property has not been set to its final value: %1 =! %2');
            }
        },

        _testMultipleAnim : function (divNum) {
            if (divNum == 1) {
                this.assertEquals("80px", this.div1.style["width"], 'The property has not been set to its final value: %1 =! %2');
                this.assertEquals("460px", this.div1.style["marginLeft"], 'The property has not been set to its final value: %1 =! %2');
                this._checkOpacity(this.div1, 0.2);
            } else {
                this.assertEquals("20em", this.div2.style["top"], 'The property has not been set to its final value: %1 =! %2');
                this.assertEquals("460px", this.div2.style["left"], 'The property has not been set to its final value: %1 =! %2');
            }
            if (this.semaphore) {
                this.notifyTestEnd('testAsyncMultipleAnimations');
            } else {
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
                width : 80,
                marginLeft : 460,
                opacity : 0.2
            }, {
                duration : 50,
                onEndAnimation : {
                    fn : function () {
                        this._testMultipleAnim(1);
                    },
                    scope : this
                }
            });

            aria.utils.css.Effects.animate(this.div2, {
                top : "20em",
                left : 460
            }, {
                duration : 50,
                onEndAnimation : {
                    fn : function () {
                        this._testMultipleAnim(2);
                    },
                    scope : this
                }
            });
        },

        testAsyncDefaultQueue : function () {
            this.previousAnimation = 0;

            aria.utils.css.Effects.animate("testDiv1", {
                top : 123
            }, {
                queue : true,
                duration : 50,
                onEndAnimation : {
                    fn : function () {
                        this.previousAnimation = 1;
                    },
                    scope : this
                }
            });

            aria.utils.css.Effects.animate("testDiv1", {
                top : 321
            }, {
                queue : true,
                duration : 50,
                onStartAnimation : {
                    fn : function () {
                        this.assertEquals(1, this.previousAnimation, 'The 2nd animation did not start after the 1st: %1 =! %2');
                    },
                    scope : this
                },
                onEndAnimation : {
                    fn : function () {
                        this.previousAnimation = 2;
                    },
                    scope : this
                }
            });

            aria.utils.css.Effects.animate("testDiv1", {
                top : 456
            }, {
                queue : true,
                duration : 50,
                onStartAnimation : {
                    fn : function () {
                        this.assertEquals(2, this.previousAnimation, 'The 3rd animation did not start after the 2nd: %1 =! %2');
                    },
                    scope : this
                },
                onEndAnimation : {
                    fn : function () {
                        this.previousAnimation = 3;
                    },
                    scope : this
                }
            });

            aria.utils.css.Effects.animate("testDiv1", {
                top : 789
            }, {
                queue : true,
                duration : 50,
                onStartAnimation : {
                    fn : function () {
                        this.assertEquals(3, this.previousAnimation, 'The 4th animation did not start after the 3rd: %1 =! %2');
                        this.notifyTestEnd('testDefaultQueue');
                    },
                    scope : this
                }
            });
        },

        testAsyncUserQueue : function () {
            // 2 different queues
            this.previousAnimationA = 0;
            this.previousAnimationB = 0;

            aria.utils.css.Effects.animate("testDiv1", {
                top : 123
            }, {
                queue : "A",
                duration : 200,
                onStartAnimation : {
                    fn : function () {
                        this.previousAnimationA = 1;
                    },
                    scope : this
                }
            });

            aria.utils.css.Effects.animate("testDiv1", {
                top : 321
            }, {
                queue : "A",
                duration : 200,
                onStartAnimation : {
                    fn : function () {
                        this.assertTrue((this.previousAnimationB >= 1), 'The 1st animation of queue B did not start before the 2nd animation of queue A');
                        this.assertEquals(1, this.previousAnimationA, 'The 1nd animation of queue A did not start before the 2nd animation of queue B: %1 =! %2');
                        this.previousAnimationA = 2;
                    },
                    scope : this
                }
            });

            aria.utils.css.Effects.animate("testDiv1", {
                top : 456
            }, {
                queue : "A",
                duration : 200,
                onStartAnimation : {
                    fn : function () {
                        this.assertTrue((this.previousAnimationB >= 2), 'The 2nd animation of queue B did not start before the 3nd animation of queue A');
                        this.assertEquals(2, this.previousAnimationA, 'The 1nd animation of queue A did not start before the 2nd animation of queue B: %1 =! %2');
                        this.previousAnimationA = 3;
                    },
                    scope : this
                },
                onEndAnimation : {
                    fn : function () {
                        this.notifyTestEnd('testAsyncUserQueue');
                    },
                    scope : this
                }
            });

            aria.utils.css.Effects.animate("testDiv2", {
                top : 300
            }, {
                queue : "B",
                duration : 200,
                onStartAnimation : {
                    fn : function () {
                        this.previousAnimationB = 1;
                    },
                    scope : this
                }
            });

            aria.utils.css.Effects.animate("testDiv2", {
                top : 725
            }, {
                queue : "B",
                duration : 200,
                onStartAnimation : {
                    fn : function () {
                        this.assertTrue((this.previousAnimationA >= 1), 'The 1nd animation of queue A did not start before the 2nd animation of queue B');
                        this.assertEquals(1, this.previousAnimationB, 'The 1nd animation of queue A did not start before the 2nd animation of queue B: %1 =! %2');
                        this.previousAnimationB = 2;
                    },
                    scope : this
                }
            });
        },

        testAsyncColorAnimation : function () {

            aria.utils.css.Effects.animate(this.div1, {
                backgroundColor : "#FFFF00"
            }, {
                queue : true,
                duration : 200,
                onEndAnimation : {
                    fn : function () {
                        var col = aria.utils.css.Colors.getRGBComponents(this.div1.style["backgroundColor"]);
                        this.assertTrue(col[0] === 255 && col[1] === 255 && col[2] === 0, 'The property has not been set to its final value');
                    },
                    scope : this
                }
            });

            aria.utils.css.Effects.animate(this.div1, {
                backgroundColor : "green"
            }, {
                queue : true,
                duration : 200,
                onEndAnimation : {
                    fn : function () {
                        var col = aria.utils.css.Colors.getRGBComponents(this.div1.style["backgroundColor"]);
                        this.assertTrue(col[0] === 0 && col[1] === 128 && col[2] === 0, 'The property has not been set to its final value');
                    },
                    scope : this
                }
            });

            aria.utils.css.Effects.animate(this.div1, {
                backgroundColor : "rgb(0,255,255)"
            }, {
                queue : true,
                duration : 200,
                onEndAnimation : {
                    fn : function () {
                        var col = aria.utils.css.Colors.getRGBComponents(this.div1.style["backgroundColor"]);
                        this.assertTrue(col[0] === 0 && col[1] === 255 && col[2] === 255, 'The property has not been set to its final value');
                        this.notifyTestEnd('testAsyncColorAnimation');
                    },
                    scope : this
                }
            });

        },

        testAsyncShowHide : function () {

            aria.utils.css.Effects.hide(this.div1, [], {
                queue : true,
                duration : 200,
                onEndAnimation : {
                    fn : function () {
                        this.assertEquals("none", this.div1.style["display"], 'The property has not been set to its final value: %1 =! %2');
                        this._checkOpacity(this.div1, 0);
                    },
                    scope : this
                }
            });

            aria.utils.css.Effects.show(this.div1, ["width", "height"], {
                queue : true,
                duration : 200,
                onEndAnimation : {
                    fn : function () {
                        this.assertEquals("", this.div1.style["display"], 'The property has not been set to its final value: %1 =! %2');
                        this._checkOpacity(this.div1, 1);
                    },
                    scope : this
                }
            });

            aria.utils.css.Effects.toggle(this.div1, ["width"], {
                queue : true,
                duration : 200,
                onEndAnimation : {
                    fn : function () {
                        this.assertEquals("none", this.div1.style["display"], 'The property has not been set to its final value: %1 =! %2');
                        this._checkOpacity(this.div1, 0);
                        this.notifyTestEnd('testAsyncShowHide');
                    },
                    scope : this
                }
            });

        },

        testAsyncRelativeSize : function () {
            this.div1.style["width"] = "50px";
            this.div1.style["height"] = "20%";

            aria.utils.css.Effects.animate(this.div1, {
                width : "+=50px"
            }, {
                queue : true,
                duration : 200,
                onEndAnimation : {
                    fn : function () {
                        this.assertEquals("100px", this.div1.style["width"], 'The property has not been set to its final value: %1 =! %2');
                    },
                    scope : this
                }
            });

            aria.utils.css.Effects.animate(this.div1, {
                height : "-=5%"
            }, {
                queue : true,
                duration : 200,
                onEndAnimation : {
                    fn : function () {
                        this.assertEquals("15%", this.div1.style["height"], 'The property has not been set to its final value: %1 =! %2');
                        this.notifyTestEnd('testAsyncRelativeSize');
                    },
                    scope : this
                }
            });

        },

        testAsyncAnimationControl : function () {
            var width, height;
            this.div1.style["width"] = "50px";
            this.div1.style["height"] = "50px";
            var opt = {
                queue : true,
                duration : 1000
            };

            var id1 = aria.utils.css.Effects.animate(this.div1, {
                width : "200px"
            }, opt);

            var id2 = aria.utils.css.Effects.animate(this.div1, {
                height : "200px"
            }, opt);

            var id3 = aria.utils.css.Effects.animate(this.div1, {
                width : "10px"
            }, opt);

            var id4 = aria.utils.css.Effects.animate(this.div1, {
                height : "10px"
            }, opt);

            var id5 = aria.utils.css.Effects.animate(this.div1, {
                width : "200px"
            }, opt);

            var that = this;
            setTimeout(function () {
                aria.utils.css.Effects.pauseAnimation(id1);
                width = parseFloat(that.div1.style["width"]);
                that.assertTrue((width > 50 && width < 200), 'The property is not in an intermediate state');
            }, 500);

            setTimeout(function () {
                var currWidth = parseFloat(that.div1.style["width"]);
                that.assertEquals(width, currWidth, 'The animation has not been paused, width has changed: %1 =! %2');
                aria.utils.css.Effects.resumeQueue();
            }, 800);

            setTimeout(function () {
                aria.utils.css.Effects.pauseQueue();
                var currHeight = that.div1.style["width"];
                height = parseFloat(that.div1.style["height"]);
                that.assertEquals("200px", currHeight, 'The property has not been set to its final value:: %1 =! %2');
                that.assertTrue((height > 50 && height < 200), 'The property is not in an intermediate state');
            }, 1800);

            setTimeout(function () {
                var currHeight = parseFloat(that.div1.style["height"]);
                that.assertEquals(height, currHeight, 'The animation has not been paused, height has changed: %1 =! %2');
                aria.utils.css.Effects.resumeAnimation(id2);
            }, 3000);

            setTimeout(function () {
                aria.utils.css.Effects.skipAnimation(id3);
                width = parseFloat(that.div1.style["width"]);
                that.assertTrue((width > 10 && width < 200), 'The property is not in an intermediate state');
            }, 4000);

            setTimeout(function () {
                var currWidth = parseFloat(that.div1.style["width"]);
                that.assertEquals(width, currWidth, 'The animation has not been skipped: %1 =! %2');
                width = currWidth;
                aria.utils.css.Effects.skipQueue();
                height = parseFloat(that.div1.style["height"]);
                that.assertTrue((height > 10 && width < 200), 'The property is not in an intermediate state');
            }, 4500);

            setTimeout(function () {
                that.assertEquals(height, parseFloat(that.div1.style["height"]), 'The queue has not been skipped: %1 =! %2');
                that.assertEquals(width, parseFloat(that.div1.style["width"]), 'The queue has not been skipped: %1 =! %2');
                that.notifyTestEnd('testAsyncAnimationControl');
            }, 5200);

        }

    }
});
