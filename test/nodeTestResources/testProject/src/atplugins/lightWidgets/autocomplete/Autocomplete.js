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

(function () {
    var basePackage = "atplugins.lightWidgets";
    var basePath = basePackage + ".";
    var nspace = Aria.nspace(basePackage, true);

    Aria.classDefinition({
        $classpath : "atplugins.lightWidgets.autocomplete.Autocomplete",
        $extends : "atplugins.lightWidgets.textinput.TextInputWithOnChange",
        $dependencies : ["aria.utils.Dom", "aria.utils.Event", "aria.html.controllers.Suggestions",
                "atplugins.lightWidgets.LazyLoader", "atplugins.lightWidgets.autocomplete.AutocompleteCfgBeans", "aria.utils.Json"],
        /**
         * @param {atplugins.lightWidgets.autocomplete.AutocompleteCfgBeans.Properties} cfg
         * @param {aria.templates.TemplateCtxt} ctxt
         * @param {Integer} lineNumber
         */
        $constructor : function (cfg, ctxt, lineNumber) {
            if (!cfg.on) {
                cfg.on = {};
            }

            /**
             * Flag that indicates whether to disable the request of new suggestions
             * @type Boolean
             * @protected
             */
            this._suggestionsOff = false;

            /**
             * Flag that indicates if there is a selection when a keydown event is triggered
             * @type Boolean
             * @protected
             */
            this._caretDifferent = false;

            /**
             * Shortcut for json utility class
             * @type aria.utils.Json
             * @protected
             */
            this._jsonUtils = aria.utils.Json;

            /**
             * Bean against which the configuration has to be validated
             * @type String
             */
            this.$cfgBean = "atplugins.lightWidgets.autocomplete.AutocompleteCfgBeans.Properties";

            cfg.attributes = cfg.attributes || {};
            cfg.attributes.classList = cfg.attributes.classList
                    ? cfg.attributes.classList.concat(cfg.sclass)
                    : [cfg.sclass];
            cfg.attributes.autocomplete = "off";

            this.$TextInputWithOnChange.constructor.call(this, cfg, ctxt, lineNumber);

            /**
             * Key Code typed
             * @type Number
             * @protected
             */
            this._keyCode = null;

            /**
             * Buffer that collect the user's input from keyboard
             * @type String
             * @protected
             */
            this._buffer = "";

            /**
             * Instance of the dropdown that is needed to show suggestions
             * @type atplugins.lightWidgets.autocomplete.AutocompleteDropDown
             * @protected
             */
            this._dropdown = null;

            /**
             * data model that is shared with the dropdown
             * @type Object
             * @protected
             */
            this.data = {};

            var data = this.data;
            if (cfg.preselect == "always") {
                data.preselect = 0;
            } else {
                data.preselect = -1;
            }
            this._resetIdxs();

            data.selectedIdx = null;

            var suggestionController = Aria.getClassInstance("aria.html.controllers.Suggestions");
            suggestionController.setResourcesHandler(cfg.resourcesHandler);

            /**
             * Listener to the change of highlightedIdx
             * @type aria.core.CfgBeans.Callback
             * @protected
             */
            this._highlightedIdxListener = {
                fn : this._onHighlightChange,
                scope : this
            };

            /**
             * Listener to the change of selectedIdx
             * @type aria.core.CfgBeans.Callback
             * @protected
             */
            this._selectedIdxListener = {
                fn : this._onSelectionChange,
                scope : this
            };

            /**
             * Listener to the change of suggestions
             * @type aria.core.CfgBeans.Callback
             * @protected
             */
            this._suggestionListener = {
                fn : this._onSuggestionsChange,
                scope : this
            };

            var jsonUtils = this._jsonUtils;
            jsonUtils.addListener(data, "highlightedIdx", this._highlightedIdxListener);
            jsonUtils.addListener(data, "selectedIdx", this._selectedIdxListener);
            jsonUtils.addListener(suggestionController.data, "suggestions", this._suggestionListener);

            /**
             * Suggestion controller
             * @type aria.html.controllers.Suggestions
             */
            this.suggestionController = suggestionController;

            cfg.suggestionsTemplate = cfg.suggestionsTemplate
                    || suggestionController._resourcesHandler.getDefaultTemplate();

            nspace.LazyLoader.register(this.$classpath, {
                classes : ["atplugins.lightWidgets.autocomplete.AutocompleteDropDown"],
                templates : [cfg.suggestionsTemplate]
            });
        },
        $destructor : function () {
            var jsonUtils = this._jsonUtils, data = this.data;
            if (this._dropdown) {
                if (this._dropdown.isOpen()) {
                    this._dropdown.close();
                } else {
                    this._onDropDownClose();
                }
            }
            jsonUtils.removeListener(data, "highlightedIdx", this._highlightedIdxListener);
            jsonUtils.removeListener(data, "selectedIdx", this._selectedIdxListener);
            jsonUtils.removeListener(this.suggestionController.data, "suggestions", this._suggestionListener);
            this.suggestionController.$dispose();
            this.$TextInputWithOnChange.$destructor.call(this);
        },
        $prototype : {

            /**
             * Initialize the widget
             */
            initWidget : function () {
                this.$TextInputWithOnChange.initWidget.call(this);
                if (!this._cfg.lazy) {
                    nspace.LazyLoader.load(this.$classpath);
                }
            },

            /**
             * Transforms a value from the widget value to the corresponding datamodel value using the specified
             * transform.
             * @protected
             * @param {aria.widgetLibs.CommonBeans.TransformRef} transform Transformation function. Can be undefined if
             * no transformation is to be used or a classpath.
             * @param {Object|Boolean|String|Number} value The widget value to be transformed.
             * @param {String} direction Whether the transform is "fromWidget" or "toWidget
             * @return {Object|Boolean|String|Number} The transformed value. If no transformation is specified, returns
             * the same value as passed in the value parameter.
             */
            _transform : function (transform, value, direction) {
                var transformedValue = null;
                if (direction == "fromWidget") {
                    transformedValue = this._interpret(value);
                    if (transformedValue) {
                        this.onbind("value", transformedValue, value);
                    }
                    return this.$TextInputWithOnChange._transform.call(this, transform, transformedValue, direction);
                } else {
                    if (!value) {
                        return "";
                    }
                    if (value != null && typeof value === "object") {
                        value = (value != null) ? this._getLabelFromSuggestion(value) : "";
                    }
                    transformedValue = this.$TextInputWithOnChange._transform.call(this, transform, value, direction);
                    return value;
                }
            },

            /**
             * Returns the suggestion object or the freetext inserted
             * @param {Object|Boolean|String|Number} value
             * @return {String|Object|Number}
             */
            _interpret : function (value) {
                var valInterpreted = null, selectedIdx = this.data.selectedIdx, highlightedIdx = this.data.highlightedIdx;
                var suggestions = this.suggestionController.data.suggestions;
                var bindingListeners = this._bindingListeners, bind, dmValue;

                if (bindingListeners && bindingListeners.value) {
                    bind = bindingListeners.value;
                    dmValue = bind.inside[bind.to];
                }
                if (this._keyCode == aria.DomEvent.KC_ESCAPE) {
                    valInterpreted = this._buffer;
                } else if ((selectedIdx || selectedIdx === 0) && selectedIdx >= 0) {
                    valInterpreted = suggestions[selectedIdx];
                } else if (suggestions && suggestions.length > 0 && highlightedIdx >= 0) {
                    valInterpreted = suggestions[highlightedIdx];
                } else if (dmValue && typeof dmValue === "object" && this._getLabelFromSuggestion(dmValue) == value) {
                    valInterpreted = dmValue;
                } else {
                    valInterpreted = value;
                }

                return valInterpreted;
            },

            /**
             * Called when the data model changes
             * @param {String} name Name of the bound property
             * @param {Object} value Selected item from suggestions
             * @param {Object} oldValue Previously selected item from suggestions
             */
            onbind : function (name, value, oldValue) {
                if (value != null && typeof value === "object") {
                    value = (value != null) ? this._getLabelFromSuggestion(value) : "";
                }
                this.$TextInputWithOnChange.onbind.call(this, name, value, oldValue);
            },

            /**
             * Called when the highlighted index changes
             * @param {Object} change Contains oldValue and newValue
             * @protected
             */
            _onHighlightChange : function (change) {
                var newIdx = change.newValue;
                if (newIdx >= 0) {
                    var text = this.data.items[newIdx].label;
                    this._domElt.value = text;
                }
            },

            /**
             * Called when the selected index changes
             * @param {Object} change Contains oldValue and newValue
             * @protected
             */
            _onSelectionChange : function (change) {
                this._suggestionsOff = true;
                var newIdx = change.newValue;
                if (newIdx >= 0) {
                    var text = this.data.items[newIdx].label;
                    this._domElt.value = text;
                }
            },

            /**
             * Called on keydown
             * @param {aria.templates.DomEventWrapper} evt
             * @return {Boolean}
             * @protected
             */
            _onkeydown : function (evt) {
                this._keyCode = evt.keyCode;
                var keyCode = this._keyCode;
                var domEvent = aria.DomEvent, jsonUtils = this._jsonUtils, data = this.data;
                var isDropDownOpen = this._dropdown && this._dropdown.isOpen();

                if ((keyCode != domEvent.KC_UP) && (keyCode != domEvent.KC_DOWN || !isDropDownOpen)
                        && (keyCode != domEvent.KC_ESCAPE)) {
                    this._buffer = this._domElt.value;
                    this._suggestionsOff = false;
                    var caret = aria.utils.Caret.getPosition(this._domElt);
                    this._caretDifferent = caret.start != caret.end;
                }

                if (keyCode == domEvent.KC_DOWN) {
                    evt.preventDefault();
                    if (isDropDownOpen) {
                        this._suggestionsOff = true;
                        var itemHighlighted = data.highlightedIdx;
                        var border = data.items.length - 1;

                        if (itemHighlighted != null && itemHighlighted >= 0 && itemHighlighted < border) {
                            data.oldHighlightedIdx = itemHighlighted;
                            jsonUtils.setValue(data, "highlightedIdx", itemHighlighted + 1);
                        } else if (itemHighlighted == -1) {
                            data.oldHighlightedIdx = 0;
                            jsonUtils.setValue(data, "highlightedIdx", 0);
                        }
                    } else {
                        this.data.textValue = this._buffer;
                        this.suggestionController.suggestValue(this._buffer);
                    }
                } else if (keyCode == domEvent.KC_UP) {
                    evt.preventDefault();
                    if (isDropDownOpen) {
                        this._suggestionsOff = true;
                        var itemHighlighted = data.highlightedIdx;

                        if (itemHighlighted > 0) {
                            data.oldHighlightedIdx = itemHighlighted;
                            jsonUtils.setValue(data, "highlightedIdx", itemHighlighted - 1);
                        }
                    }
                } else if (keyCode == domEvent.KC_ENTER || keyCode == domEvent.KC_TAB) {
                    if (isDropDownOpen) {
                        if (data.highlightedIdx >= 0) {
                            jsonUtils.setValue(data, "selectedIdx", data.highlightedIdx);
                        }
                        this._reportValueToDataModel();
                        this._dropdown.close();
                        if (keyCode == domEvent.KC_ENTER) {
                            evt.preventDefault();
                        }
                    } else if (keyCode == domEvent.KC_ENTER) {
                        this._reportValueToDataModel();
                    }
                } else if (keyCode == domEvent.KC_ESCAPE) {
                    if (isDropDownOpen) {
                        this._dropdown.close();
                        jsonUtils.setValue(data, "selectedIdx", -1);
                        jsonUtils.setValue(data, "highlightedIdx", -1);
                        this._reportValueToDataModel();
                    }
                }
                return true;
            },

            /**
             * Copies the actual value of the input field to the data model
             * @protected
             */
            _reportValueToDataModel : function () {
                var bindingListeners = this._bindingListeners, bind;
                var val = this._transform(undefined, this._domElt.value, "fromWidget");
                if (bindingListeners && bindingListeners.value) {
                    bind = bindingListeners.value;
                    this._jsonUtils.setValue(bind.inside, bind.to, val, bind.cb);
                }
            },

            /**
             * Called on type
             * @protected
             */
            _ontype : function () {
                var elementValue = this._domElt.value;
                var domEvent = aria.DomEvent;
                var browser = aria.core.Browser;

                if ((!this._suggestionsOff && (this._keyCode != domEvent.KC_ESCAPE)
                        && (this._keyCode != domEvent.KC_TAB) && (elementValue != this._buffer || this._caretDifferent))
                        || (browser.isAndroid && browser.isChrome)) {
                    this.data.textValue = elementValue;
                    this.suggestionController.suggestValue(elementValue);
                    this._buffer = elementValue;
                }
            },

            /**
             * Called on paste and cut
             * @protected
             */
            _onCutOrPaste : function (evt) {
                if (evt.keyCode === 0) {
                    this._onkeydown({
                        keyCode : 0
                    });
                    aria.core.Timer.addCallback({
                        fn : this._ontype,
                        scope : this,
                        delay : 10
                    });

                }
            },

            /**
             * React to a change of suggestions
             * @protected
             */
            _onSuggestionsChange : function () {
                if (!nspace.LazyLoader.isLoaded(this.$classpath)) {
                    nspace.LazyLoader.load(this.$classpath, {
                        fn : this._onSuggestionsChange,
                        scope : this
                    });
                } else {
                    var suggestions = this.suggestionController.data.suggestions;
                    if (!this._dropdown) {
                        this._dropdown = new nspace.autocomplete.AutocompleteDropDown(this._getDropDownConfig());
                    }
                    var dropdown = this._dropdown;
                    if (suggestions && suggestions.length !== 0) {
                        if (!dropdown.isOpen()) {
                            this._resetIdxs();
                            dropdown.open();
                        } else {
                            dropdown.refresh();
                        }
                    } else {
                        if (dropdown.isOpen()) {
                            dropdown.close();
                        }
                    }
                }

            },

            /**
             * Build the configuration of the dropdown
             * @return {atplugins.lightWidgets.DropDownCfgBeans.Configuration}
             * @protected
             */
            _getDropDownConfig : function () {
                return {
                    data : this.data,
                    context : this._context,
                    controller : this.suggestionController,
                    template : this._cfg.suggestionsTemplate,
                    domReference : this._domElt,
                    lineNumber : this._lineNumber,
                    onAfterClose : {
                        fn : this._onDropDownClose,
                        scope : this
                    },
                    sclass : this._cfg.sclass || "std"
                };
            },

            /**
             * Add listeners to the element
             * @param {atplugins.lightWidgets.autocomplete.AutocompleteCfgBeans.Properties} cfg
             * @protected
             */
            _registerListeners : function (cfg) {
                this.$TextInputWithOnChange._registerListeners.call(this, cfg);
                var listeners = cfg.on;

                var events = ["keydown", "paste", "cut", "type"];
                var handlers = ["_onkeydown", "_onCutOrPaste", "_onCutOrPaste", "_ontype"];
                for (var i = 0, length = events.length; i < length; i++) {
                    var event = events[i];

                    this._chainListener(listeners, event, {
                        fn : this[handlers[i]],
                        scope : this
                    });
                }
            },

            /**
             * Get the label from a suggestion
             * @param {Object} value Suggestion
             * @return {String} label
             * @protected
             */
            _getLabelFromSuggestion : function (value) {
                return this.suggestionController._resourcesHandler.suggestionToLabel(value);
            },

            /**
             * Listener called after the dropdown is closed
             * @protected
             */
            _onDropDownClose : function () {
                this._dropdown.$dispose();
                this._dropdown = null;
            },

            /**
             * Resets the idexes for the item selected and the item highlighted
             * @protected
             */
            _resetIdxs : function () {
                var data = this.data;
                data.selectedIdx = null;
                delete data.oldHighlightedIdx;
                if (data.preselect === 0) {
                    data.highlightedIdx = 0;
                } else if (data.preselect == -1) {
                    data.highlightedIdx = -1;
                }
            }

        }
    });

})();