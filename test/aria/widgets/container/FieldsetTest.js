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

/**
 * Test case for the fieldset.
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.container.FieldsetTest",
    $extends : "aria.jsunit.WidgetTestCase",
    $dependencies : ["aria.utils.FireDomEvent", "aria.utils.Dom", "aria.widgets.container.Fieldset"],
    $prototype : {
        /**
         * Test that the onSubmit callback on the fieldset is well called, depending on the _ariaInput attribute and on
         * the return value of nested fieldsets.
         */
        testFieldsetSubmit : function () {
            var out = aria.jsunit.helpers.OutObj;

            // create the fieldsets
            var fieldsetRoot = new aria.widgets.container.Fieldset({
                onSubmit : {
                    fn : this._fieldsetRootSubmit,
                    scope : this
                }
            }, out.tplCtxt);
            var fieldsetNested1 = new aria.widgets.container.Fieldset({}, out.tplCtxt);
            var fieldsetNested2 = new aria.widgets.container.Fieldset({
                onSubmit : {
                    fn : this._fieldsetNestedSubmit,
                    scope : this
                }
            }, out.tplCtxt);

            // generate the markup
            fieldsetRoot.writeMarkupBegin(out);
            out.write('<input type="text" id="fieldsetTest1"/>');
            out.write('<input type="text" _ariaInput="1" id="fieldsetTest2"/>');
            fieldsetNested1.writeMarkupBegin(out);
            out.write('<input type="text" _ariaInput="1" id="fieldsetTest3"/>');
            fieldsetNested1.writeMarkupEnd(out);
            fieldsetNested2.writeMarkupBegin(out);
            out.write('<input type="text" _ariaInput="1" id="fieldsetTest4"/>');
            fieldsetNested2.writeMarkupEnd(out);
            fieldsetRoot.writeMarkupEnd(out);

            // put everything in the dom
            out.putInDOM();
            fieldsetRoot.initWidget();
            fieldsetNested1.initWidget();
            fieldsetNested2.initWidget();

            // fire the events

            this._fieldsetRootSubmitCalled = 0;
            this._sendEnter("fieldsetTest1"); // field 1 does not have _ariaInput="1", onSubmit should not be called
            this.assertEquals(this._fieldsetRootSubmitCalled, 0);

            this._fieldsetRootSubmitCalled = 0;
            this._sendEnter("fieldsetTest2"); // field 2 has _ariaInput="1", onSubmit should be called
            this.assertEquals(this._fieldsetRootSubmitCalled, 1);

            this._fieldsetRootSubmitCalled = 0;
            this._sendEnter("fieldsetTest3"); // field 3 : onSubmit should be called even if it is in a nested
            // fieldset
            this.assertEquals(this._fieldsetRootSubmitCalled, 1);

            this._fieldsetRootSubmitCalled = 0;
            this._fieldsetNestedSubmitCalled = 0;
            this._fieldsetNestedReturnValue = false; // nested onSubmit return false, root onSubmit should not be
            // called
            this._sendEnter("fieldsetTest4");
            this.assertEquals(this._fieldsetNestedSubmitCalled, 1);
            this.assertEquals(this._fieldsetRootSubmitCalled, 0);

            this._fieldsetRootSubmitCalled = 0;
            this._fieldsetNestedSubmitCalled = 0;
            this._fieldsetNestedReturnValue = true; // nested onSubmit return false, root onSubmit should not be called
            this._sendEnter("fieldsetTest4");
            this.assertEquals(this._fieldsetNestedSubmitCalled, 1);
            this.assertEquals(this._fieldsetRootSubmitCalled, 1);

            // dispose things
            fieldsetRoot.$dispose();
            fieldsetNested1.$dispose();
            fieldsetNested2.$dispose();
            out.clearAll();
        },

        /**
         * Send the enter key to an HTML element given by its id.
         * @param {String} id
         * @protected
         */
        _sendEnter : function (id) {
            var fireEvent = aria.utils.FireDomEvent;
            var dom = aria.utils.Dom;
            var elt = dom.getElementById(id);
            fireEvent.fireEvent("keydown", elt, {
                keyCode : 13
            });
            fireEvent.fireEvent("keyup", elt, {
                keyCode : 13
            });
        },

        /**
         * onSubmit handler for the root fieldset.
         * @protected
         */
        _fieldsetRootSubmit : function () {
            try {
                this.assertEquals(this._fieldsetRootSubmitCalled, 0);
                this._fieldsetRootSubmitCalled = 1;
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }
        },

        /**
         * onSubmit handler for the nested fieldset.
         * @protected
         */
        _fieldsetNestedSubmit : function () {
            try {
                this.assertEquals(this._fieldsetNestedSubmitCalled, 0);
                this._fieldsetNestedSubmitCalled = 1;
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }
            return this._fieldsetNestedReturnValue;
        }

    }
});
