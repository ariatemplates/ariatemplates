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
    $classpath : "test.aria.widgets.form.datepicker.validation.DatePickerCtrl",
    $extends : 'aria.templates.ModuleCtrl',
    $implements : ['test.aria.widgets.form.datepicker.validation.IDatePickerCtrl'],
    $dependencies : ['aria.utils.validators.Mandatory'],
    $constructor : function () {
        this.$ModuleCtrl.constructor.call(this);
        this._data = {
            date : "",
            errorMessages : []
        };
    },
    $destructor : function () {
        this.validator.$dispose();
        this.validator = null;
        this.$ModuleCtrl.$destructor.call(this);
    },
    $prototype : {
        $publicInterfaceName : "test.aria.widgets.form.datepicker.validation.IDatePickerCtrl",
        init : function (arg, cb) {
            var startDateValidator = this.validator = new aria.utils.validators.Mandatory("date is mandatory");
            aria.utils.Data.setValidator(this._data, "date", startDateValidator);

            this.$callback(cb);
        },
        submit : function () {
            var messages = {};
            aria.utils.Data.validateModel(this._data, messages);
            this.json.setValue(this._data, "errorMessages", messages.listOfMessages);
        }
    }
});
