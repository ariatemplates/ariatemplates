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
 * Validation Class for all Input widgets.
 */
Aria.classDefinition({
    $classpath : "aria.widgets.form.InputValidationHandler",
    $dependencies : ["aria.DomEvent", "aria.utils.Dom", "aria.popups.Popup", "aria.widgets.container.Div",
            "aria.templates.Layout"],
    $constructor : function (widget) {
        this._context = widget._context;
        this._lineNumber = widget._lineNumber;
        this._field = widget.getValidationPopupReference();
        this._WidgetCfg = widget._cfg;
        this._validationPopup = null; // null when the validation is closed
        this._preferredPositions = {
            "top right" : {
                reference : "top right",
                popup : "bottom left",
                offset : {
                    left : -30
                }
            },
            "bottom right" : {
                reference : "bottom right",
                popup : "top left",
                offset : {
                    left : -30
                }
            },
            "top left" : {
                reference : "top left",
                popup : "bottom right",
                offset : {
                    right : -30
                }
            },
            "bottom left" : {
                reference : "bottom left",
                popup : "top right",
                offset : {
                    right : -30
                }
            }
        };

        /**
         * Div for the error tooltip skinning. The reference is keep to change its state depending on the positioning of
         * the popup.
         * @type aria.widgets.container.Div
         */
        this._div = null;

    },
    $destructor : function () {
        this._closeValidation();
        this._context = null;
        this._field = null;
        this._WidgetCfg = null;
        this._validationPopup = null;
    },
    $prototype : {

        /**
         * Error messages can be declared in the template or within the widget via the framework itself. Need to
         * determine which is which.
         * @param {Array} errorMessage
         * @private
         */
        _checkErrorMessage : function (errorMessage) {

            var msg = null;

            for (var i = 0; i < errorMessage.length; i++) {
                if (msg === null && errorMessage[i]) {
                    msg = errorMessage[i];
                }
            }

            return msg;
        },

        /**
         * Creates the container markup with the error message
         * @param {aria.templates.MarkupWriter} out Markup writer which should receive the content of the popup.
         * @private
         */
        _renderValidationContent : function (out) {
            var errorMessage;
            if (this._WidgetCfg.formatError) {// framework errors
                errorMessage = this._WidgetCfg.formatErrorMessages;
            } else if (this._WidgetCfg.error) {// template errors
                errorMessage = this._WidgetCfg.errorMessages;
            }

            var div = new aria.widgets.container.Div({
                sclass : "errortip",
                width : 289,
                margins : "0 0 0 0"
            }, this._context);
            out.registerBehavior(div);
            div.writeMarkupBegin(out);
            out.write(this._checkErrorMessage(errorMessage));
            div.writeMarkupEnd(out);
            this._div = div;
        },

        /**
         * Internal method called when the validation must be open
         * @private
         */
        _openValidation : function () {
            if (this._validationPopup) {
                return;
            }
            // create the section
            var section = this._context.createSection({
                fn : this._renderValidationContent,
                scope : this
            });
            // we no longer store the section in this._section as the section is properly disposed by the popup when it
            // is disposed
            var popup = new aria.popups.Popup();
            this._validationPopup = popup;
            this._validationPopup.$on({
                "onAfterClose" : this._afterValidationClose,
                "onPositioned" : this._onTooltipPositioned,
                scope : this
            });
            aria.templates.Layout.$on({
                "viewportResized" : this._onViewportResized,
                scope : this
            });
            this._validationPopup.open({
                section : section,
                domReference : this._field,
                preferredPositions : this._getPreferredPositions(),
                closeOnMouseClick : true,
                closeOnMouseScroll : false
            });
        },

        /**
         * Creates an array of preferred positions, will first get the preferred position specified in the widgets
         * errorTipPosition property.
         * @return {Array} Returns an array of preferred positions.
         */
        _getPreferredPositions : function () {
            var errorTipPosition = this._WidgetCfg.errorTipPosition;
            var preferredPositions = [this._preferredPositions[errorTipPosition]];
            for (var i in this._preferredPositions) {
                if (this._preferredPositions.hasOwnProperty(i) && errorTipPosition != i) {
                    preferredPositions.push(this._preferredPositions[i]);
                }
            }
            return preferredPositions;
        },

        /**
         * Raised after the popup is closed.
         * @param {Object} evt
         */
        _afterValidationClose : function (evt) {
            this._validationPopup.$dispose();
            // Note that we must not call this._div.$dispose() here
            // as this is already done through the section
            this._div = null;
            this._validationPopup = null;
            aria.templates.Layout.$unregisterListeners(this);
        },

        /**
         * Internal method called when the popup must be closed
         * @private
         */
        _closeValidation : function () {
            if (!this._validationPopup) {
                return;
            }
            this._validationPopup.close();
        },

        /**
         * Raised by the popup when its positioned. Needed to change the skin of the popup to place the arrow properly.
         * @param {Object} evt
         */
        _onTooltipPositioned : function (evt) {
            var position = evt.position;
            if (position) {
                // state is named after the position, except for topRight where it is named normal
                var state = position.reference.replace(" right", "Right").replace(" left", "Left");
                if (state === 'topRight') {
                    state = 'normal';
                }
                var div = this._div, frame = div._frame;

                // Make sure that the div is initialised (only once),
                // as _onTooltipPositioned can be called several times for the same popup
                div.getDom();
                // this is backward compatibility for skin without errortooltip position states
                if (frame.checkState(state)) {
                    frame.changeState(state);
                }
            }
        },

        /**
         * Raised when the viewport is resized. Needed to fix the position of the popup after the resize.
         * @param {Object} evt
         */
        _onViewportResized : function (evt) {
            // Added for PTR 05374683: popup is misplaced after window resize
            this._closeValidation();
            this._openValidation();
        },

        /**
         * Called when the input field wants to show a validation popup.
         * @param {aria.DomEvent} domEvt
         * @public
         */
        show : function () {
            this._openValidation();
        },

        /**
         * Called when the input field wants to close a validation popup.
         * @param {aria.DomEvent} domEvt
         * @public
         */
        hide : function () {
            this._closeValidation();
        }
    }
});
