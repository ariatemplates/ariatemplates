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

var ariaUtilsArray = require("../../utils/Array");

var ariaWidgetsFramesFrameFactory = require("../frames/FrameFactory");
var ariaWidgetsContainerTabStyle = require("./TabStyle.tpl.css");
var ariaWidgetsContainerContainer = require("./Container");


/**
 * Tab widget
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.container.Tab",
    $extends : ariaWidgetsContainerContainer,
    $css : [ariaWidgetsContainerTabStyle],

    /**
     * Tab constructor
     * @param {aria.widgets.CfgBeans:TabCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     */
    $constructor : function (cfg, ctxt) {
        // ---------------------------------------------------------------------

        var configurationOfCommonBinding = this._getConfigurationOfCommonBinding(cfg);

        if (configurationOfCommonBinding != null) {
            var bind = cfg.bind;
            var inside = configurationOfCommonBinding.inside;

            bind.controlledTabPanelId = {
                inside: inside,
                to: this._getControlledTabPanelIdPropertyName(cfg)
            };

            bind.labelId = {
                inside: inside,
                to: this._getLabelIdPropertyName(cfg)
            };
        }

        // ---------------------------------------------------------------------

        this.$Container.constructor.apply(this, arguments);
        this._setSkinObj(this._skinnableClass);

        /**
         * Whether the mouse is over the Tab or not
         * @type Boolean
         * @protected
         */
        this._mouseOver = false;

        /**
         * Whether the Tab is focused or not
         * @type Boolean
         * @protected
         */
        this._hasFocus = false;

        this._updateState(true);

        /**
         * Frame instance. Actual instance depends on the skin
         * @type aria.widgets.frames.Frame
         * @protected
         */
        this._frame = ariaWidgetsFramesFrameFactory.createFrame({
            height : cfg.height,
            state : this._state,
            width : cfg.width,
            sclass : cfg.sclass,
            skinnableClass : this._skinnableClass,
            printOptions : cfg.printOptions,
            id : Aria.testMode ? this._domId + "_" + cfg.tabId : undefined
        });

        /**
         * Override default widget's span style
         * @type String
         * @protected
         * @override
         */
        this._spanStyle = "z-index:100;vertical-align:top;";

        // ---------------------------------------------------------------------

        var extraAttributes = [];

        if (cfg.waiAria) {
            extraAttributes.push(['role', 'tab']);

            var bind = cfg.bind;
            if (bind != null) {
                var binding = bind.selectedTab;

                if (binding != null) {
                    var inside = binding.inside;
                    var to = binding.to;

                    var selected = inside[to] === cfg.tabId;
                    var value = selected ? 'true' : 'false';

                    extraAttributes.push(['aria-selected', value]);
                    extraAttributes.push(['aria-expanded', value]);
                }
            }

            var value = cfg.disabled ? 'true' : 'false';
            extraAttributes.push(['aria-disabled', value]);

            this._updateLabelId();

            var id = this._getControlledTabPanelId();
            if (id != null) {
                extraAttributes.push(['aria-controls', id]);
            }
        }

        var _extraAttributes = '';
        ariaUtilsArray.forEach(extraAttributes, function (attribute) {
            var key = attribute[0];
            var value = attribute[1];

            _extraAttributes += ' ' + key + '="' + value + '"';
        });
        _extraAttributes += ' ';
        this._extraAttributes = _extraAttributes;
    },

    $destructor : function () {
        if (this._frame) {
            this._frame.$dispose();
            this._frame = null;
        }

        this.$Container.$destructor.call(this);
    },

    $prototype : {
        /**
         * Skinnable class to use for this widget.
         * @protected
         * @type String
         */
        _skinnableClass : "Tab",

        /**
         * Called when a new instance is initialized
         * @protected
         */
        _init : function () {
            var domElt = this.getDom();
            var actingDom = aria.utils.Dom.getDomElementChild(domElt, 0);

            if (actingDom) {
                this._frame.linkToDom(actingDom);
            }

            aria.widgets.container.Tab.superclass._init.call(this);
        },



        ////////////////////////////////////////////////////////////////////////
        // Tab & TabPanel communication
        ////////////////////////////////////////////////////////////////////////

        _getConfigurationOfCommonBinding : function (cfg) {
            if (cfg == null) {
                cfg = this._cfg;
            }

            var bind = cfg.bind;

            if (bind == null) {
                return null;
            }

            return bind.selectedTab;
        },

        _getCommonBindingMetaDataPropertyName : function (name, cfg) {
            var configurationOfCommonBinding = this._getConfigurationOfCommonBinding(cfg);

            if (configurationOfCommonBinding == null) {
                return null;
            }

            var to = configurationOfCommonBinding.to;
            return 'aria:' + to + '_' + name;
        },



        ////////////////////////////////////////////////////////////////////////
        // TabPanel label id management (from Tab to TabPanel)
        ////////////////////////////////////////////////////////////////////////

        _getLabelIdPropertyName : function (cfg) {
            return this._getCommonBindingMetaDataPropertyName('labelId', cfg);
        },

        _updateLabelId : function (selectedTab) {
            // --------------------------------------------------- destructuring

            var id = this._domId;
            var cfg = this._cfg;

            var tabId = cfg.tabId;

            // ---------------------------------------------------- facilitation

            if (selectedTab == null) {
                var binding = this._getConfigurationOfCommonBinding();

                if (binding == null) {
                    return null;
                }

                selectedTab = binding.inside[binding.to];
            }

            // ------------------------------------------------------ processing

            if (!selectedTab) {
                this.changeProperty('labelId', null);
            } else {
                var isSelected = selectedTab === tabId;

                if (isSelected) {
                    this.changeProperty('labelId', id);
                }
            }
        },



        ////////////////////////////////////////////////////////////////////////
        // Tab controls id management (from TabPanel to Tab)
        ////////////////////////////////////////////////////////////////////////

        _getControlledTabPanelIdPropertyName : function (cfg) {
            return this._getCommonBindingMetaDataPropertyName('controlledTabPanelId', cfg);
        },

        _getControlledTabPanelId : function () {
            var configurationOfCommonBinding = this._getConfigurationOfCommonBinding();

            if (configurationOfCommonBinding == null) {
                return null;
            }

            var inside = configurationOfCommonBinding.inside;
            var property = this._getControlledTabPanelIdPropertyName();

            return inside[property];
        },

        _reactToControlledTabPanelIdChange : function (id) {
            if (!this._cfg.waiAria) {
                return;
            }

            var attributeName = 'aria-controls';

            var element = this.getDom();
            if (!id) {
                element.removeAttribute(attributeName);
            } else {
                element.setAttribute(attributeName, id);
            }
        },



        ////////////////////////////////////////////////////////////////////////
        //
        ////////////////////////////////////////////////////////////////////////

        /**
         * Give focus to the element representing the focus for this widget
         */
        _focus : function () {
            try {
                this.getDom().focus();
            } catch (ex) {
                // FIXME: fix for IE7, investigate why it may fail, actually, why should this work???
            }
        },

        /**
         * Internal method called when one of the model properties that the widget is bound to has changed Must be
         * overridden by sub-classes defining bindable properties
         * @param {String} propertyName the property name
         * @param {Object} newValue the new value
         * @param {Object} oldValue the old property value
         * @protected
         */
        _onBoundPropertyChange : function (propertyName, newValue, oldValue) {
            // --------------------------------------------------- destructuring

            var element = this.getDom();

            var cfg = this._cfg;
            var tabId = cfg.tabId;
            var waiAria = cfg.waiAria;

            // ------------------------------------------------------ processing

            var changedState = false;
            if (propertyName === "selectedTab") {
                var isSelected = newValue === tabId;
                var wasSelected = oldValue === tabId;

                if (isSelected || wasSelected) {
                    changedState = true;
                }
            } else if (propertyName === 'controlledTabPanelId') {
                this._reactToControlledTabPanelIdChange(newValue);
            } else {
                this.$Container._onBoundPropertyChange.call(this, propertyName, newValue, oldValue);
            }

            if (changedState) {
                cfg[propertyName] = newValue;
                this._updateState();

                if (waiAria) {
                    var value = isSelected ? 'true' : 'false';
                    element.setAttribute('aria-selected', value);
                    element.setAttribute('aria-expanded', value);
                }
            }

            this._updateLabelId(newValue);
        },



        ////////////////////////////////////////////////////////////////////////
        //
        ////////////////////////////////////////////////////////////////////////

        /**
         * Internal function to generate the internal widget markup
         * @param {aria.templates.MarkupWriter} out
         * @protected
         */
        _widgetMarkupBegin : function (out) {
            this._frame.writeMarkupBegin(out);
        },

        /**
         * Internal function to generate the internal widget markup
         * @param {aria.templates.MarkupWriter} out
         * @protected
         */
        _widgetMarkupEnd : function (out) {
            this._frame.writeMarkupEnd(out);
        },

        /**
         * A private method to set this objects skin object
         * @param {String} widgetName
         * @protected
         */
        _setSkinObj : function (widgetName) {
            this._skinObj = aria.widgets.AriaSkinInterface.getSkinObject(widgetName, this._cfg.sclass);
        },

        /**
         * Internal method to update the state of the tab, from the config and the mouse over variable
         * @param {Boolean} skipChangeState - If true we don't update the state in the frame as the frame may not be
         * initialized
         * @protected
         */
        _updateState : function (skipChangeState) {
            var state = "normal";
            var cfg = this._cfg;

            if (cfg.disabled) {
                state = "disabled";
            } else if (cfg.tabId === cfg.selectedTab) {
                state = "selected";
            } else {
                if (this._mouseOver) {
                    state = "msover";
                }
            }

            if (this._hasFocus) {
                state += "Focused";
            }
            this._state = state;

            if (!skipChangeState) {
                // force widget - DOM mapping
                this.getDom();
                this._frame.changeState(this._state);
            }
        },

        /**
         * Set the current tab as selected
         * @protected
         */
        _selectTab : function () {
            this.changeProperty("selectedTab", this._cfg.tabId);
        },

        /**
         * The method called when the markup is clicked
         * @param {aria.DomEvent} domEvt
         * @protected
         */
        _dom_onclick : function (domEvt) {
            this._selectTab();
            if (this._cfg && !this._hasFocus) {
                this._focus();
            }
        },

        /**
         * Internal method to handle the mouse over event
         * @protected
         * @param {aria.DomEvent} domEvt
         */
        _dom_onmouseover : function (domEvt) {
            this.$Container._dom_onmouseover.call(this, domEvt);
            this._mouseOver = true;
            this._updateState();

        },

        /**
         * Internal method to handle the mouse out event
         * @protected
         * @param {aria.DomEvent} domEvt
         */
        _dom_onmouseout : function (domEvt) {
            this.$Container._dom_onmouseout.call(this, domEvt);
            this._mouseOver = false;
            this._updateState();

        },

        /**
         * Internal method to handle focus event
         * @protected
         * @param {aria.DomEvent} domEvt
         */
        _dom_onfocus : function (domEvt) {
            this._hasFocus = true;
            this._updateState();
        },

        /**
         * Internal method to handle blur event
         * @protected
         * @param {aria.DomEvent} domEvt
         */
        _dom_onblur : function (domEvt) {
            this._hasFocus = false;
            this._updateState();
        },

        /**
         * Internal method to handle keyboard event
         * @protected
         * @param {aria.DomEvent} domEvt
         */
        _dom_onkeyup : function (domEvt) {
            return false;
        },

        /**
         * @protected
         * @param {aria.DomEvent} domEvt
         */
        _dom_onkeydown : function (domEvt) {
            if (domEvt.keyCode == aria.DomEvent.KC_SPACE || domEvt.keyCode == aria.DomEvent.KC_ENTER) {
                this._selectTab();
                domEvt.preventDefault();
            }
        }

    }
});
