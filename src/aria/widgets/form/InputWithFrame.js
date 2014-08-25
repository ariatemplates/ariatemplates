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
var ariaWidgetsFramesFrameWithIcons = require("../frames/FrameWithIcons");
var ariaUtilsEvent = require("../../utils/Event");
var ariaWidgetsIconStyle = require("../IconStyle.tpl.css");
var ariaWidgetsFormInput = require("./Input");


/**
 * Base class for the input widgets which use a frame.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.form.InputWithFrame",
    $extends : ariaWidgetsFormInput,
    $css : [ariaWidgetsIconStyle],
    $constructor : function (cfg, ctxt) {
        this.$Input.constructor.apply(this, arguments);

        /**
         * Skin configutation
         * @type Object
         * @protected
         */
        this._skinObj = aria.widgets.AriaSkinInterface.getSkinObject(this._skinnableClass, cfg.sclass);

        /**
         * Frame border for the input
         * @type aria.widgets.frames.Frame
         * @protected
         */
        this._frame = null; // created in _inputMarkup

        /**
         * Array of icon names which need to be hidden.
         * @type Array
         */
        this._hideIconNames = null;
        this._setState();
    },
    $destructor : function () {
        if (this._frame) {
            this._frame.$unregisterListeners(this);
            this._frame.$dispose();
            this._frame = null;
        }
        if (this._label) {
            ariaUtilsEvent.removeListener(this._label, "click", {
                fn : this._onLabelClick,
                scope : this
            });
        }
        this.$Input.$destructor.call(this);
    },
    $prototype : {
        /**
         * To be called on frame events.
         * @param {aria.DomEvent} evt Event fired
         * @protected
         */
        _frame_events : function (evt) {},
        /**
         * Override the Input _init method
         * @protected
         */
        _init : function () {
            this.$Input._init.call(this);
            var label = this.getLabel();
            if (label) {
                ariaUtilsEvent.addListener(label, "click", {
                    fn : this._onLabelClick,
                    scope : this
                });
            }
        },
        /**
         * Function to set the focus on input element.
         * @param {Object} evt the original event
         * @protected
         */
        _onLabelClick : function (evt) {
            this.getTextInputField().focus();
        },

        /**
         * Internal method to override to process the input block markup
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         * @protected
         */
        _inputMarkup : function (out) {
            var cfg = this._cfg;
            this._frame = ariaWidgetsFramesFrameWithIcons.createFrame({
                sclass : cfg.sclass,
                id : this._domId,
                skinnableClass : this._skinnableClass,
                width : this._inputMarkupWidth,
                state : this._state,
                scrollBarX : false,
                scrollBarY : false,
                tooltipLabels : [cfg.iconTooltip],
                hideIconNames : this._hideIconNames,
                inlineBlock : true,
                // used for table frame, defaults to false
                height : this._inputMarkupHeight
            });
            this._frame.$on({
                "*" : this._frame_events,
                scope : this
            });
            this._frame.writeMarkupBegin(out);
            this._inputWithFrameMarkup(out);
            this._frame.writeMarkupEnd(out);
        },

        /**
         * Internal method to override to process the input block markup
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         * @protected
         */
        _inputWithFrameMarkup : function (out) {},

        /**
         * Internal method to override to initialize a widget (e.g. to listen to DOM events)
         * @param {HTMLElement} elt the Input markup DOM elt - never null
         * @protected
         */
        _initInputMarkup : function (elt) {
            this._frame.linkToDom(elt);
        },

        /**
         * Internal method to override to set the state of the widget
         * @protected
         */
        _setState : function () {
            this._state = "normal";
        },

        /**
         * Internal method to update the state of the frame.
         * @protected
         */
        _updateState : function () {
            this._setState();
            if (!this._selectField && !this._initDone) {
                this.getDom();
            }
            this._updateLabelState();
            this._frame.changeState(this._state);
        }
    }
});
