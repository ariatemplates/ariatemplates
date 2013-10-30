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
 * Fieldset widget, to group related fields together.
 * @class aria.widgets.container.Fieldset
 */
Aria.classDefinition({
    $classpath : "aria.widgets.container.Fieldset",
    $extends : "aria.widgets.container.Container",
    $dependencies : ["aria.utils.Function", "aria.DomEvent", "aria.widgets.frames.FrameFactory", "aria.utils.String"],
    $css : ["aria.widgets.container.FieldsetStyle"],

    /**
     * Fieldset constructor
     * @param {aria.widgets.CfgBeans:FieldsetCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     */
    $constructor : function (cfg, ctxt) {
        this.$Container.constructor.apply(this, arguments);
        if (!this._frame) {
            /* this._frame could be overriden in sub-classes */
            this._frame = aria.widgets.frames.FrameFactory.createFrame({
                skinnableClass : this._skinnableClass,
                sclass : cfg.sclass,
                state : "normal",
                width : cfg.width,
                height : cfg.height,
                printOptions : cfg.printOptions
            });
        }
    },
    $destructor : function () {
        if (this._frame) {
            this._frame.$dispose();
            this._frame = null;
        }
        this.$Container.$destructor.call(this);
    },
    $statics : {
        /**
         * Name of the attribute of HTML elements which specifies if the onSubmit callback should be called when
         * pressing Enter on that element.
         */
        INPUT_ATTRIBUTE : "_ariaInput"
    },
    $prototype : {
        /**
         * Skinnable class to use for this widget.
         * @protected
         * @type String
         */
        _skinnableClass : "Fieldset",
        /**
         * A method called when we initialize the object.
         * @protected
         */
        _init : function () {
            var domElt = this.getDom();
            var content = aria.utils.Dom.getDomElementChild(domElt, 0);
            this._frame.linkToDom(content);
            this.$Container._init.call(this);
        },

        /**
         * This method specifies if the onSubmit callback should be called or not, depending on the target on which the
         * user presses ENTER. If the target contains the value "1" for the _ariaInput attribute, it is considered an
         * input target on which the ENTER key should trigger the onSubmit event.
         * @param {HTMLElement} target target on which the use has pressed the ENTER key
         * @return {Boolean} true if the callback onSubmit callback should be called
         * @protected
         */
        _checkTargetBeforeSubmit : function (target) {
            return (target.getAttribute(this.INPUT_ATTRIBUTE) == "1");
        },

        /**
         * Called from the DOM when a key is pressed inside the fieldset.
         * @param {aria.DomEvent} domEvt event
         * @protected
         */
        _dom_onkeydown : function (domEvt) {
            if (domEvt.keyCode == domEvt.KC_ENTER) {
                if (this._checkTargetBeforeSubmit(domEvt.target)) {
                    var onSubmit = this._cfg.onSubmit;
                    if (onSubmit) {
                        return this.evalCallback(this._cfg.onSubmit) === true;
                    }
                }
            }
        },

        /**
         * Generate the internal widget begin markup
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         * @protected
         */
        _widgetMarkupBegin : function (out) {
            this._frame.writeMarkupBegin(out);
        },

        /**
         * Generate the internal widget end markup
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         * @protected
         */
        _widgetMarkupEnd : function (out) {
            this._frame.writeMarkupEnd(out);
            var label = this._cfg.label;
            if (label) {
                out.write('<span class="xFieldset_' + this._cfg.sclass + '_normal_label">'
                        + aria.utils.String.escapeHTML(label) + '</span>');
            }
        }
    }
});
