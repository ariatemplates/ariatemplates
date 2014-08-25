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
var ariaWidgetsFormDropDownListTrait = require("./DropDownListTrait");
var ariaWidgetsControllersAutoCompleteController = require("../controllers/AutoCompleteController");
var ariaUtilsEvent = require("../../utils/Event");
var ariaWidgetsFormAutoCompleteStyle = require("./AutoCompleteStyle.tpl.css");
var ariaWidgetsFormListListStyle = require("./list/ListStyle.tpl.css");
var ariaWidgetsContainerDivStyle = require("../container/DivStyle.tpl.css");
var ariaWidgetsFormDropDownTextInput = require("./DropDownTextInput");
var ariaCoreBrowser = require("../../core/Browser");


/**
 * AutoComplete widget
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.form.AutoComplete",
    $extends : ariaWidgetsFormDropDownTextInput,
    $css : [ariaWidgetsFormAutoCompleteStyle, ariaWidgetsFormListListStyle,
            ariaWidgetsContainerDivStyle],
    /**
     * AutoComplete constructor
     * @param {aria.widgets.CfgBeans:AutoCompleteCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     * @param {Number} lineNumber Line number corresponding in the .tpl file where the widget is created
     * @param {Number} controller the data controller object
     */
    $constructor : function (cfg, ctxt, lineNumber, controller) {
        var controllerInstance = controller || new ariaWidgetsControllersAutoCompleteController();

        if (!cfg.expandButton && cfg.bind) {
            delete cfg.bind.popupOpen;
        }

        this.$DropDownTextInput.constructor.call(this, cfg, ctxt, lineNumber, controllerInstance);

        if (!cfg.expandButton) {
            /**
             * Array of icon names which need to be hidden.
             * @type Array
             * @protected
             * @override
             */
            this._hideIconNames = ["dropdown"];
        }

        try {
            controllerInstance.setResourcesHandler(cfg.resourcesHandler);
        } catch (e) {
            this.$logError(this.WIDGET_AUTOCOMPLETE_INVALID_HANDLER, [cfg.resourcesHandler], e);
        }
        controllerInstance.autoFill = cfg.autoFill;
        controllerInstance.freeText = cfg.freeText;
        controllerInstance.maxlength = cfg.maxlength;
        controllerInstance.expandButton = cfg.expandButton;
        controllerInstance.selectionKeys = cfg.selectionKeys;
        controllerInstance.preselect = cfg.preselect;

        /**
         * Whether the width of the popup can be smaller than the field, when configured to be so. If false, the
         * popupWidth property will be overridden when it is smaller than the field width
         * @type Boolean
         * @protected
         */
        this._freePopupWidth = false;
    },
    $destructor : function () {
        // The dropdown might still be open when we destroy the widget, destroy it now
        if (this._dropdownPopup) {
            this._dropdownPopup.$removeListeners({
                "onBeforeClose" : this._beforeDropdownClose,
                scope : this
            });
        }

        // There might be some events
        if (this._initDone) {
            this._removeEvents();
        }

        this.$DropDownTextInput.$destructor.call(this);
    },
    $statics : {
        // ERROR MESSAGE:
        WIDGET_AUTOCOMPLETE_INVALID_HANDLER : "%1Could not create resources handler %2: dependency on this handler is missing."
    },
    $prototype : {
        /**
         * Skinnable class to use for this widget.
         * @protected
         * @type String
         */
        _skinnableClass : "AutoComplete",

        /**
         * Prototype init method called at prototype creation time Allows to store class-level objects that are shared
         * by all instances
         * @param {Object} p the prototype object being built
         */
        $init : function (p) {
            var src = ariaWidgetsFormDropDownListTrait.prototype;
            for (var key in src) {
                if (src.hasOwnProperty(key) && !p.hasOwnProperty(key)) {
                    // copy methods which are not already on this object (this avoids copying $classpath and
                    // $destructor)
                    p[key] = src[key];
                }
            }
        },

        /**
         * Internal function to render the content of the dropdown div
         * @protected
         * @param {aria.templates.MarkupWriter} out Markup writer which should receive the content of the popup.
         * @param {Object} arg Optional parameters
         */
        _renderDropdownContent : function (out, options) {
            options = options || {};
            if (!("defaultTemplate" in options)) {
                var cfg = this._cfg;
                if (cfg.suggestionsTemplate) {
                    options.defaultTemplate = cfg.suggestionsTemplate;
                } else {
                    options.defaultTemplate = this.controller.getDefaultTemplate();
                }
            }
            if (!("minWidth" in options)) {
                var inputMarkupWidth = this._inputMarkupWidth;
                // set a minimum size for the autocomplete content
                inputMarkupWidth = (inputMarkupWidth < 150) ? 150 : inputMarkupWidth;
                options.minWidth = inputMarkupWidth + this._skinObj.offsetRight;
            }
            options.maxHeight = this._cfg.popupMaxHeight || 210;
            this.$DropDownListTrait._renderDropdownContent.call(this, out, options);
        },

        /**
         * Override $DropDownTextInput._reactToControllerReport
         * @protected
         * @param {aria.widgets.controllers.reports.DropDownControllerReport} report
         * @param {Object} arg Optional parameters
         */
        _reactToControllerReport : function (report, arg) {
            // To reset focus if there is no suggestion dropdown
            if (!this.controller._resetFocus) {
                this._keepFocus = false;
            }
            this.$DropDownTextInput._reactToControllerReport.call(this, report, arg);

        },

        /**
         * React to a dropdown close. If the widget is using autofill we want to select the pre-selected value in the
         * datamodel and report it to the input field also when the user clicks away from the field instead of
         * navigating through TAB or selecting an item from the dropdown. This function is called any time we close the
         * dropdown, even when typing there are no results.
         * @param {Object} event Event that triggered this callback
         * @private
         */
        _beforeDropdownClose : function (event) {
            if (this._cfg.autoFill && event.domEvent) {
                // Closing the dropdown after typing is not a domEvent
                var report = this.controller.checkDropdownValue(this.controller.getDataModel().value);
                this._reactToControllerReport(report);
            }
        },

        /**
         * Override _init function to add event listeners that cannot be delegated on IE
         * @method
         * @override
         */
        _init : ariaCoreBrowser.isOldIE ? function () {
            this.$DropDownTextInput._init.call(this);

            var field = this.getTextInputField();
            ariaUtilsEvent.addListener(field, "paste", {
                fn : this._dom_onpaste,
                scope : this
            });
            ariaUtilsEvent.addListener(field, "cut", {
                fn : this._dom_oncut,
                scope : this
            });
        } : function () {
            this.$DropDownTextInput._init.call(this);
        },

        /**
         * Remove event listeners added during init. This is done for IE in order to support copy/paste
         * @method
         * @protected
         */
        _removeEvents : ariaCoreBrowser.isOldIE ? function () {
            var field = this.getTextInputField();
            ariaUtilsEvent.removeListener(field, "paste");
            ariaUtilsEvent.removeListener(field, "cut");
        } : function () {},

        /**
         * Internal method to handle the paste event. This event is converted as a Ctrl+v and handled as a keydown in
         * order to set the datamodel and open the dropdown
         * @param {aria.DomEvent} event Event object
         * @protected
         */
        _dom_onpaste : function (event) {
            this.__propagateKeyDown(event);
        },

        /**
         * Internal method to handle the cut event. This event is converted as a Ctrl+x and handled as a keydown in
         * order to set the datamodel and close the dropdown.
         * @param {aria.DomEvent} event Event object
         * @protected
         */
        _dom_oncut : function (event) {
            this.__propagateKeyDown(event);
        },

        /**
         * Convert mouse event and browser copy/paste (contextual menu event) into a keydown event that can be handled
         * by the controller
         * @param {aria.DomEvent} event Event object, in IE this is an instance of HTMLElement
         * @private
         */
        __propagateKeyDown : function (event) {
            var toBeDisposed = false;
            if (!event.$DomEvent) {
                event = new aria.DomEvent(event);
                toBeDisposed = true;
            }

            event.isSpecialKey = true;
            event.ctrlKey = true;
            event.charCode = 0;

            this._dom_onkeydown.call(this, event);

            if (toBeDisposed) {
                event.$dispose();
            }
        },
        /**
         * Internal method called when one of the model property that the widget is bound to has changed Must be
         * overridden by sub-classes defining bindable properties
         * @param {String} propertyName the property name
         * @param {Object} newValue the new value
         * @param {Object} oldValue the old property value
         * @protected
         */
        _onBoundPropertyChange : function (propertyName, newValue, oldValue) {
            if (propertyName != "popupOpen" || this._cfg.expandButton) {
                this.$DropDownTextInput._onBoundPropertyChange.apply(this, arguments);
            }
        },
        /**
         * Initialization method called by the delegate engine when the DOM is loaded
         */
        initWidget : function () {
            if (!this._cfg.expandButton && this._cfg.popupOpen) {
                this._cfg.popupOpen = false;
            }
            this.$DropDownTextInput.initWidget.call(this);
        }
    }
});
