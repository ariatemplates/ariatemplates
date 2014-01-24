/*
 * Copyright 2013 Amadeus s.a.s.
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
 * Test a complete table navigation
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.keyboardNavigation.TableNavTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Delegate", "aria.utils.Dom", "aria.utils.FireDomEvent", "aria.DomEvent"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.setTestEnv({
            data : {
                focus : {}
            }
        });
    },
    $prototype : {
        setUp : function () {
            this._originalRefresh = aria.utils.Dom.refreshDomElt;
            aria.utils.Dom.refreshDomElt = function () {};
        },
        tearDown : function () {
            aria.utils.Dom.refreshDomElt = this._originalRefresh;
        },
        runTemplateTest : function () {

            // clean what was before
            this._disposeTestTemplate();

            // -1 for initial focus
            this.step = -2;

            this.scenario = [{
                        key : "KC_ARROW_DOWN",
                        target : "tf0"
                    }, {
                        key : "KC_ARROW_DOWN",
                        target : "tf1"
                    }, {
                        key : "KC_ARROW_RIGHT",
                        target : "tf2"
                    }, {
                        key : "KC_ARROW_RIGHT",
                        target : "tf3"
                    }, {
                        key : "KC_ARROW_DOWN",
                        target : "tf4"
                    }, {
                        key : "KC_ARROW_UP",
                        target : "tf3"
                    }, {
                        key : "KC_ARROW_LEFT",
                        target : "tf2"
                    }, {
                        key : "KC_ARROW_DOWN",
                        target : "tf4"
                    }, {
                        key : "KC_ARROW_DOWN",
                        target : "tf5"
                    }, {
                        key : "KC_ARROW_LEFT",
                        target : "tf1"
                    }, {
                        key : "KC_ARROW_DOWN",
                        target : "myLink"
                    }, {
                        key : "KC_ARROW_DOWN",
                        target : "tf6"
                    }, {
                        key : "KC_ARROW_DOWN",
                        target : "tf7"
                    }, {
                        key : "KC_ARROW_UP",
                        target : "tf6"
                    }, {
                        key : "KC_ARROW_UP",
                        target : "myLink"
                    }];

            this._loadTestTemplate({
                fn : this.executeScenario,
                scope : this
            });
        },

        executeScenario : function (args) {

            if (this.step < this.scenario.length) {
                if (this.step == -2) {
                    Aria.$window.document.getElementsByTagName("a")[0].focus();
                }
                if (this.step == -1) {
                    this.templateCtxt.$focus("tf-1");
                } else if (this.step >= 0) {
                    var current = aria.utils.Delegate.getFocus();
                    var target = this.scenario[this.step].target;
                    aria.utils.FireDomEvent.fireEvent('keydown', current, {
                        keyCode : aria.DomEvent[this.scenario[this.step].key]
                    });

                }
                this.step++;

                var oSelf = this;
                aria.core.Timer.addCallback({
                    fn : function () {
                        if (target) {
                            oSelf.assertTrue(oSelf.templateCtxt.data.focus[target], "Fail to focus on " + target);
                            oSelf.templateCtxt.data.focus[target] = false;
                        }

                        oSelf.executeScenario(args);
                    },
                    scope : this,
                    delay : 200,
                    args : args
                });
            } else {
                this.notifyTemplateTestEnd();
            }
        }
    }
});
