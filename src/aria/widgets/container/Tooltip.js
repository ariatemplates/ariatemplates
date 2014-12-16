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
    Aria.classDefinition({
        $classpath : 'aria.widgets.container.Tooltip',
        $extends : 'aria.widgets.container.Container',
        $dependencies : ['aria.widgets.container.Div', 'aria.popups.Popup', 'aria.utils.Math', 'aria.utils.Dom'],
        $onload : function (classRef) {
            timer = aria.core.Timer;
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
        $statics : {
            // ERROR MESSAGES:
            CONTAINER_USAGE_DEPRECATED : "%1The usage as a container {@aria:Tooltip}{/@aria:Tooltip} is deprecated; use the {@aria:Tooltip /} syntax instead.",
            WIDGET_TOOLTIP_MACRO : "%1Tooltip with id '%2' must either have the 'macro' property specified (recommended) or be a container ({@aria:Tooltip}{/@aria:Tooltip}; deprecated)."
        },
        $prototype : {
            /**
             * @private
             */
            _checkCfgConsistency : function () {
                if (!this._cfgOk) {
                    return;
                }
                var cfg = this._cfg;
                if ((this._container && cfg.macro) || (!this._container && !cfg.macro)) {
                    this.$logError(this.WIDGET_TOOLTIP_MACRO, [cfg.id]);
                    this._cfgOk = false;
                    return;
                }
            },
            /**
             * @private
             */
            _widgetMarkupBegin : function (out) {
                var cfg = this._cfg;
                this._sectionId = ["__toolTipSection_", cfg.id].join("");
                // if out.sectionState == out.SECTION_KEEP, it means the content of the tooltip
                // would be kept at the same place as the widget in the template, instead of being
                // sent to the popup so, in this case, we always skip the content
                this._skipContent = (out.sectionState == out.SECTION_KEEP) || !__tooltipsDisplayed[this._domId];
                out.skipContent = this._skipContent;
                out.beginSection({
                    id : this._sectionId,
                    type : "" // a tooltip has nothing in the dom until it is displayed
                });
                if (this._skipContent) {
                    return;
                }
                this._widgetMarkupBeginCommon(out);
            },

            _widgetMarkupBeginCommon : function (out) {
                var cfg = this._cfg;
                var viewport = aria.utils.Dom._getViewportSize();
                // We loose the reference to this div, as it will be destroyed by the section
                var div = new aria.widgets.container.Div({
                    sclass : cfg.sclass,
                    width : cfg.width,
                    height : cfg.height,
                    minWidth : cfg.minWidth,
                    minHeight : cfg.minHeight,
                    maxWidth : aria.utils.Math.min(cfg.maxWidth, viewport.width),
                    maxHeight : aria.utils.Math.min(cfg.maxHeight, viewport.height),
                    printOptions : cfg.printOptions,
                    cssClass : this._context.getCSSClassNames(true)
                }, this._context, this._lineNumber);
                this._tooltipDiv = div;
                out.registerBehavior(div);
                div.writeMarkupBegin(out);
            },
            /**
             * @private
             */
            _widgetMarkupEnd : function (out) {
                if (!this._skipContent) {
                    this._widgetMarkupEndCommon(out);
                }
                out.endSection();
            },

            _widgetMarkupEndCommon : function (out) {
                var div = this._tooltipDiv;
                this._tooltipDiv = null;
                div.writeMarkupEnd(out);
                this.$assert(52, div);
            },
            /**
             * @private
             */
            _writerCallback : function (out) {
                this._widgetMarkupBeginCommon(out);
                out.callMacro(this._cfg.macro);
                this._widgetMarkupEndCommon(out);
            },
            writeMarkup : function (out) {
                this._container = false;
                this._checkCfgConsistency();
                if (this._cfgOk) {
                    this._widgetMarkupBegin(out);
                    this._widgetMarkupEnd(out);
                }
            },
            writeMarkupBegin : function (out) {
                // When Tooltip is used as a container, every time it's shown, the whole macro is recalculated,
                // and even the calling macros up the hierarchy. This reduces performance and, at first,
                // can lead to unexepected behavior.
                this.$logWarn(this.CONTAINER_USAGE_DEPRECATED);
                this._container = true;
                this._checkCfgConsistency();
                if (this._cfgOk) {
                    this._widgetMarkupBegin(out);
                }
            },
            writeMarkupEnd : function (out) {
                this._widgetMarkupEnd(out);
            },
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
                var refreshParams = this._container ? {
                    filterSection : this._sectionId
                } : {
                    writerCallback : {
                        fn : this._writerCallback,
                        scope : this
                    },
                    section : this._sectionId
                };
                __tooltipsDisplayed[this._domId] = true;
                var section = this._context.getRefreshedSection(refreshParams);
                var cfg = this._cfg;
                var popup = new aria.popups.Popup();
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
