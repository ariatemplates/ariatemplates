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
var ariaWidgetsContainerDiv = require("./Div");
var ariaPopupsPopup = require("../../popups/Popup");
var ariaUtilsMath = require("../../utils/Math");
var ariaUtilsDom = require("../../utils/Dom");
var ariaWidgetsContainerContainer = require("./Container");
var ariaCoreTimer = require("../../core/Timer");


(function () {

    /**
     * @type Object
     * @private
     *
     * <pre>
     *     {
     *         key : // @type String id of the tooltip
     *         value : // @type Boolean true if tooltip is displayed
     *  }
     * </pre>
     */
    var __tooltipsDisplayed = {};
    var timer;

    /**
     * @class aria.widgets.container.Tooltip
     */
    module.exports = Aria.classDefinition({
        $classpath : 'aria.widgets.container.Tooltip',
        $extends : ariaWidgetsContainerContainer,
        $onload : function (classRef) {
            timer = ariaCoreTimer;
        },
        $onunload : function () {
            __tooltipsDisplayed = null;
            timer = null;
        },
        $constructor : function (cfg, ctxt) {
            this.$Container.constructor.apply(this, arguments);
            this._directInit = false;
            this._associatedWidget = null;
            this._showTimeout = null;
            this._popup = null; // will contain the popup object when displayed
        },
        $destructor : function () {
            this._cfgOk = false; // so that the tooltip is not shown after the destruction of this object
            if (this._showTimeout) {
                timer.cancelCallback(this._showTimeout);
                this._showTimeout = null;
            }
            if (this._popup) {
                this._popup.close();
            }
            this._associatedWidget = null;
            this.$Container.$destructor.call(this);
        },
        $prototype : {

            /**
             * @param {aria.templates.MarkupWriter} out
             * @private
             */
            _writerCallback : function (out) {
                var cfg = this._cfg;
                var viewport = ariaUtilsDom._getViewportSize();
                // We can lose the reference to this div, as it will be destroyed by the section
                var div = new ariaWidgetsContainerDiv({
                    sclass : cfg.sclass,
                    width : cfg.width,
                    height : cfg.height,
                    minWidth : cfg.minWidth,
                    minHeight : cfg.minHeight,
                    maxWidth : ariaUtilsMath.min(cfg.maxWidth, viewport.width),
                    maxHeight : ariaUtilsMath.min(cfg.maxHeight, viewport.height),
                    printOptions : cfg.printOptions,
                    cssClass : this._context.getCSSClassNames(true)
                }, this._context, this._lineNumber);
                out.registerBehavior(div);
                div.writeMarkupBegin(out);
                out.callMacro(cfg.macro);
                div.writeMarkupEnd(out);
                this.$assert(52, div);
            },

            /**
             * @param {aria.templates.MarkupWriter} out
             * @private
             */
            writeMarkup : function (out) {
                this._checkCfgConsistency();
                if (this._cfgOk) {
                    var cfg = this._cfg;
                    this._sectionId = ["__toolTipSection_", cfg.id].join("");
                    out.beginSection({
                        id : this._sectionId,
                        type : ""
                    });
                    out.endSection();
                }
            },

            /**
             * @param {aria.templates.MarkupWriter} out
             */
            writeMarkupBegin : function (out) {
                out.skipContent = true;
                this.$logError(this.INVALID_USAGE_AS_CONTAINER, ["Tooltip"]);
            },

            /**
             * @param {aria.templates.MarkupWriter} out
             */
            writeMarkupEnd : Aria.empty,

            /**
             * Called when the associated widget receives a mouseover event.
             * @param {aria.widgets.Widget} widget associated widget
             * @param {aria.DomEvent} domEvt
             */
            associatedWidgetMouseOver : function (widget, domEvt) {
                if (!this._cfgOk) {
                    return;
                }
                if (this._popup && this._associatedWidget == widget) {
                    this._popup.cancelMouseOutTimer();
                }
                if (!this._showTimeout) {
                    this._showTimeout = timer.addCallback({
                        scope : this,
                        fn : this.showTooltip,
                        args : {
                            widget : widget,
                            absolutePosition : {
                                left : domEvt.clientX,
                                top : domEvt.clientY
                            }
                        },
                        delay : this._cfg.showDelay
                    });
                }
            },
            /**
             * Called when the associated widget receives a mousemove event.
             * @param {aria.widgets.widget} widget associated widget
             * @param {aria.DomEvent} domEvt
             */
            associatedWidgetMouseMove : function (widget, domEvt) {
                if (!this._cfgOk) {
                    return;
                }
                if (this._showTimeout && this._cfg.showOnlyOnMouseStill) {
                    timer.cancelCallback(this._showTimeout);
                    this._showTimeout = timer.addCallback({
                        scope : this,
                        fn : this.showTooltip,
                        args : {
                            widget : widget,
                            absolutePosition : {
                                left : domEvt.clientX,
                                top : domEvt.clientY
                            }
                        },
                        delay : this._cfg.showDelay
                    });
                }
            },
            /**
             * Called when the associated widget receives a mouseout event.
             * @param {aria.widgets.Widget} widget associated widget
             * @param {aria.DomEvent} domEvt
             */
            associatedWidgetMouseOut : function (widget, domEvt) {
                if (!this._cfgOk) {
                    return;
                }
                if (this._popup) {
                    this._popup.closeOnMouseOut(domEvt);
                }
                if (this._showTimeout) {
                    timer.cancelCallback(this._showTimeout);
                    this._showTimeout = null;
                }
            },
            /**
             * Show the tooltip.
             * @param {Object} params this json object currently have two properties: {aria.utils.DomBeans.Position}
             * absolutePosition mouse position {aria.widgets.Widget} widget widget for which the tooltip should be shown
             */
            showTooltip : function (params) {
                if (!this._cfgOk) {
                    return;
                }
                this._showTimeout = null;
                var absolutePosition = params.absolutePosition;
                var widget = params.widget;
                if (this._associatedWidget != widget) {
                    this.closeTooltip();
                    this._associatedWidget = widget;
                }
                if (this._popup) {
                    return;
                }
                var refreshParams = {
                    writerCallback : {
                        fn : this._writerCallback,
                        scope : this
                    },
                    section : this._sectionId
                };

                __tooltipsDisplayed[this._domId] = true;
                var section = this._context.getRefreshedSection(refreshParams);
                var cfg = this._cfg;
                var popup = new ariaPopupsPopup();
                this._popup = popup;
                popup.$on({
                    scope : this,
                    "onAfterClose" : this._onAfterPopupClose
                });

                popup.open({
                    section : section,
                    keepSection : true,
                    absolutePosition : absolutePosition,
                    closeOnMouseClick : cfg.closeOnMouseClick,
                    closeOnMouseScroll : cfg.closeOnMouseScroll,
                    closeOnMouseOut : cfg.closeOnMouseOut,
                    closeOnMouseOutDelay : cfg.closeOnMouseOutDelay,
                    offset : {
                        left : 0,
                        top : 16
                    }
                });
            },

            /**
             * Close the tooltip.
             */
            closeTooltip : function () {
                if (this._popup) {
                    this._popup.close();
                }
            },

            /**
             * Event handler called when the popup is closed.
             * @private
             */
            _onAfterPopupClose : function () {
                this._popup.$dispose();
                __tooltipsDisplayed[this._domId] = false;
                delete __tooltipsDisplayed[this._domId];
                this._popup = null;
            }

        }
    });
})();
