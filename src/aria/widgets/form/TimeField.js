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
var ariaWidgetsControllersTimeController = require("../controllers/TimeController");
var ariaWidgetsFormTextInput = require("./TextInput");


/**
 * @class aria.widgets.form.TimeField TimeField widget
 * @extends aria.widgets.form.TextInput
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.widgets.form.TimeField',
    $extends : ariaWidgetsFormTextInput,
    /**
     * TimeField constructor
     * @param{aria.widgets.CfgBeans.TimeFieldCfg} cfg the widget configuration
     * @param{aria.templates.TemplateCtxt} ctxt template context
     * @param {Number} lineNumber Line number corresponding in the .tpl file where the widget is created
     */
    $constructor : function (cfg, ctxt, lineNumber) {
        var controller = new ariaWidgetsControllersTimeController(cfg);
        controller.setPattern(cfg.pattern);
        this.$TextInput.constructor.call(this, cfg, ctxt, lineNumber, controller);
    },
    $prototype : {}
});
