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
var ariaWidgetsContainerTabPanelStyle = require("./TabPanelStyle.tpl.css");
var ariaWidgetsContainerContainer = require("./Container");


/**
 * TabPanel widget
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.container.TabPanel",
    $extends : ariaWidgetsContainerContainer,
    $css : [ariaWidgetsContainerTabPanelStyle],
    /**
     * TabPanel constructor
     * @param {aria.widgets.CfgBeans:TabPanelCfg} cfg the widget configuration
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

        this._frame = ariaWidgetsFramesFrameFactory.createFrame({
            height : cfg.height,
            state : "normal",
            width : cfg.width,
            sclass : cfg.sclass,
            skinnableClass : this._skinnableClass,
            printOptions : cfg.printOptions,
            block : cfg.block
        });

        this._defaultMargin = 0;

        this._spanStyle = "top:-1.5px;";

        // ---------------------------------------------------------------------

        var extraAttributes = [];

        if (cfg.waiAria) {
            extraAttributes.push(['role', 'tabpanel']);

            this._updateControlledTabPanelId();

            var id = this._getLabelId();
            if (id != null) {
                extraAttributes.push(['aria-labelledby', id]);
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
    /**
     * TabPanel destructor
     */
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
        _skinnableClass : "TabPanel",

        /**
         * Called when a new instance is initialized
         * @private
         */
        _init : function () {
            var frameDom = aria.utils.Dom.getDomElementChild(this.getDom(), 0);

            if (frameDom) {
                this._frame.linkToDom(frameDom);
            }

            this.$Container._init.call(this);
        },

        /**
         * Internal method called when one of the model properties that the widget is bound to has changed Must be
         * overridden by sub-classes defining bindable properties
         * @param {String} propertyName the property name
         * @param {Object} newValue the new value
         * @param {Object} oldValue the old property value
         */
        _onBoundPropertyChange : function (propertyName, newValue, oldValue) {
            if (propertyName == "selectedTab") {
                this._context.$refresh({
                    section : this._getSectionId()
                });
            } else if (propertyName === 'labelId') {
                this._reactToLabelIdChange(newValue);
            } else {
                this.$Container._onBoundPropertyChange.call(this, propertyName, newValue, oldValue);
            }
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

            return 'aria:' + configurationOfCommonBinding.to + '_' + name;
        },



        ////////////////////////////////////////////////////////////////////////
        // Tab controls id management (from TabPanel to Tab)
        ////////////////////////////////////////////////////////////////////////

        _getControlledTabPanelIdPropertyName : function (cfg) {
            return this._getCommonBindingMetaDataPropertyName('controlledTabPanelId', cfg);
        },

        _updateControlledTabPanelId : function () {
            this.changeProperty('controlledTabPanelId', this._domId);
        },



        ////////////////////////////////////////////////////////////////////////
        // Label id management (from TabPanel to Tab)
        ////////////////////////////////////////////////////////////////////////

        _getLabelIdPropertyName : function (cfg) {
            return this._getCommonBindingMetaDataPropertyName('labelId', cfg);
        },

        _getLabelId : function () {
            var configurationOfCommonBinding = this._getConfigurationOfCommonBinding();

            if (configurationOfCommonBinding == null) {
                return null;
            }

            var inside = configurationOfCommonBinding.inside;
            var property = this._getLabelIdPropertyName();

            return inside[property];
        },

        _reactToLabelIdChange : function (id) {
            if (!this._cfg.waiAria) {
                return;
            }

            var attributeName = 'aria-labelledby';

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

        _getSectionId : function () {
            return "__tabPanel_" + this._domId;
        },



        ////////////////////////////////////////////////////////////////////////
        //
        ////////////////////////////////////////////////////////////////////////

        /**
         * Internal function to generate the internal widget markup
         * @param {aria.templates.MarkupWriter} out
         * @protected
         */
        _widgetMarkup : function (out) {
            this._frame.writeMarkupBegin(out);
            out.beginSection({
                id : this._getSectionId(),
                macro : this._cfg.macro
            });
            out.endSection();
            this._frame.writeMarkupEnd(out);
        },

        /**
         * @param {aria.templates.MarkupWriter} out
         */
        writeMarkupBegin : function (out) {
            out.skipContent = true;
            this.$logError(this.INVALID_USAGE_AS_CONTAINER, ["TabPanel"]);
        },

        /**
         * @param {aria.templates.MarkupWriter} out
         */
        writeMarkupEnd : Aria.empty,

        /**
         * A protected method to set this objects skin object
         * @param {String} widgetName
         * @protected
         */
        _setSkinObj : function (widgetName) {
            this._skinObj = aria.widgets.AriaSkinInterface.getSkinObject(widgetName, this._cfg.sclass);
        }

    }
});
