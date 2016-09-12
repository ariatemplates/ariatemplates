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
    $classpath : "test.aria.widgets.AriaSkinNormalizationTest",
    $dependencies : ["aria.widgets.AriaSkinNormalization"],
    $extends : "aria.jsunit.TestCase",
    $prototype : {
        testNormalizeIcon : function () {
            var widgetSkin = {};
            aria.widgets.AriaSkinNormalization.normalizeWidget("Icon", widgetSkin);
            this.assertTrue(widgetSkin.std.biDimensional === false);
            this.assertTrue(widgetSkin.std.content != null);

            // check that icons are not inherited (the only widget for which we don't inherit from std)
            widgetSkin = {
                std : {
                    content : {
                        myIcon : 1
                    }
                },
                other : {}
            };
            aria.widgets.AriaSkinNormalization.normalizeWidget("Icon", widgetSkin);
            this.assertTrue(widgetSkin.std.content != null);
            this.assertFalse("myIcon" in widgetSkin.other.content);
        },

        testNormalizeOrder : function () {
            var widgetSkin = {
                std : {
                    frame : {
                        frameType : "Simple"
                    },
                    innerPaddingTop : 1,
                    innerPaddingLeft : 1,
                    states : {
                        normal : {
                            frame : {
                                paddingRight : 1,
                                paddingTop : 1,
                                paddingLeft : 1,
                                paddingBottom : 1
                            }
                        },
                        normalFocused : {
                            frame : {
                                paddingRight : 2,
                                paddingTop : 2
                            }
                        }
                    }
                },
                other : {
                    innerPaddingTop : 2,
                    states : {
                        normal : {
                            frame : {
                                paddingRight : 3,
                                paddingTop : 3,
                                paddingLeft : 3
                            }
                        },
                        normalFocused : {
                            frame : {
                                paddingTop : 4
                            }
                        }
                    }
                }
            };

            aria.widgets.AriaSkinNormalization.normalizeWidget("TextInput", widgetSkin);

            // test with skin class properties :

            var curSkinClass = widgetSkin.other;
            this.assertTrue(curSkinClass.innerPaddingTop === 2); // not inherited
            this.assertTrue(curSkinClass.innerPaddingLeft === 1); // inherited from std
            this.assertTrue(curSkinClass.innerPaddingBottom === 0); // default property value

            curSkinClass = widgetSkin.std;
            this.assertTrue(curSkinClass.innerPaddingTop === 1); // not inherited
            this.assertTrue(curSkinClass.innerPaddingLeft === 1); // not inherited
            this.assertTrue(curSkinClass.innerPaddingBottom === 0); // default property value

            // test with a frame state properties :

            var curFrameProp = widgetSkin.other.states.normalFocused.frame;
            this.assertTrue(curFrameProp.paddingTop === 4); // not inherited
            this.assertTrue(curFrameProp.paddingRight === 2); // inherited from std normalFocused
            this.assertTrue(curFrameProp.paddingLeft === 3); // inherited from other normal
            this.assertTrue(curFrameProp.paddingBottom === 1); // inherited from std normal
            this.assertTrue(curFrameProp.borderSize === 0); // default property value

            curFrameProp = widgetSkin.other.states.normal.frame;
            this.assertTrue(curFrameProp.paddingTop === 3); // not inherited
            this.assertTrue(curFrameProp.paddingRight === 3); // not inherited
            this.assertTrue(curFrameProp.paddingLeft === 3); // not inherited
            this.assertTrue(curFrameProp.paddingBottom === 1); // inherited from std normal
            this.assertTrue(curFrameProp.borderSize === 0); // default property value

            curFrameProp = widgetSkin.std.states.normalFocused.frame;
            this.assertTrue(curFrameProp.paddingTop === 2); // not inherited
            this.assertTrue(curFrameProp.paddingRight === 2); // not inherited
            this.assertTrue(curFrameProp.paddingLeft === 1); // inherited from std normal
            this.assertTrue(curFrameProp.paddingBottom === 1); // inherited from std normal
            this.assertTrue(curFrameProp.borderSize === 0); // default property value
        }
    }
});
