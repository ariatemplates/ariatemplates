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
 * Splitter Widget
 */
Aria.classDefinition({
    $classpath : "aria.widgets.container.Splitter",
    $extends : "aria.widgets.container.Container",
    $dependencies : ["aria.utils.Dom", "aria.utils.ClassList", "aria.utils.dragdrop.Drag", "aria.core.Browser"],
    $css : ["aria.widgets.container.SplitterStyle"],
    /**
     * Splitter constructor
     * @param {aria.widgets.CfgBeans:SplitterCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     */
    $constructor : function (cfg, ctxt) {
        this.$Container.constructor.apply(this, arguments);

        this._skinObj = aria.widgets.AriaSkinInterface.getSkinObject(this._skinnableClass, cfg.sclass);

        /**
         * Contains the dom element of first splitter panel
         * @protected
         * @type HTMLElement
         */
        this._splitPanel1 = null;
        /**
         * Contains the dom element of second splitter panel
         * @protected
         * @type HTMLElement
         */
        this._splitPanel2 = null;
        /**
         * Splitter height.
         * @protected
         * @type Number
         */
        this._height = null;
        /**
         * CSS class which should be applied to the splitter bar .
         * @protected
         * @type String
         */
        this._handleBarClass = null;

        /**
         * List of css class applied on splitter bar proxy .
         * @protected
         * @type aria.utils.ClassList
         */
        this._splitBarProxyClass = null;

        /**
         * Reference to the dom element
         * @protected
         * @type HTMLElement
         */
        this._splitBar = null;

        /**
         * Reference to the dom element
         * @protected
         * @type HTMLElement
        this._splitBarProxy = null;

        /**
         * Reference to the Splitter Orientation
         * @protected
         * @type Boolean
         */
        this._orientation = (cfg.orientation === "horizontal") ? true : false;

        /**
         * Reference to Splitter Proxy CSS Class
         * @protected
         * @type String
         */
        this._addHandleCls = this._orientation ? '_sSplitBarProxyH' : '_sSplitBarProxyV';

        /**
         * Splitter width.
         * @protected
         * @type Number
         */
        this._width = null;

        /**
         * Override default widget's span style
         * @protected
         * @override
         * @type String
         */
        this._spanStyle = "overflow: hidden;";

    },
    $destructor : function () {
        this._skinObj = null;
        this._splitBar = null;
        this._splitBarProxy = null;
        this._splitPanel1 = null;
        this._splitPanel2 = null;
        this._splitBarProxyClass.$dispose();
        this._destroyDraggable();
        this.$Container.$destructor.call(this);
    },
    $prototype : {
        /**
         * Skinnable class to use for this widget.
         * @protected
         * @type String
         */
        _skinnableClass : "Splitter",

        /**
         * OVERRIDE initWidget
         */
        initWidget : function () {
            this.$Container.initWidget.apply(this, arguments);
            var getChild = aria.utils.Dom.getDomElementChild;
            var parentContainer = getChild(getChild(this.getDom(), 0), 0);
            this._splitPanel1 = getChild(parentContainer, 0);
            this._splitBar = getChild(parentContainer, 1);
            this._splitBarProxy = getChild(parentContainer, 2);
            this._splitPanel2 = getChild(parentContainer, 3);

            this._splitBarProxyClass = new aria.utils.ClassList(this._splitBarProxy);
            var handleBarElem = "splitBarProxy_" + this._domId;
            var cursor = this._orientation ? "n-resize" : "e-resize";
            this._draggable = new aria.utils.dragdrop.Drag(handleBarElem, {
                handle : handleBarElem,
                cursor : cursor,
                proxy : null,
                constrainTo : parentContainer
            });

            this._draggable.$on({
                "dragstart" : {
                    fn : this._onDragStart,
                    scope : this
                },

                "dragend" : {
                    fn : this._onDragEnd,
                    scope : this
                }
            });

        },
        _onDragStart : function () {
            if (aria.core.Browser.isIE) {
                this.getDom().onselectstart = Aria.returnFalse;
            }
            this._splitBarProxyClass.remove(this._handleBarClass);

            this._splitBarProxyClass.add("xSplitter_" + this._cfg.sclass + this._addHandleCls);
        },

        _onDragEnd : function () {
            this.getDom().onselectstart = Aria.returnTrue;
            this._splitBarProxyClass.remove("xSplitter_" + this._cfg.sclass + this._addHandleCls);
            this._splitBarProxyClass.add(this._handleBarClass);
            var elem = this._draggable.element, offSetType, dimType, dimMode, dimension;
            if (this._orientation) {
                offSetType = "offsetTop";
                dimType = "height";
                dimMode = "top";
                dimension = this._height;
            } else {
                offSetType = "offsetLeft";
                dimType = "width";
                dimMode = "left";
                dimension = this._width;
            }
            var size1 = (elem[offSetType] <= 0) ? 0 : elem[offSetType];
            var size2 = ((dimension - size1) <= 0) ? 0 : (dimension - size1);
            this.setProperty("size1", size1);
            this.setProperty("size2", size2);
            this._splitPanel1.style[dimType] = size1 + "px";
            this._splitPanel2.style[dimType] = size2 + "px";
            if (dimType == "width") { // IE9 sometimes shows full-width scrollbars even on 0px-width containers!
                this._splitPanel1.style.overflowY = (size1 <= 16) ? "hidden" : "";
                this._splitPanel2.style.overflowY = (size2 <= 16) ? "hidden" : "";
            }
            this._splitBar.style[dimMode] = size1 + "px";
            this._splitBarProxy.style[dimMode] = size1 + "px";
            this._context.$refresh({
                section : "_splitterContent1_" + this._domId
            });
            this._context.$refresh({
                section : "_splitterContent2_" + this._domId
            });
        },

        /**
         * The main entry point into the Splitter begin markup.
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         */
        _widgetMarkupBegin : function (out) {
            var cfg = this._cfg, orientation = this._orientation, cfgH, cfgW, cfgHclass, cfgWclass;
            var size = this._calculateSize(cfg);
            this.setProperty("size1", size.size1);
            this.setProperty("size2", size.size2);
            var borderClass = "", splitterBarSize = orientation ? cfg.width : cfg.height;
            var height = this._height + this._skinObj.separatorHeight, width = this._width
                    + this._skinObj.separatorWidth;
            var bordersWidth = 0;

            if (cfg.border) {
                borderClass = "xSplitter_" + cfg.sclass + "_sBdr";
                bordersWidth = this._skinObj.borderWidth * 2;
            }
            this._handleBarClass = "xSplitter_" + cfg.sclass + (orientation ? "_sHandleH" : "_sHandleV");

            if (orientation) {
                cfgH = height, cfgW = cfgWclass = cfg.width - bordersWidth, cfgHclass = size.size1;
            } else {
                cfgH = cfgHclass = cfg.height - bordersWidth, cfgW = width, cfgWclass = size.size1;
            }

            out.write(['<span class="xSplitter_', cfg.sclass, '_sContainer ', borderClass, '" style="height:', cfgH,
                    'px;width:', cfgW, 'px;"><span class="xSplitter_', cfg.sclass,
                    '_sConstrained"  ><span class="xSplitter_', cfg.sclass, '_sMacro" style="height: ', cfgHclass,
                    'px; width:', cfgWclass, 'px;">'].join(""));
            out.beginSection({
                id : "_splitterContent1_" + this._domId,
                macro : cfg.macro1
            });
            out.endSection();
            out.write('</span> ');

            var sDimension, sPosition, sEndPosition;
            if (orientation) {
                cfgHclass = size.size2, cfgWclass = cfg.width - bordersWidth, sDimension = "width", sPosition = "top", sEndPosition = "bottom";
            } else {
                cfgHclass = cfg.height - bordersWidth, cfgWclass = size.size2, sDimension = "height", sPosition = "left", sEndPosition = "right";
            }

            out.write(['<span class="', this._handleBarClass, '" style="' + sDimension + ':', splitterBarSize,
                    'px;' + sPosition + ':', size.size1, 'px; "> </span><span id="splitBarProxy_', this._domId,
                    '" class="', this._handleBarClass, ' " style="' + sPosition + ':', size.size1,
                    'px; ' + sDimension + ':100%;"></span><span class="xSplitter_', cfg.sclass,
                    '_sMacro" style="height: ', cfgHclass, 'px;width:', cfgWclass, 'px;' + sEndPosition + ':0px">'].join(""));

            out.beginSection({
                id : "_splitterContent2_" + this._domId,
                macro : cfg.macro2
            });
            out.endSection();
            out.write(['</span> </span> </span>'].join(""));

        },

        /**
         * calculate the width/height of panels from the splitter configuration
         * @param {aria.widgets.CfgBeans:SplitterCfg}
         */
        _calculateSize : function (cfg) {
            var border = cfg.border ? this._skinObj.borderWidth * 2 : 0, size = {}, totalHeight, initDimension;
            this._height = cfg.height - this._skinObj.separatorHeight - border;
            this._width = cfg.width - this._skinObj.separatorWidth - border;
            if (this._height < 0) {
                this._height = 0;
            }
            if (this._width < 0) {
                this._width = 0;
            }

            if (cfg.size1 < 0) {
                cfg.size1 = 0;
            }
            if (cfg.size2 < 0) {
                cfg.size2 = 0;
            }

            initDimension = this._orientation ? this._height : this._width;
            if (cfg.size1 == null && cfg.size2 == null) {
                cfg.size1 = Math.floor(initDimension / 2);
                cfg.size2 = initDimension - cfg.size1;
            } else if (cfg.size1 == null && cfg.size2 != null) {
                cfg.size1 = initDimension - cfg.size2;
            } else if (cfg.size1 != null && cfg.size2 == null) {
                cfg.size2 = initDimension - cfg.size1;
            }

            totalHeight = cfg.size1 + cfg.size2;
            if (initDimension == totalHeight) {
                size.size1 = cfg.size1;
                size.size2 = cfg.size2;
            } else {
                if (cfg.adapt == "size1") {
                    size.size2 = cfg.size2;
                    if (size.size2 > initDimension) {
                        size.size2 = initDimension;
                    }
                    size.size1 = initDimension - size.size2;
                } else if (cfg.adapt == "size2") {
                    size.size1 = cfg.size1;
                    if (size.size1 > initDimension) {
                        size.size1 = initDimension;
                    }
                    size.size2 = initDimension - size.size1;
                } else {
                    if (totalHeight !== 0) {
                        size.size1 = Math.floor((initDimension * cfg.size1) / totalHeight);
                        size.size2 = initDimension - size.size1;
                    } else {
                        size.size1 = Math.floor(initDimension / 2);
                        size.size2 = initDimension - cfg.size1;
                    }

                }
            }
            return size;
        },

        /**
         * Internal method called when one of the model property that the widget is bound to has changed Must be
         * overridden by sub-classes defining bindable properties
         * @param {String} propertyName the property name
         * @param {Object} newValue the new value
         * @param {Object} oldValue the old property value
         */
        _onBoundPropertyChange : function (propertyName, newValue, oldValue) {
            if (propertyName == "size1" || propertyName == "size2") {
                var orientation = this._orientation, splitterDimension = orientation ? this._height : this._width, dimType, dimMode;
                if (newValue > splitterDimension) {
                    newValue = splitterDimension;
                }
                if (newValue < 0) {
                    newValue = 0;
                }

                var otherSize = splitterDimension - newValue;
                dimType = orientation ? "height" : "width";
                dimMode = orientation ? "top" : "left";

                if (propertyName == "size1") {
                    this._splitPanel2.style[dimType] = otherSize + "px";
                    this._splitPanel1.style[dimType] = newValue + "px";
                    this._splitBar.style[dimMode] = newValue + "px";
                    this._splitBarProxy.style[dimMode] = newValue + "px";
                    this.setProperty("size1", newValue);
                    this.setProperty("size2", otherSize);
                } else {
                    this._splitPanel1.style[dimType] = otherSize + "px";
                    this._splitPanel2.style[dimType] = newValue + "px";
                    this._splitBar.style[dimMode] = otherSize + "px";
                    this._splitBarProxy.style[dimMode] = otherSize + "px";
                    this.setProperty("size2", newValue);
                    this.setProperty("size1", otherSize);
                }
                this._context.$refresh({
                    section : "_splitterContent1_" + this._domId
                });
                this._context.$refresh({
                    section : "_splitterContent2_" + this._domId
                });
            } else {
                this.$Container._onBoundPropertyChange.apply(this, arguments);
            }

        },

        /**
         * Remove listeners and dispose the Drag instance
         * @protected
         */
        _destroyDraggable : function () {
            this._draggable.$removeListeners({
                "dragstart" : {
                    fn : this._onDragStart,
                    scope : this
                },
                "dragend" : {
                    fn : this._onDragEnd,
                    scope : this
                }
            });
            this._draggable.$dispose();
            this._draggable = null;
        }
    }
});
