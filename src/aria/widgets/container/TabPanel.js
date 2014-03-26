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
 * TabPanel widget
 */
Aria.classDefinition({
    $classpath : "aria.widgets.container.TabPanel",
    $extends : "aria.widgets.container.Container",
    $dependencies : ["aria.widgets.frames.FrameFactory", "aria.utils.Function"],
    $css : ["aria.widgets.container.TabPanelStyle"],
    /**
     * TabPanel constructor
     * @param {aria.widgets.CfgBeans:TabPanelCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     */
    $constructor : function (cfg, ctxt) {
        this.$Container.constructor.apply(this, arguments);
        this._setSkinObj(this._skinnableClass);

        this._frame = aria.widgets.frames.FrameFactory.createFrame({
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
                    section : "__tabPanel_" + this._domId
                });
            } else {
                this.$Container._onBoundPropertyChange.call(this, propertyName, newValue, oldValue);
            }
        },

        /**
         * Internal function to generate the internal widget markup
         * @param {aria.templates.MarkupWriter} out
         * @protected
         */
        _widgetMarkup : function (out) {
            this._frame.writeMarkupBegin(out);
            out.beginSection({
                id : "__tabPanel_" + this._domId,
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
        writeMarkupEnd : function (out) {},

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
