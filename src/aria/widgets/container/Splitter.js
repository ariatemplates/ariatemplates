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
 * @class aria.widgets.container.Splitter Class definition for the splitter widget.
 * @extends aria.widgets.container.Container
 */
Aria.classDefinition({
    $classpath : "aria.widgets.container.Splitter",
    $extends : "aria.widgets.container.Container",
    $dependencies : ["aria.utils.Dom", "aria.utils.ClassList", "aria.utils.dragdrop.Drag", "aria.core.Browser"],
    $css : ["aria.widgets.container.SplitterStyle"],
    /**
     * Splitter constructor
     * @param {aria.widgets.CfgBeans.SplitterCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     */
    $constructor : function (cfg, ctxt) {
        this.$Container.constructor.apply(this, arguments);

        this._skinObj = aria.widgets.AriaSkinInterface.getSkinObject("Splitter", cfg.sclass);

        /**
         * Contains the dom element of first splitter panel
         * @protected
         * @type {DOMElement}
         */
        this._splitPanel1 = null;
        /**
         * Contains the dom element of second splitter panel
         * @protected
         * @type {DOMElement}
         */
        this._splitPanel2 = null;
        /**
         * Splitter height .
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
         * @type {DOMElement}
         */
        this._splitBar = null;

        /**
         * Reference to the dom element
         * @protected
         * @type {DOMElement}
         */
        this._splitBarProxy = null;

    },
    $destructor : function () {
        this._skinObj = null;
        this._height = null;
        this._handleBarClass = null;
        this._splitBar = null;
        this._splitBarProxy = null;
        this._splitPanel1 = null;
        this._splitPanel2 = null;
        this._splitBarProxyClass.$dispose();
        this._destroyDraggable();
        this.$Container.$destructor.call(this);
    },
    $statics : {
        SPLITTER_BORDER_SIZE : 2
        // Default 2px;
    },
    $prototype : {
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
            this._draggable = new aria.utils.dragdrop.Drag(handleBarElem, {
                handle : handleBarElem,
                cursor : "n-resize",
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
            this._splitBarProxyClass.add("xSplitter_" + this._cfg.sclass + '_sSplitBarProxyH');
        },

        _onDragEnd : function () {
            this.getDom().onselectstart = Aria.returnTrue;
            this._splitBarProxyClass.remove("xSplitter_" + this._cfg.sclass + '_sSplitBarProxyH');
            this._splitBarProxyClass.add(this._handleBarClass);
            this._context.$refresh({
                outputSection : "_splitterContent1_" + this._domId
            });
            this._context.$refresh({
                outputSection : "_splitterContent2_" + this._domId
            });

            var elem = this._draggable.element;
            var size1 = (elem.offsetTop <= 0) ? 0 : elem.offsetTop;
            var size2 = ((this._height - size1) <= 0) ? 0 : (this._height - size1);
            this.setProperty("size1", size1);
            this.setProperty("size2", size2);
            this._splitPanel1.style.height = size1 + "px";
            this._splitPanel2.style.height = size2 + "px";
            this._splitBar.style.top = size1 + "px";
            this._splitBarProxy.style.top = size1 + "px";

        },

        /**
         * The main entry point into the Splitter begin markup.
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         */
        _widgetMarkupBegin : function (out) {
            var cfg = this._cfg;
            var size = this._calculateSize(cfg);
            this.setProperty("size1", size.size1);
            this.setProperty("size2", size.size2);
            var borderClass = "", splitterBarSize = cfg.width;
            var height = this._height + Number(this._skinObj.separatorHeight);
            if (cfg.border) {
                borderClass = "xSplitter_" + cfg.sclass + "_sBdr";
            }

            this._handleBarClass = (cfg.orientation == "horizontal")
                    ? "xSplitter_" + cfg.sclass + "_sHandleH"
                    : "xSplitter_" + cfg.sclass + "_sHandleV";

            out.write(['<span class="xSplitter_', cfg.sclass, '_sContainer ', borderClass, '" style="height:', height,
                    'px;width:', cfg.width, 'px;"><span class="xSplitter_', cfg.sclass,
                    '_sConstrained"  ><span class="xSplitter_', cfg.sclass, '_sMacro" style="height: ', size.size1,
                    'px; width:', cfg.width, 'px;">'].join(""));

            out.beginSection({
                id : "_splitterContent1_" + this._domId,
                macro : cfg.macro1
            });
            out.endSection();
            out.write('</span> ');

            out.write(['<span class="', this._handleBarClass, '" style="width:', splitterBarSize, 'px;top:',
                    size.size1, 'px; "> </span><span id="splitBarProxy_', this._domId, '" class="',
                    this._handleBarClass, ' " style="top:', size.size1,
                    'px; width:100%;"></span><span class="xSplitter_', cfg.sclass, '_sMacro" style="height: ',
                    size.size2, 'px;width:', cfg.width, 'px;bottom:0px">'].join(""));

            out.beginSection({
                id : "_splitterContent2_" + this._domId,
                macro : cfg.macro2
            });
            out.endSection();
            out.write(['</span> </span> </span>'].join(""));

        },

        /**
         * calculate the width/height of panels from the splitter configuration
         * @param {aria.widgets.CfgBeans.SplitterCfg}
         */
        _calculateSize : function (cfg) {
            var bdr = cfg.border ? this.SPLITTER_BORDER_SIZE : 0;
            this._height = cfg.height - this._skinObj.separatorHeight - bdr;
            if (this._height < 0) {
                this._height = 0;
            }
            if (cfg.size1 < 0) {
                cfg.size1 = 0;
            }
            if (cfg.size2 < 0) {
                cfg.size2 = 0;
            }
            if (cfg.size1 == null && cfg.size2 == null) {
                cfg.size1 = Math.floor(this._height / 2);
                cfg.size2 = this._height - cfg.size1;
            } else if (cfg.size1 == null && cfg.size2 != null) {
                cfg.size1 = this._height - cfg.size2;
            } else if (cfg.size1 != null && cfg.size2 == null) {
                cfg.size2 = this._height - cfg.size1;
            }

            var totalHeight = cfg.size1 + cfg.size2;
            var diffHeight = (this._height - totalHeight);
            var size = {};
            if (this._height == totalHeight) {
                size.size1 = cfg.size1;
                size.size2 = cfg.size2;
            } else {
                if (cfg.adapt == "size1") {
                    size.size2 = cfg.size2;// + diffHeight;
                    if (size.size2 > this._height) {
                        size.size2 = this._height;
                    }
                    size.size1 = this._height - size.size2;
                } else if (cfg.adapt == "size2") {
                    size.size1 = cfg.size1;// + diffHeight;
                    if (size.size1 > this._height) {
                        size.size1 = this._height;
                    }
                    size.size2 = this._height - size.size1;
                } else {
                    if (totalHeight != 0) {
                        size.size1 = Math.floor((this._height * cfg.size1) / totalHeight);
                        size.size2 = this._height - size.size1;
                    } else {
                        size.size1 = Math.floor(this._height / 2);
                        size.size2 = this._height - cfg.size1;
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
                var splitterHeight = this._height;
                if (newValue > splitterHeight) {
                    newValue = splitterHeight;
                }
                if (newValue < 0) {
                    newValue = 0;
                }

                var otherSize = splitterHeight - newValue;
                if (propertyName == "size1") {
                    this._splitPanel2.style.height = otherSize + "px";
                    this._splitPanel1.style.height = newValue + "px";
                    this._splitBar.style.top = newValue + "px";
                    this._splitBarProxy.style.top = newValue + "px";
                    this.setProperty("size1", newValue);
                    this.setProperty("size2", otherSize);
                } else {
                    this._splitPanel1.style.height = otherSize + "px";
                    this._splitPanel2.style.height = newValue + "px";
                    this._splitBar.style.top = otherSize + "px";
                    this._splitBarProxy.style.top = otherSize + "px";
                    this.setProperty("size2", newValue);
                    this.setProperty("size1", otherSize);
                }
                this._context.$refresh({
                    outputSection : "_splitterContent1_" + this._domId
                });
                this._context.$refresh({
                    outputSection : "_splitterContent2_" + this._domId
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