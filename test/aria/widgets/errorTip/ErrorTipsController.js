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
 * Controller for error tips samples.
 * @class AppModule
 */
Aria.classDefinition({
    $classpath : 'test.aria.widgets.errorTip.ErrorTipsController',
    $extends : 'aria.templates.ModuleCtrl',
    $implements : ['test.aria.widgets.errorTip.IErrorTipsController'],
    $dependencies : ['aria.utils.validators.Mandatory', 'aria.utils.Data'],
    $constructor : function () {
        this.$ModuleCtrl.constructor.call(this);
        this._data = {
            field1 : "",
            errorMessages : [],
            error : false
        };
        this.myDataUtil = aria.utils.Data;
        this.validator = new aria.utils.validators.Mandatory("This field is a required field using a mandatory validator.");
    },
    $destructor : function () {
        this.validator.$dispose();
        this.$ModuleCtrl.$destructor.call(this);
    },
    $prototype : {
        $publicInterfaceName : "test.aria.widgets.errorTip.IErrorTipsController",
        init : function (arg, cb) {
            var validatorOnSubmit = this.validator;
            this.myDataUtil.setValidator(this._data, "field1", validatorOnSubmit);
            this.$callback(cb);
        },
        submit : function () {
            var messages = {};
            this.myDataUtil.validateModel(this._data, messages);
            this.json.setValue(this._data, "errorMessages", messages.listOfMessages);
            this.json.setValue(this._data, "error", (!!messages.nbrOfE));
        }
    }
});
