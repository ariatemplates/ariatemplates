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

var ariaCoreBrowser = require("../../core/Browser");
var ariaUtilsArray = require("../../utils/Array");
var ariaUtilsString = require("../../utils/String");
var subst = ariaUtilsString.substitute;
var ariaUtilsDom = require("../../utils/Dom");

var ariaWidgetsFramesFrameFactory = require("../frames/FrameFactory");
var ariaWidgetsContainerTabStyle = require("./TabStyle.tpl.css");
var ariaWidgetsContainerContainer = require("./Container");
var ariaTemplatesNavigationManager = require("../../templates/NavigationManager");


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

        if (cfg.waiAria) {
            this._customTabIndexProvided = true;
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

        _getWaiAriaElement : function () {
            return ariaUtilsDom.getElementById(this._waiElementId);
        },

        _getWaiAriaAttributesMarkup: function () {
            // --------------------------------------------------- destructuring

            var cfg = this._cfg;

            var tabIndex = cfg.tabIndex;
            var disabled = cfg.disabled;
            var waiHidden = cfg.waiHidden;
            var waiLabel = cfg.waiLabel;
            var waiLabelledBy = cfg.waiLabelledBy;
            var waiDescribedBy = cfg.waiDescribedBy;

            var bind = cfg.bind;
            var tabId = cfg.tabId;

            // ------------------------------------------------------ processing

            var waiAttributes = [];

            waiAttributes.push(['class', 'xTabLink']);
            waiAttributes.push(['href', 'javascript:(function(){})()']);

            if (disabled) {
                waiAttributes.push(['tabindex', '-1']);
            } else if (tabIndex != null) {
                waiAttributes.push(['tabindex', this._calculateTabIndex()]);
            }

            // Blind users do not like the "tab" role because, just as the "application" role,
            // it prevents them from using their navigation shortcuts:
            // waiAttributes.push(['role', 'tab']);

            if (waiHidden) {
                waiAttributes.push(['aria-hidden', 'true']);
            }

            if (waiLabel) {
                waiAttributes.push(['aria-label', waiLabel]);
            }

            if (waiLabelledBy) {
                waiAttributes.push(['aria-labelledby', waiLabelledBy]);
            }

            if (waiDescribedBy) {
                waiAttributes.push(['aria-describedby', waiDescribedBy]);
            }

            if (bind != null) {
                var binding = bind.selectedTab;

                if (binding != null) {
                    var inside = binding.inside;
                    var to = binding.to;

                    var selected = inside[to] === tabId;
                    var value = selected ? 'true' : 'false';

                    waiAttributes.push(['aria-selected', value]);
                    waiAttributes.push(['aria-expanded', value]);
                }
            }

            var value = disabled ? 'true' : 'false';
            waiAttributes.push(['aria-disabled', value]);

            this._updateLabelId();

            var id = this._getControlledTabPanelId();
            if (id != null) {
                waiAttributes.push(['aria-controls', id]);
            }

            // ---------------------------------------------------------- return

            waiAttributes = ariaUtilsArray.map(waiAttributes, function (attribute) {
                return subst('%1="%2"', attribute[0], attribute[1]);
            });

            return ariaUtilsString.wrap(waiAttributes.join(' '), ' ');
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

            return subst('aria:%1_%2', configurationOfCommonBinding.to, name);
        },



        ////////////////////////////////////////////////////////////////////////
        // TabPanel label id management (from Tab to TabPanel)
        ////////////////////////////////////////////////////////////////////////

        _getLabelIdPropertyName : function (cfg) {
            return this._getCommonBindingMetaDataPropertyName('labelId', cfg);
        },

        _updateLabelId : function (selectedTab) {
            // --------------------------------------------------- destructuring

            var id = this._waiElementId;
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

            var element = this._getWaiAriaElement();
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
                var eltToFocus = this._cfg.waiAria ? this._getWaiAriaElement() : this.getDom();
                eltToFocus.focus();
            } catch (ex) {
                // FIXME: fix for IE7, investigate why it may fail, actually, why should this work???
            }
        },

        focus : function () {
            this._focus();
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
                    var element = this._getWaiAriaElement();
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
            // --------------------------------------------------- destructuring

            var cfg = this._cfg;

            var waiAria = cfg.waiAria;
            var waiTitleTag = cfg.waiTitleTag;

            // ------------------------------------------------------ processing

            this._frame.writeMarkupBegin(out);

            if (waiAria) {
                var waiElementId = this._createDynamicId();
                this._waiElementId = waiElementId;

                if (waiTitleTag) {
                    out.write('<' + waiTitleTag + '>');
                }
                out.write('<a id="' + waiElementId + '" ' + this._getWaiAriaAttributesMarkup() + '>');
            }
        },

        /**
         * Internal function to generate the internal widget markup
         * @param {aria.templates.MarkupWriter} out
         * @protected
         */
        _widgetMarkupEnd : function (out) {
            // --------------------------------------------------- destructuring

            var cfg = this._cfg;

            var waiAria = cfg.waiAria;
            var waiTitleTag = cfg.waiTitleTag;

            // ------------------------------------------------------ processing

            if (waiAria) {
                out.write('</a>');
                if (waiTitleTag) {
                    out.write('</' + waiTitleTag + '>');
                }
            }

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
            if (this._cfg.waiAria) {
                // Focusing the Tab before focusing the TabPanel is not enough to make the screen reader read the tab's title first
                // A sufficient timeout would be necessary, but we can't program that way safely
                // this._focus();
                var controlledTabPanelId = this._getControlledTabPanelId();
                if (controlledTabPanelId != null) {
                    var tabPanelElement = ariaUtilsDom.getElementById(controlledTabPanelId);
                    ariaTemplatesNavigationManager.focusFirst(tabPanelElement);
                }
            }
        },

        /**
         * Internal method to handle the mouse down event
         * @param {aria.DomEvent} domEvt
         * @protected
         */
        _dom_onmousedown : ariaCoreBrowser.isIE ? function (domEvt) {
            var target = domEvt.target;
            if (!ariaTemplatesNavigationManager.canBeFocused(target)) {
                // prevent IE from focusing any element
                domEvt.preventDefault();
            }
        } : Aria.empty,

        /**
         * The method called when the markup is clicked
         * @param {aria.DomEvent} domEvt
         * @protected
         */
        _dom_onclick : function (domEvt) {
            this._selectTab();
            if (this._cfg) {
                if (this._cfg.waiAria) {
                    domEvt.preventDefault();
                }
            }
        },

        /**
         * Internal method to handle the mouse enter event
         * @protected
         * @param {aria.DomEvent} domEvt
         */
        _dom_onmouseenter : function (domEvt) {
            this.$Container._dom_onmouseenter.call(this, domEvt);
            this._mouseOver = true;
            this._updateState();

        },

        /**
         * Internal method to handle the mouse leave event
         * @protected
         * @param {aria.DomEvent} domEvt
         */
        _dom_onmouseleave : function (domEvt) {
            this.$Container._dom_onmouseleave.call(this, domEvt);
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
        },

        /**
         * Delegate an incoming event
         * @param {aria.DomEvent} evt
         * @return {Boolean} event bubbles ?
         * @override
         */
        delegate : function (evt) {
            var evtType = evt.type;
            if (this._cfg.disabled && this._cfg.waiAria && (evtType === "mousedown" || evtType === "click")) {
                // When the tab is disabled it is necessary to prevent the default action when clicking on the link
                // both to prevent the focus (on mousedown) and the navigation (on click)
                evt.target.unselectable = true; // for old IE versions for which preventDefault on mousedown does not prevent the focus
                evt.preventDefault();
            }
            return this.$Container.delegate.apply(this, arguments);
        }

    }
});
