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
 * @class aria.widgets.form.Textarea Textarea widget
 * @extends aria.widgets.form.TextInput
 */
Aria.classDefinition({
    $classpath : 'aria.widgets.form.Textarea',
    $extends : 'aria.widgets.form.TextInput',
    $dependencies : ['aria.widgets.controllers.TextDataController'],
    $css : ["aria.widgets.form.TextareaStyle"],
    $statics : {
        LABEL_HEIGHT : 13
    },
    /**
     * Textarea constructor
     * @param {aria.widgets.CfgBeans.TextareaCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     */
    $constructor : function (cfg, ctxt, lineNumber) {
        if (!this._skinnableClass) {
            /**
             * Skinnable class to use for this widget.
             * @protected
             * @type String
             */
            this._skinnableClass = "Textarea";
        }
        var controller = new aria.widgets.controllers.TextDataController();
        this.$TextInput.constructor.call(this, cfg, ctxt, lineNumber, controller);
        this._isTextarea = true;
        cfg.labelHeight = (cfg.labelHeight > -1) ? cfg.labelHeight : this.LABEL_HEIGHT;
    },
    $prototype : {

}
});
