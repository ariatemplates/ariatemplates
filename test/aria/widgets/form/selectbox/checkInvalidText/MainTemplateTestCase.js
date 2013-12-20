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
    $classpath : "test.aria.widgets.form.selectbox.checkInvalidText.MainTemplateTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        this.data = {
            countries : [{
                        value : "FR",
                        label : "France"
                    }, {
                        value : "CH",
                        label : "Switzerland"
                    }, {
                        value : "UK",
                        label : "United Kingdom"
                    }, {
                        value : "BR",
                        label : "Brazil"
                    }, {
                        value : "ES",
                        label : "Spain"
                    }, {
                        value : "IT",
                        label : "Italy"
                    }, {
                        value : "SE",
                        label : "Sweden"
                    }, {
                        value : "USA",
                        label : "United States of America"
                    }]
        };

        this.setTestEnv({
            template : "test.aria.widgets.form.selectbox.checkInvalidText.MainTemplate",
            data : this.data
        });
        this.selectbox1 = null;
        this.selectbox2 = null;
    },
    $prototype : {
        /**
         * This method is always the first entry point to a template test Start the test by focusing the first field
         */
        runTemplateTest : function () {
            this.selectbox1 = this.getInputField("selectbox1");
            this.selectbox2 = this.getInputField("selectbox2");

            this.synEvent.click(this.selectbox1, {
                fn : this.typeInsideFirstSelectBox,
                scope : this
            });
        },
        /**
         * Type an invalid entry inside the first selectbox (that has the allowInvalidText = true)
         */
        typeInsideFirstSelectBox : function () {
            this.synEvent.type(this.selectbox1, "Germany", {
                fn : this.afterTypingInvalidText,
                scope : this
            });
        },
        /**
         * Check that the input field is updated and delete one character using backspace key
         */
        afterTypingInvalidText : function () {
            var value = this.selectbox1.value;
            this.assertTrue(value == "Germany", "The Selectbox value should be equal to Germany");
            this.synEvent.type(this.selectbox1, "[backspace]", {
                fn : this.afterRemovingByBackspace,
                scope : this
            });
        },
        /**
         * Test backspace is working and remove 2 characters using delete key
         */
        afterRemovingByBackspace : function () {
            var value = this.selectbox1.value;
            this.assertTrue(value == "German", "The Selectbox value should be equal to German (without y)");
            this.synEvent.type(this.selectbox1, "[left][left][delete][delete]", {
                fn : this.afterRemovingByDelete,
                scope : this
            });
        },
        /**
         * Test delete is working, clean the field and put another invalid entry
         */
        afterRemovingByDelete : function () {
            var value = this.selectbox1.value;
            this.assertTrue(value == "Germ", "The Selectbox value should be equal to Germ");
            this.synEvent.type(this.selectbox1, "[backspace][backspace][backspace][backspace]Japan", {
                fn : this.prepareCopy,
                scope : this
            });
        },
        /**
         * CTRL+C to copy the invalid text
         */
        prepareCopy : function () {
            var value = this.selectbox1.value;
            this.assertTrue(value == "Japan", "The Selectbox value should be equal to Japan");
            aria.utils.Caret.setPosition(this.selectbox1, 0, 5);
            this.synEvent.type(this.selectbox1, "[<CTRL>]c[>CTRL<]", {
                fn : this.onCopy,
                scope : this
            });
        },
        /**
         * Check the input value and clean the input field
         */
        onCopy : function () {
            var value = this.selectbox1.value;
            this.assertTrue(value == "Japan", "The Selectbox value should be equal to Japan");
            this.synEvent.type(this.selectbox1, "[backspace][backspace][backspace][backspace][backspace]", {
                fn : this.afterRemovingEverything,
                scope : this
            });
        },
        /**
         * CTRL+V to paste the invalid text
         */
        afterRemovingEverything : function () {
            var value = this.selectbox1.value;
            this.assertTrue(value === "", "The Selectbox value should be empty");
            this.synEvent.type(this.selectbox1, "[<CTRL>]v[>CTRL<]", {
                fn : this.onPaste,
                scope : this
            });
        },
        /**
         * After pasting, check that the input field is updated
         */
        onPaste : function () {
            var value = this.selectbox1.value;
            this.assertTrue(value == "Japan", "The Selectbox value should be equal to Japan");
            this.synEvent.type(this.selectbox1, "[backspace]", {
                fn : this.afterRemovingByBackspaceTwo,
                scope : this
            });
        },
        /**
         * Checking that backspace is still working
         */
        afterRemovingByBackspaceTwo : function () {
            var value = this.selectbox1.value;
            this.assertTrue(value == "Japa", "The Selectbox value should be equal to Japa (without n)");
            this.synEvent.type(this.selectbox1, "[left][left][delete]", {
                fn : this.afterRemovingByDeleteTwo,
                scope : this
            });
        },
        /**
         * Checking that delete is still working and focus on the second selectbox (that has the allowInvalidText = false)
         */
        afterRemovingByDeleteTwo : function () {
            var value = this.selectbox1.value;
            this.assertTrue(value == "Jaa", "The Selectbox value should be equal to Jaa");

            this.synEvent.click(this.selectbox2, {
                fn : this.typeInsideSecondSelectBox,
                scope : this
            });
        },
        /**
         * Type an invalid text
         */
        typeInsideSecondSelectBox : function () {
            this.synEvent.type(this.selectbox2, "A", {
                fn : this.afterTypingInvalidTextThree,
                scope : this
            });
        },
        /**
         * Check that the input field is not updated and paste an invalid text
         */
        afterTypingInvalidTextThree : function () {
            var value = this.selectbox2.value;
            this.assertTrue(value === "", "The Selectbox value should be empty");

            this.synEvent.type(this.selectbox2, "[<CTRL>]v[>CTRL<]", {
                fn : this.onPasteTwo,
                scope : this
            });
        },
        /**
         * After pasting, check that the input field is not updated
         */
        onPasteTwo : function () {
            var value = this.selectbox2.value;
            this.assertTrue(value === "", "The Selectbox value should be empty");
            this.synEvent.type(this.selectbox2, "Bra", {
                fn : this.onLastType,
                scope : this
            });
        },
        /**
         * Check that the selectbox is working typing a valid text
         */
        onLastType : function () {
            var value = this.selectbox2.value;
            this.assertTrue(value == "Bra", "The Selectbox value should be equal to Bra");
            this.synEvent.type(this.selectbox2, "[backspace][backspace][backspace]", {
                fn : this.onLastDelete,
                scope : this
            });
        },
        /**
         * Check that the backspace is working
         */
         onLastDelete : function () {
            var value = this.selectbox2.value;
            this.assertTrue(value === "", "The Selectbox value should be empty");
            this.notifyTemplateTestEnd();
        }

    }
});
