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
    $classpath : "test.aria.widgets.form.datepicker.bindableMinMax.DatePicker",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.data = {
            boundValueDPInit : new Date(2013, 11, 18),
            submitValueDPInit : null,
            submitValueDPMinT : null,
            submitValueDPMinF : null,
            submitValueDPMaxT : null,
            submitValueDPMaxF : null
        };
        this.setTestEnv({
            data : this.data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this._datePickerFieldDPInit = this.getInputField("DPInit");
            this.synEvent.click(this._datePickerFieldDPInit, {
                fn : this._afterClickingDPInit,
                scope : this
            });

        },
        _afterClickingDPInit : function () {
            this.synEvent.type(this._datePickerFieldDPInit, "18/11/2013", {
                fn : this._afterTypingDPInit,
                scope : this
            });
        },
        _afterTypingDPInit : function () {
            this._datePickerFieldDPMinT = this.getInputField("DPMinT");
            this.synEvent.click(this._datePickerFieldDPMinT, {
                fn : this._afterClickingDPMinT,
                scope : this
            });
        },
        _afterClickingDPMinT : function () {
            this.synEvent.type(this._datePickerFieldDPMinT, "19/11/2013", {
                fn : this._afterTypingDPMinT,
                scope : this
            });
        },
        _afterTypingDPMinT : function () {
            this._datePickerFieldDPMinF = this.getInputField("DPMinF");
            this.synEvent.click(this._datePickerFieldDPMinF, {
                fn : this._afterClickingDPMinF,
                scope : this
            });
        },
        _afterClickingDPMinF : function () {
            this.synEvent.type(this._datePickerFieldDPMinF, "17/11/2013", {
                fn : this._afterTypingDPMinF,
                scope : this
            });
        },
        _afterTypingDPMinF : function () {
            this._datePickerFieldDPMaxT = this.getInputField("DPMaxT");
            this.synEvent.click(this._datePickerFieldDPMaxT, {
                fn : this._afterClickingDPMaxT,
                scope : this
            });
        },
        _afterClickingDPMaxT : function () {
            this.synEvent.type(this._datePickerFieldDPMaxT, "16/11/2013", {
                fn : this._afterTypingDPMaxT,
                scope : this
            });
        },
        _afterTypingDPMaxT : function () {
            this._datePickerFieldDPMaxF = this.getInputField("DPMaxF");
            this.synEvent.click(this._datePickerFieldDPMaxF, {
                fn : this._afterClickingDPMaxF,
                scope : this
            });
        },
        _afterClickingDPMaxF : function () {
            this.synEvent.type(this._datePickerFieldDPMaxF, "19/11/2013[enter]", {
                fn : this._clickTextFieldTBdummy,
                scope : this
            });
        },
        _clickTextFieldTBdummy : function () {
            this._textFieldTBdummy = this.getInputField("TBdummy");
            this.synEvent.click(this._textFieldTBdummy, {
                fn : this._assertAndEnd,
                scope : this
            });
        },
        _assertAndEnd : function () {
            try {
                // check that the value in submitValue is the right one
                this.assertTrue(this.data.submitValueDPInit.getFullYear() == "2013", "Wrong value in data.submitValue");
                this.assertTrue(this.data.submitValueDPMinT != null, "The date was not supposed to be null as it is less than minValue");
                this.assertTrue(this.data.submitValueDPMinF == null, "The date was not supposed to be bound as it is more than minValue");
                this.assertTrue(this.data.submitValueDPMaxT != null, "The date was not supposed to be null as it is less than maxValue");
                this.assertTrue(this.data.submitValueDPMaxF == null, "The date was not supposed to be bound as it is more than maxValue");
                this.notifyTemplateTestEnd();
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        }
    }
});
