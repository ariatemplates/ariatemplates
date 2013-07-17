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
 * Check the LCResourcesHandler improvements
 * @class test.aria.widgets.form.autocomplete.handler.test1.LCHandlerTestCase
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.form.autocomplete.handler.test1.LCHandlerTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.resources.handlers.LCResourcesHandler"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
    },
    $destructor : function () {

        this.$TemplateTestCase.$destructor.call(this);
    },
    $prototype : {
        runTemplateTest : function () {
            this.templateCtxt.$focus("ac1");
            this.acWidget = this.getWidgetInstance("ac1");
            this.acResourcehandler = this.acWidget._cfg.resourcesHandler;
            this._assertHandlerConfig();
            this._assertTotalSuggestions();
            this.synEvent.type(this.getInputField("ac1"), "AAR", {
                fn : this._onUserTyped,
                scope : this
            });
        },

        _onUserTyped : function () {
            aria.core.Timer.addCallback({
                fn : this._afterBlur,
                scope : this,
                delay : 800
            });

        },

        _afterBlur : function () {
            this.synEvent.type(this.getInputField("ac1"), "[enter]", {
                fn : this._onAfterEnter,
                scope : this
            });
        },

        _onAfterEnter : function () {
            var input = this.getInputField("ac1");
            this.assertTrue(input && input.value == "Aarhus", "Wrong suggestion got selected.");
            this._secondACtest();

        },

        _secondACtest : function(){
            this.templateCtxt.$focus("ac2");
            this.acWidget = this.getWidgetInstance("ac2");
            this.acResourcehandler = this.acWidget._cfg.resourcesHandler;
            this._assertACconfig();
            this.synEvent.type(this.getInputField("ac2"), "a", {
                fn : this._onDelay,
                scope : this
            });
        },

        _onDelay : function () {
            aria.core.Timer.addCallback({
                fn : this._afterDelay,
                scope : this,
                delay : 1000
            });

        },
        _afterDelay : function(){
            this.synEvent.type(this.getInputField("ac2"), "[down][down][down][enter]", {
                fn : this._onAftersecondEntr,
                scope : this
            });
        },

        _onAftersecondEntr : function(){
            var input = this.getInputField("ac2");
            this.assertTrue(input && input.value == "Air Canada", "Wrong suggestion got selected.");
            this.notifyTemplateTestEnd();

        },
        _assertTotalSuggestions : function(){
        this.assertFalse(this.acResourcehandler._suggestions.length != 6, "Does not match expected number of suggestions, Expected: 6 and returns "
                    + this.acResourcehandler._suggestions.length);

        },
        _assertHandlerConfig : function(){
            this.assertTrue(this.acResourcehandler.codeExactMatch === false, "The code exact must be false.");
            this.assertTrue(this.acResourcehandler.threshold === 2, "Wrong threshold in autocomplete resource handler");
            this.assertTrue(this.acResourcehandler._options.codeKey === "mycode", "Wrong code in autocomplete LCResourcesHandler.");
            this.assertTrue(this.acResourcehandler._options.labelKey === "mykey", "Wrong label in autocomplete LCResourcesHandler.");
            this.assertTrue((this.acResourcehandler._suggestions[0].label == "scotland" && this.acResourcehandler._suggestions[5].label == "aalborg"), "Sorting in autocomplete LCResourcesHandler should be in descending order");

        },
        _assertACconfig : function(){
            this.assertTrue(this.acResourcehandler.codeExactMatch === true, "The code exact must be false.");
            this.assertTrue(this.acResourcehandler.threshold === 1, "Wrong threshold in autocomplete resource handler");
            this.assertTrue(this.acResourcehandler._options.codeKey === "code", "Wrong code in autocomplete LCResourcesHandler.");
            this.assertTrue(this.acResourcehandler._options.labelKey === "label", "Wrong label in autocomplete LCResourcesHandler.");
            this.assertTrue((this.acResourcehandler._suggestions[0].label == "quantas" && this.acResourcehandler._suggestions[5].label == "air canada"), "Sorting in autocomplete LCResourcesHandler should be in ascending order");
        }

    }
});