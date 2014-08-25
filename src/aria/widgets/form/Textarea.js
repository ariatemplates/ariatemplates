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
var ariaWidgetsControllersTextDataController = require("../controllers/TextDataController");
var ariaWidgetsFormTextareaStyle = require("./TextareaStyle.tpl.css");
var ariaWidgetsFormTextInput = require("./TextInput");


/**
 * @class aria.widgets.form.Textarea Textarea widget
 * @extends aria.widgets.form.TextInput
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.widgets.form.Textarea',
    $extends : ariaWidgetsFormTextInput,
    $css : [ariaWidgetsFormTextareaStyle],
    $statics : {
        LABEL_HEIGHT : 13
    },
    /**
     * Textarea constructor
     * @param {aria.widgets.CfgBeans.TextareaCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     * @param {Number} lineNumber Line number corresponding in the .tpl file where the widget is created
     */
    $constructor : function (cfg, ctxt, lineNumber) {
        var controller = new ariaWidgetsControllersTextDataController();
        this.$TextInput.constructor.call(this, cfg, ctxt, lineNumber, controller);
        this._isTextarea = true;
        cfg.labelHeight = (cfg.labelHeight > -1) ? cfg.labelHeight : this.LABEL_HEIGHT;

        this.cfg = cfg;
    },

    $prototype : {
        /**
         * Skinnable class to use for this widget.
         * @protected
         * @type String
         */
        _skinnableClass : "Textarea",

        _dom_onkeydown : function (event) {

            var maxlength = this.cfg.maxlength;
            if (maxlength > -1) {

                // The maxlength is managed by a setTimeout in order to manage each situation
                // For example, the cut and paste (the clipboard is not accessible in javascript)

                var textarea = this.getTextInputField();
                var caretPosition = this.getCaretPosition();
                var oldVal = textarea.value;
                var that = this;

                setTimeout(function () {
                    var newVal = textarea.value;
                    if (newVal.length > maxlength) {
                        // The selected part of the current value is not considered
                        var start = caretPosition.start;
                        var end = caretPosition.end;

                        var newPart = newVal.substr(start, maxlength - oldVal.length + end - start);

                        textarea.value = oldVal.substr(0, start) + newPart + oldVal.substr(end);
                        var index = start + newPart.length;
                        that.setCaretPosition(index, index);
                    }
                }, 25);
            }
        }
    }
});
