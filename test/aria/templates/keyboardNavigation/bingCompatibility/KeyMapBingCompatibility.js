/*
 * Copyright 2014 Amadeus s.a.s.
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

/**
 * Test the compatibility of AT with the bing map
 * The Bing map javascript intercepts the events on body and prevents their propagation, so
 * it is very important to be sure that the AT delegation system catches all the events at
 * body level (i.e. not window)
 *
 * This test verifies that the keydown event is correctly handled by the Select widget
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.keyboardNavigation.bingCompatibility.KeyMapBingCompatibility",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.map.MapManager", "aria.utils.FireDomEvent", "aria.core.Browser"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.mapMgr = aria.map.MapManager;
        this.setTestEnv({
            template : "test.aria.templates.keyboardNavigation.bingCompatibility.KeyMapBingCompatibilityTpl",
            data : {
                countries : [
                    {
                        value : "FR",
                        label : "France"
                    },
                    {
                        value : "CH",
                        label : "Switzerland"
                    },
                    {
                        value : "UK",
                        label : "United Kingdom"
                    }
                ]
            }
        });
    },
    $prototype : {

        runTemplateTest : function () {
        /*
         * The test is not working on FF3 because only on FF3, if focus is not on an element, event are not caught by the
         * body but the window. So the keydown, keyup and keypress are delegated to the window making Bing map incompatible with AT
         * (Bing map prevent the propagation of all the events to the window)
         */
            if (aria.core.Browser.isFirefox && aria.core.Browser.majorVersion == 3) {
                this.end();
                return;
            }
            this.mapMgr.$onOnce({
                "mapReady" : {
                    fn : this._changeSelected,
                    scope : this
                }
            });
        },

        _changeSelected : function () {
            this.templateCtxt.$focus("select");
            this.synEvent.type(this.getElementById("select"), "[down]", {
                fn : this._focusOut,
                scope : this
            });
        },

        _focusOut : function () {
            this.templateCtxt.$focus("justToFocusOut");
            aria.core.Timer.addCallback({
                fn : this._checkCountry,
                scope : this,
                delay : 200
            });

        },

        _checkCountry : function () {
            this.assertEquals(this.templateCtxt.data.country, "CH", "wrong country selected: %1 =! %2");
            this.end();
        }
    }
});
