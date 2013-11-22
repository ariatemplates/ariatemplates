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
    $classpath : "test.aria.widgets.form.autocomplete.spellcheck.SpellCheckTestCase",
    $dependencies : ["aria.utils.Dom"],
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
    },
    $destructor : function () {
        this.ac = null;
        this.$TemplateTestCase.$destructor.call(this);
    },
    $prototype : {
        runTemplateTest : function () {
            this.acWidget = this.getWidgetInstance("myAutoComplete");
            this.ac = this.getInputField("myAutoComplete");
            this.acWidget.focus();
            this._assertNormalState();
            this.synEvent.type("pparis", this.ac, {
                fn : this._step1,
                scope : this
            });
        },

        _step1 : function () {
            // wait for the popup to be there
            aria.core.Timer.addCallback({
                fn : this._step2,
                scope : this,
                delay : 1000
            });
        },

        _step2 : function () {
            this._assertErrorState();
            // typing again in the field should remove the error state:
            this.synEvent.type("s", this.ac, {
                fn : this._step3,
                scope : this
            });
        },

        _step3 : function () {
            // wait for the popup to be there
            aria.core.Timer.addCallback({
                fn : this._step4,
                scope : this,
                delay : 1000
            });
        },

        _step4 : function () {
            this._assertNormalState();
            // this._assertErrorState();
            this.notifyTemplateTestEnd();
        },

        _assertErrorState : function () {
            // test that the field is in error state
            this.assertTrue(this.acWidget._state == "normalErrorFocused", "The auto-complete should be in the normalErrorFocused state.");
            // check that the suggestion is there:
            var suggestion = aria.utils.Dom.getElementById("testSpellingSuggestion");
            this.assertTrue(suggestion != null, "A suggestion should be displayed to the user.");
        },

        _assertNormalState : function () {
            this.assertTrue(this.acWidget._state == "normalFocused", "The auto-complete should be in the normalFocused state.");
            // check that the suggestion is there:
            var suggestion = aria.utils.Dom.getElementById("testSpellingSuggestion");
            this.assertTrue(suggestion == null, "No suggestion should be displayed to the user.");
        }
    }
});
