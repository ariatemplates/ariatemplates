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
var Aria = require("../../Aria");
var ariaTemplatesModuleCtrl = require("../../templates/ModuleCtrl");


/**
 * Module controller for contextual menu.
 * @class aria.tools.contextual.ContextualModuleCtrl
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.tools.contextual.ContextualModule',
    $extends : ariaTemplatesModuleCtrl,
    $constructor : function () {
        this.$ModuleCtrl.constructor.call(this);
    },
    $prototype : {
        init : function (args, cb) {
            this._data = args;
            this.$callback(cb);
        }
    }
});
