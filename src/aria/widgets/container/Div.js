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
 * @class aria.widgets.container.Div Class definition for the div widget.
 * @extends aria.widgets.container.Container
 */
Aria.classDefinition({
    $classpath : "aria.widgets.container.Div",
    $extends : "aria.widgets.container.Container",
    $dependencies : ["aria.utils.Dom", "aria.widgets.frames.FrameFactory"],
    $css : ["aria.widgets.container.DivStyle"],
    /**
     * Div constructor
     * @param {aria.widgets.CfgBeans.ActionWidgetCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     */
    $constructor : function (cfg, ctxt) {
        this.$Container.constructor.apply(this, arguments);
        // make a call to the AriaSkinInterface to get access to the skin object applicable here
        if (!this._frame) {
            /* this._frame could be overriden in sub-classes */
            this._frame = aria.widgets.frames.FrameFactory.createFrame({
                skinnableClass : "Div",
                sclass : cfg.sclass,
                state : "normal",
                width : cfg.width,
                height : cfg.height,
                printOptions : cfg.printOptions,
                cssClass : cfg.cssClass,
                "oldStuff:cssRoot" : "DIV",
                block : cfg.block,
                scrollBarX : cfg.scrollBarX,
                scrollBarY : cfg.scrollBarY
            });
        }
        this._skinObj = this._frame.getSkinObject();
        this._selected = false;
    },
    $destructor : function () {
        this._skinObj = null;
        this._initState = null;
        if (this._frame) {
            this._frame.$dispose();
            this._frame = null;
        }
        this.$Container.$destructor.call(this);
    },
    $prototype : {

        /**
         * A method called when we initialize the object.
         */
        _init : function () {
            // link the frame
            var content = aria.utils.Dom.getDomElementChild(this.getDom(), 0);
            this._frame.linkToDom(content);

            aria.widgets.container.Div.superclass._init.call(this);
        },

        /**
         * The main entry point into the Div begin markup. Here we check whether it is a Div, defined in the AriaSkin
         * object, that has an image that is repeated as a background.
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         */
        _widgetMarkupBegin : function (out) {
            this._frame.writeMarkupBegin(out);
        },

        /**
         * The main entry point into the Div end markup. Here we check whether it is a Div, defined in the AriaSkin
         * object, that has an image that is repeated as a background.
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         */
        _widgetMarkupEnd : function (out) {
            this._frame.writeMarkupEnd(out);
        },

        /**
         * Change the width, height, max width and max height of the configuration, then update the container size
         * @param {aria.widgets.CfgBeans.ActionWidgetCfg} cfg the widget configuration (only width, height, maxWidth,
         * maxHeight will be used)
         */
        updateSize : function (cfg) {
            var hasChanged = false;
            var value;
            value = cfg.maxWidth;
            if (value && value != this._cfg.maxWidth) {
                this._cfg.maxWidth = value;
                hasChanged = true;
            }
            value = cfg.width;
            if (value && value != this._cfg.width) {
                this._cfg.width = value;
                hasChanged = true;
            }
            value = cfg.maxHeight;
            if (value && value != this._cfg.maxHeight) {
                this._cfg.maxHeight = value;
                hasChanged = true;
            }
            value = cfg.height;
            if (value && value != this._cfg.height) {
                this._cfg.height = value;
                hasChanged = true;
            }
            if (hasChanged) {
                /*
                 * // Change width and height if it's too large compared to the viewport var viewport =
                 * aria.utils.Dom._getViewportSize(); if (viewport.width < this._cfg.width) { this._cfg.width =
                 * viewport.width; } if (viewport.height < this._cfg.height) { this._cfg.height = viewport.height; }
                 */
                this.$Container._updateContainerSize.call(this);
            }

        }
    }
});
