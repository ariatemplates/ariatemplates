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
var ariaWidgetsIcon = require("../Icon");
var ariaUtilsEllipsis = require("../../utils/Ellipsis");
var ariaUtilsDom = require("../../utils/Dom");
var ariaUtilsString = require("../../utils/String");
var ariaUtilsType = require("../../utils/Type");
var ariaWidgetsActionSortIndicatorStyle = require("./SortIndicatorStyle.tpl.css");
var ariaWidgetsActionActionWidget = require("./ActionWidget");
var ariaCoreBrowser = require("../../core/Browser");


/**
 * Sort Indicator widget
 * @class aria.widgets.action.SortIndicator
 * @extends aria.widgets.action.ActionWidget
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.action.SortIndicator",
    $extends : ariaWidgetsActionActionWidget,
    $css : [ariaWidgetsActionSortIndicatorStyle],
    /**
     * SortIndicator constructor
     * @param {aria.widgets.CfgBeans:SortIndicatorCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     * @param {Number} lineNumber Line number corresponding in the .tpl file where the widget is created
     */
    $constructor : function (cfg, ctxt, lineNumber) {
        this.$ActionWidget.constructor.apply(this, arguments);

        this._setSkinObj(this._skinnableClass);
        this._setInputType();
        this._setIconPrefix();

        /**
         * Internal widget state [normal, disabled, ...]
         * @type String
         * @protected
         * @override
         */
        this._state = this._setState(cfg);

        /**
         * Instance of the Icon widget used by this widget.
         * @type aria.widgets.Icon
         * @protected
         */
        this._icon = new ariaWidgetsIcon({
            icon : this._getIconName(this._state)
        }, ctxt, lineNumber);

        if (ariaUtilsType.isString(cfg.ellipsis)) {
            /**
             * Activate ellipsis ot not
             * @type Boolean
             * @protected
             */
            this._activateEllipsis = true;

            /**
             * Flag for widget that get initialized right after being displayed.
             * @type Boolean
             * @protected
             */
            this._directInit = true;
        }

        // #04464481 this was done in the init by modifying the style property ofthe DOM element
        // can be done here instead, and directly inserted in the generated markup
        var width = this._cfg.width;

        /**
         * Styling information for the containing span
         * @protected
         * @type String
         */
        this._spanStyle = [(width > 0) ? "width:" + width + "px;" : "", "white-space:nowrap;"].join("");

        /**
         * Moment in which the widget gets initialized
         * @type Date
         */
        this.loadTime = null;
    },
    $destructor : function () {
        this._icon.$dispose();

        this.textContent = null;

        if (this._ellipsis) {
            this._ellipsis.$dispose();
            this._ellipsis = null;
        }

        this.loadTime = null;
        this._hasMouseOver = null;
        this._hasFocus = null;
        this._state = null;
        this.$ActionWidget.$destructor.call(this);
    },
    $statics : {
        /**
         * Ascending and descending are used to refer to the icon image sprite
         * @type String
         */
        ASCENDING_STATE : 'ascending',
        DESCENDING_STATE : 'descending',
        NORMAL_STATE : "normal"
    },
    $prototype : {
        /**
         * Activate ellipsis ot not
         * @protected
         * @type Boolean
         */
        _activateEllipsis : false,

        /**
         * Status flag to check if the widget currently has mouseover
         * @protected
         * @type Boolean
         */
        _hasMouseOver : false,

        /**
         * Status flag to check if the widget currently has the focus
         * @protected
         * @type Boolean
         */
        _hasFocus : false,

        /**
         * Tells if the widgets is using a tabindex (for tab navigation).
         * @protected
         * @type Boolean
         */
        _customTabIndexProvided : true,

        /**
         * Skinnable class to use for this widget.
         * @protected
         * @type String
         */
        _skinnableClass : "SortIndicator",

        /**
         * Called when a new instance is initialized
         * @param {HTMLElement} actingDom Element on which actions happen
         * @protected
         */
        _initActionWidget : function (actingDom) {
            this.loadTime = new Date();

            if (actingDom) {
                this._actingDom = actingDom;
                // var domElt = this.getDom();

                this._initializeFocusableElement();

                if (this._activateEllipsis) {
                    this._initializeEllipsis();
                }
            }
        },

        /**
         * Called when a new instance is created if an ellipsis is needed on this SortIndicator instance
         * @protected
         */
        _initializeEllipsis : function () {
            var cfg = this._cfg;
            var anchorElement = ariaUtilsDom.getDomElementChild(this.getDom(), 0);

            var ellipseElement = Aria.$window.document.createElement("span");

            ellipseElement.innerHTML = ariaUtilsString.escapeHTML(cfg.label);

            this.textContent = cfg.label;

            if (ellipseElement.innerHTML) {
                anchorElement.insertBefore(ellipseElement, anchorElement.firstChild);
            }

            var labelWidth = cfg.labelWidth;
            if (labelWidth > 0) {
                this._ellipsis = new ariaUtilsEllipsis(ellipseElement, labelWidth, cfg.ellipsisLocation, cfg.ellipsis, this._context, cfg.ellipsisEndStyle);
            }

            if (ellipseElement.innerHTML) {
                anchorElement.removeChild(anchorElement.childNodes[1]);
            }
        },

        /**
         * Called when a new instance is created if there is a dom element that receives actions and thus focus
         * @protected
         */
        _initializeFocusableElement : function () {
            this._focusElt = this._actingDom;
        },

        /**
         * Internal function to override to generate the internal widget markup
         * @param {aria.templates.MarkupWriter} out Markup writer
         * @protected
         */
        _widgetMarkup : function (out) {
            var cfg = this._cfg;
            var tabString = (cfg.tabIndex != null ? ' tabindex="' + this._calculateTabIndex() + '" ' : ' ');
            out.write(['<a', Aria.testMode ? ' id="' + this._domId + '_link"' : '',
                    ' class="sortIndicatorLink" href="#"' + tabString + '>' + ariaUtilsString.escapeHTML(cfg.label)].join(""));
            this._icon.writeMarkup(out);
            out.write('</a>');
        },

        /**
         * Internal method to set the initial _state property from the _cfg description based on the config properties
         * @protected
         * @param {Object} cfg Config properties
         * @return {String} new state
         */
        _setState : function (cfg) {
            if (cfg.view.sortName == cfg.sortName) {
                if (cfg.view.sortOrder == 'A') {
                    return this.ASCENDING_STATE;
                } else if (cfg.view.sortOrder == 'D') {
                    return this.DESCENDING_STATE;
                }
            } else {
                return this.NORMAL_STATE;
            }
        },

        /**
         * Internal method to sort the list
         * @protected
         */
        _sortList : function () {
            this._cfg.view.toggleSortOrder(this._cfg.sortName, this._cfg.sortKeyGetter);
            this._cfg.view.refresh();
            this._state = this._setState(this._cfg);
            this._icon.changeIcon(this._getIconName(this._state));
        },

        /**
         * A private method to set this objects skin object
         * @param {String} widgetName Name of the widget
         * @protected
         */
        _setSkinObj : function (widgetName) {
            this._skinObj = aria.widgets.AriaSkinInterface.getSkinObject(widgetName, this._cfg.sclass);
        },

        /**
         * Protected method to get the icon name based on the _cfg description
         * @param {String} state widget state
         * @return {String} Icon name
         * @protected
         */
        _getIconName : function (state) {
            var cfg = this._cfg;
            return cfg._iconSet + ":" + cfg._iconPrefix + state;
        },

        /**
         * Internal method to set the _inputType property from the _cfg description
         * @protected
         */
        _setInputType : function () {
            this._cfg._inputType = "sortindicator";
        },

        /**
         * Internal method to set the _iconPrefix property from the _cfg description
         * @protected
         */
        _setIconPrefix : function () {
            this._cfg._iconSet = this._skinObj.iconset;
            this._cfg._iconPrefix = this._skinObj.iconprefix;
        },

        /**
         * Perform a partial refresh of some sections
         * @param {Array} Array of $refresh configuration Objects, aria.templates.CfgBeans.RefreshCfg
         * @protected
         */
        _doPartialRefresh : function (refreshArgs) {
            var i = refreshArgs.length;
            while (i--) {
                this._context.$refresh(refreshArgs[i]);
            }
        },

        /**
         * Internal method to handle the mouse over event
         * @protected
         * @param {aria.DomEvent} domEvt Mouse over event
         */
        _dom_onmouseover : function (domEvt) {
            this.$ActionWidget._dom_onmouseover.call(this, domEvt);
            if (this._ellipsis) {
                var mouseOverTime = new Date();

                /*
                 * James says: When they click on the full text of the ellipses, the refresh removes the full text, but
                 * then the mouseover is raised which puts the full text back in the way again. This makes sure that a
                 * time has passed from initialisation before displaying it.
                 */
                var timeDifference = mouseOverTime.getTime() - this.loadTime.getTime();
                if (timeDifference > 200) {

                    this._hasMouseOver = true;
                    var offset;
                    if (ariaCoreBrowser.isFirefox) {
                        offset = {
                            left : 1,
                            top : 2
                        };
                    } else if (ariaCoreBrowser.isIE8) {
                        offset = {
                            left : 0,
                            top : 1
                        };
                    } else {
                        offset = {
                            left : 1,
                            top : 1
                        };
                    }

                    if (this._ellipsis) {
                        this._ellipsis.displayFullText(offset);
                    }
                }

            }
        },

        /**
         * The method called when the mouse leaves the widget
         * @param {aria.DomEvent} domEvt Mouse out event
         * @protected
         */
        _dom_onmouseout : function (domEvt) {
            this.$ActionWidget._dom_onmouseout.call(this, domEvt);
            if (this._ellipsis) {

                if (this._hasFocus === false && this._hasMouseOver === true) {
                    this._hasMouseOver = false;
                    if (this._ellipsis) {
                        this._ellipsis._hideFullText(domEvt.relatedTarget);
                    }
                }
            }
        },

        /**
         * The method called when the widget gets focus
         * @param {aria.DomEvent} domEvt Focus event
         * @protected
         */
        _dom_onfocus : function (domEvt) {
            if (this._actingDom && this._hasMouseOver === false) {
                this._hasFocus = true;
                var offset;
                if (ariaCoreBrowser.isFirefox) {
                    offset = {
                        left : 1,
                        top : 2
                    };
                } else {
                    offset = {
                        left : 1,
                        top : 1
                    };
                }
                if (this._ellipsis) {
                    this._ellipsis.displayFullText(offset);
                }
            }
        },

        /**
         * The method called when focus leaves the widget
         * @param {aria.DomEvent} domEvt Blur event
         * @protected
         */
        _dom_onblur : function (domEvt) {
            if (this._hasMouseOver === false && this._hasFocus === true) {
                this._hasFocus = false;
                if (this._ellipsis) {
                    this._ellipsis._hideFullText(domEvt.relatedTarget);
                }
            }
        },

        /**
         * The method called when the markup of the widget is clicked
         * @param {aria.DomEvent} domEvt Click event
         * @protected
         */
        _dom_onclick : function (domEvt) {

            this._sortList();

            // handle an onclick event
            this.$ActionWidget._dom_onclick.apply(this, arguments);

            if (this._cfg.refreshArgs) {
                this._doPartialRefresh(this._cfg.refreshArgs);
            } else {
                this._context.$refresh();
            }
            domEvt.preventDefault();

            return false;
        }
    }
});
