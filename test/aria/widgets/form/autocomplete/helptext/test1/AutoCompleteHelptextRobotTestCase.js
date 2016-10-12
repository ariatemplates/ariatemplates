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

Aria.classDefinition({
    $classpath : "test.aria.widgets.form.autocomplete.helptext.test1.AutoCompleteHelptextRobotTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);

        this.dataModel = {
            getSuggestionsCalled : false
        };

        this.setTestEnv({
            template : "test.aria.widgets.form.autocomplete.helptext.test1.HelptextTpl",
            data : this.dataModel
        });

    },
    $prototype : {

        runTemplateTest : function () {
            var field = this.getInputField("ac");
            // This test is intentionally causing a click outside of the viewport in order to reproduce the issue that
            // triggered the code change
            var position = this._getPositionOutOfViewport();
            this.templateCtxt.$focus("ac");
            this.synEvent.execute([["click", position]], {
                fn : this._afterBlur,
                scope : this
            });
        },
        _afterBlur : function () {
            this.assertFalse(this.dataModel.getSuggestionsCalled, "The getSuggestions method of the resource handler has been called with the helptext as argument");

            this.synEvent.execute([["click", {
                        x : 1,
                        y : 1
                    }]], {
                fn : this._afterClickInViewport,
                scope : this
            });
        },

        _afterClickInViewport : function () {
            aria.core.Timer.addCallback({
                fn : this._finalizeTest,
                scope : this,
                delay : 1000
            });
        },

        _finalizeTest : function () {
            this.end();
        },

        _getPositionOutOfViewport : function () {
            if (aria.core.Browser.isFirefox) {
                var viewport = aria.utils.Dom.getViewportSize();
                return {
                    x : 0,
                    y : viewport.height + 1
                };
            }
            return {
                x : 0,
                y : -1
            };
        }

    }
});
