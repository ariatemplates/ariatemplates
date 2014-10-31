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
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.form.autocomplete.ampersand.AutoCompleteCtrl",
    $extends : "aria.templates.ModuleCtrl",
    $dependencies : ["aria.utils.validators.RegExp", "aria.utils.Data"],
    $constructor : function (data) {
        this.$ModuleCtrl.constructor.call(this);
        this.myDataUtil = aria.utils.Data;
        this._data = {
            "value" : ""
        };
        this.ampersandValidator = new aria.utils.validators.RegExp(/^[^&]*$/, "Ampersands are not valid characters!");
    },
    $destructor : function () {
        this.ampersandValidator.$dispose();
        this.$ModuleCtrl.$destructor.call(this);
    },
    $prototype : {
        init : function (arg, cb) {
            this.myDataUtil.setValidator(this._data, "value", this.ampersandValidator, null, "onblur");
            this.$callback(cb);
        }
    }
});
