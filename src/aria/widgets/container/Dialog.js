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
 * Dialog widget
 * @class aria.widgets.container.Dialog
 */
Aria.classDefinition({
    $classpath : "aria.widgets.container.Dialog",
    $extends : "aria.widgets.container.Container",
    $dependencies : ["aria.widgets.container.Div", "aria.popups.Popup", "aria.widgets.Icon", "aria.utils.Dom",
            "aria.utils.Function", "aria.utils.Delegate", "aria.templates.NavigationManager", "aria.utils.String",
            "aria.utils.Math", "aria.templates.Layout"],
    $css : ["aria.widgets.container.DialogStyle"],

    /**
     * Dialog constructor
     * @param {aria.widgets.CfgBeans.DialogCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     */
    $constructor : function (cfg, ctxt) {
        this.$Container.constructor.apply(this, arguments);
        this._skinObj = aria.widgets.AriaSkinInterface.getSkinObject("Dialog", cfg.sclass);

        /**
         * Will contain the popup object.
         * @protected
         */
        this._popup = null;

        /**
         * Whether this widget requires default markup
         * @protected
         * @type Boolean
         */
        this._hasMarkup = false;

        /**
         * Id for event delegation on close icon
         * @type String
         */
        this._closeDelegateId = null;

        /**
         * Created when the dialog is movable
         * @type aria.utils.dragdrop.Drag
         */
        this._draggable = null;
        /**
         * The handles used for resizing the Dialog
         */
        this._handles = cfg.handles || "n-resize,s-resize,e-resize,w-resize,ne-resize,nw-resize,se-resize,sw-resize";

        this._handlesArr = this._handles.split(",");
        /**
         * Created when the dialog is resizable
         * @type aria.utils.Resize
         */
        this._resizable = {};

    },
    $destructor : function () {
        this.close();
        this.$Container.$destructor.call(this);
    },
    $statics : {
        MISSING_CONTENT_MACRO : "Missing contentMacro in Dialog configuration."
    },
    $prototype : {

        /**
         * Prototype init method called at prototype creation time Allows to store class-level objects that are shared
         * by all instances
         * @param {Object} p the prototype object being built
         * @param {Object} def the class definition
         * @param {Object} sdef the superclass class definition
         */
        $init : function (p, def, sdef) {
            // prototype initialization function
            // we add the bindable properties to the Widget prototype
            p.bindableProperties = p.bindableProperties.concat(["contentMacro", "visible"]);
        },

        /**
         * Manage the viewport resize event
         * @param {aria.DomEvent} event
         */
        _onViewportResized : function (event) {

            // Remove width and height, they will be recalculated later,
            // to have the content size wel calculated
            var domElt = this._domElt;
            domElt.style.width = "";
            domElt.style.height = "";

            // constraint dialog to viewport
            var viewport = aria.utils.Dom._getViewportSize();
            var math = aria.utils.Math;
            this._div.updateSize({
                height : this._cfg.height,
                maxHeight : math.min(this._cfg.maxHeight, viewport.height),
                width : this._cfg.width,
                maxWidth : math.min(this._cfg.maxWidth, viewport.width)
            });
            this._updateContainerSize();
        },

        /**
         * Check that a contentMacro is specified or bound to the dataModel
         * @param {aria.widgets.CfgBeans.DialogCfg} cfg
         */
        _checkCfgConsistency : function (cfg) {
            if (!("contentMacro" in cfg) && !("bind" in cfg && "contentMacro" in cfg.bind)) {
                this.$logError(this.MISSING_CONTENT_MACRO);
            }
            var appEnvDialogSettings = aria.widgets.environment.WidgetSettings.getWidgetSettings().dialog;
            if (!("movable" in cfg)) {
                cfg.movable = appEnvDialogSettings.movable;
            }
            if (!("movableProxy" in cfg)) {
                cfg.movableProxy = appEnvDialogSettings.movableProxy;
            }
        },

        /**
         * The main entry point into the Div begin markup. Here we check whether it is a Div, defined in the AriaSkin
         * object, that has an image that is repeated as a background.
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         * @protected
         */
        _widgetMarkupBegin : function (out) {
            var cfg = this._cfg;
            this._skipContent = (out.sectionState == out.SECTION_KEEP) || !cfg.visible;
            out.beginSection({
                id : "__dialog_" + this._domId
            });

            if (this._skipContent) {
                return;
            }

            var viewport = aria.utils.Dom._getViewportSize();

            // constraint dialog to viewport
            var math = aria.utils.Math;
            var maxHeight = math.min(this._cfg.maxHeight, viewport.height);
            var maxWidth = math.min(this._cfg.maxWidth, viewport.width);
            this._div = new aria.widgets.container.Div({
                sclass : this._skinObj.divsclass,
                block : true,
                margins : "0 0 0 0",
                cssClass : this._context.getCSSClassNames(true) + " " + this._cfg.cssClass,
                height : this._cfg.height,
                minHeight : this._cfg.minHeight,
                maxHeight : maxHeight,
                width : this._cfg.width,
                minWidth : this._cfg.minWidth,
                maxWidth : maxWidth,
                scrollBarX : this._cfg.scrollBarX,
                scrollBarY : this._cfg.scrollBarY
            }, this._context, this._lineNumber);

            out.registerBehavior(this._div);
            this._div.writeMarkupBegin(out);

            out.beginSection({
                id : "__dialogContent_" + this._domId,
                keyMap : [{
                            key : "ESCAPE",
                            callback : {
                                fn : this.actionClose,
                                scope : this
                            }
                        }]
            });

        },

        /**
         * The main entry point into the Div end markup. Here we check whether it is a Div, defined in the AriaSkin
         * object, that has an image that is repeated as a background.
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         * @protected
         */
        _widgetMarkupEnd : function (out) {
            var cfg = this._cfg;

            if (!this._skipContent) {
                out.endSection();
                this._div.writeMarkupEnd(out);
                // for resize handle markup
                if (cfg.resizable && this._handlesArr) {
                    var handles = this._handlesArr;
                    for (var i in handles) {
                        out.write(['<span class="xDialog_resizable xDialog_' + handles[i] + '">', '</span>'].join(''));
                    }
                }

                out.write(['<div class="xDialog_titleBar xDialog_', cfg.sclass, '_titleBar">'].join(''));
                if (cfg.icon) {
                    out.write(['<span class="xDialog_icon xDialog_', cfg.sclass, '_icon">'].join(''));
                    var icon = new aria.widgets.Icon({
                        icon : cfg.icon
                    }, this._context, this._lineNumber);
                    out.registerBehavior(icon);
                    icon.writeMarkup(out);
                    out.write('</span>');
                }
                out.write(['<span class="xDialog_title xDialog_', cfg.sclass, '_title">',
                        aria.utils.String.escapeHTML(cfg.title), '</span>'].join(''));
                if (cfg.closable) {
                    var utilsDelegate = aria.utils.Delegate;
                    this._closeDelegateId = utilsDelegate.add({
                        fn : this._onCloseBtnEvent,
                        scope : this
                    });
                    out.write(['<span class="xDialog_close xDialog_', cfg.sclass,
                            '_close" ' + utilsDelegate.getMarkup(this._closeDelegateId) + '>'].join(''));
                    var closeButton = new aria.widgets.Icon({
                        icon : this._skinObj.closeIcon
                    }, this._context, this._lineNumber);
                    out.registerBehavior(closeButton);
                    closeButton.writeMarkup(out);
                    out.write('</span>');
                }
                out.write("</div>");
            }
            out.endSection();
        },

        /**
         * Method called when the dialog is not used as a container
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         */
        _widgetMarkup : function (out) {
            this._widgetMarkupBegin(out);
            this._widgetMarkupEnd(out);
        },

        /**
         * FIXME: doc
         * @private
         */
        _writerCallback : function (out) {
            this._widgetMarkupBegin(out);
            if (this._cfg.contentMacro) {
                out.callMacro(this._cfg.contentMacro);
            }
            this._widgetMarkupEnd(out);
        },

        /**
         * OVERRIDE initWidget to allow display of dialog on init if visible is true
         */
        initWidget : function () {
            this.$Container.initWidget.apply(this, arguments);
            if (this._cfgOk) {
                this._checkCfgConsistency(this._cfg);
            }
            this._init();
        },

        /**
         * A method called when we initialize the object.
         * @protected
         */
        _init : function () {
            if (this.getProperty("visible")) {
                this.open();
            }
        },

        /**
         * Internal method called when one of the model property that the widget is bound to has changed Must be
         * overridden by sub-classes defining bindable properties
         * @param {String} propertyName the property name
         * @param {Object} newValue the new value
         * @param {Object} oldValue the old property value
         */
        _onBoundPropertyChange : function (propertyName, newValue, oldValue) {

            if (propertyName === "visible") {
                this._cfg.visible = newValue;
                if (newValue) {
                    this.open();
                } else {
                    this.close();
                }
            } else if (propertyName === "title") {
                this._cfg.title = newValue;
                if (this._titleDomElt) {
                    this._titleDomElt.innerHTML = newValue;
                }
            } else if (propertyName === "contentMacro") {
                this._cfg.contentMacro = newValue;
                if (this._popup) {
                    if (!this._popup.isOpen) {
                        this.open();
                    } else {
                        var args = {
                            outputSection : "__dialogContent_" + this._domId,
                            macro : newValue
                        };
                        this._context.$refresh(args);
                    }
                }
            } else if (propertyName === "xpos" || propertyName === "ypos") {
                this._cfg[propertyName] = newValue;
                this.setProperty("center", false);
                this.updatePosition();

            } else if (propertyName === "center") {
                this._cfg.center = newValue;
                this.updatePosition();
            } else {
                // delegate to parent class
                this.$Container._onBoundPropertyChange.apply(this, arguments);
            }
        },

        /**
         * Event handler for close button
         * @protected
         * @param {aria.DomEvent} event
         */
        _onCloseBtnEvent : function (event) {
            if (event.type == "click") {
                this.actionClose();
            }
        },

        /**
         * Action to close this popup, setting the appropriate value
         */
        actionClose : function () {
            var cb = this._cfg.onCloseClick;
            var cancelDefault = false;
            if (cb) {
                var params = {
                    cancelDefault : true
                };
                this.evalCallback(cb, params);
                cancelDefault = params.cancelDefault;
            }
            if (!cancelDefault) {
                this.changeProperty("visible", false);
            }
        },

        /**
         * Creates and displays the popup.
         */
        open : function () {
            var cfg = this._cfg;
            var refreshParams = {
                filterSection : "__dialog_" + this._domId,
                writerCallback : {
                    fn : this._writerCallback,
                    scope : this
                }
            };

            var section = this._context.getRefreshedSection(refreshParams);
            var popup = new aria.popups.Popup();
            this._popup = popup;
            popup.$on({
                "onAfterOpen" : this._onAfterPopupOpen,
                scope : this
            });

            // global navigation is disable is the case of a modal dialog
            if (this._cfg.modal) {
                var navManager = aria.templates.NavigationManager;
                navManager.addGlobalKeyMap({
                    key : "ESCAPE",
                    modal : true,
                    callback : {
                        fn : this.actionClose,
                        scope : this
                    }
                });

                navManager.setModalBehaviour(true);
            }

            popup.open({
                section : section,
                keepSection : true,
                absolutePosition : {
                    left : cfg.xpos,
                    top : cfg.ypos
                },
                center : cfg.center,
                modal : cfg.modal,
                closeOnMouseClick : false,
                closeOnMouseScroll : false,
                parentDialog : this
            });

            aria.templates.Layout.$on({
                "viewportResized" : this._onViewportResized,
                scope : this
            });
        },

        /**
         * Is called right after the popup is displayed.
         */
        _onAfterPopupOpen : function () {
            var cfg = this._cfg;
            var getDomElementChild = aria.utils.Dom.getDomElementChild;
            this._domElt = this._popup.domElement;
            this._titleBarDomElt = getDomElementChild(this._domElt, 0, true);
            this._titleDomElt = getDomElementChild(this._titleBarDomElt, cfg.icon ? 1 : 0);
            this._calculatePosition();
            if (cfg.modal) {
                aria.templates.NavigationManager.focusFirst(this._domElt);
            }

            this.evalCallback(cfg.onOpen);

            if (cfg.movable) {
                Aria.load({
                    classes : ["aria.utils.dragdrop.Drag"],
                    oncomplete : {
                        fn : this._createDraggable,
                        scope : this
                    }
                });
            }

            if (cfg.resizable) {
                Aria.load({
                    classes : ["aria.utils.resize.Resize"],
                    oncomplete : {
                        fn : this._createResize,
                        scope : this
                    }
                });
            }
        },

        /**
         * Hides and destroys the dialog
         */
        close : function () {
            var cfg = this._cfg;
            if (this._popup) {

                if (cfg.movable) {
                    this._destroyDraggable();
                }

                if (cfg.resizable) {
                    this._destroyResizable();
                }

                this._domElt = null;
                this._titleBarDomElt = null;
                this._titleDomElt = null;
                if (this._closeDelegateId) {
                    aria.utils.Delegate.remove(this._closeDelegateId);
                }
                this._popup.close();
                this._popup.$dispose();
                this._popup = null;

                // restore globalKeyMap
                if (cfg.modal) {
                    var navManager = aria.templates.NavigationManager;
                    navManager.removeGlobalKeyMap({
                        key : "ESCAPE",
                        modal : true,
                        callback : {
                            fn : this.actionClose,
                            scope : this
                        }
                    });
                    navManager.setModalBehaviour(false);
                }
                aria.templates.Layout.$removeListeners({
                    "viewportResized" : this._onViewportResized,
                    scope : this
                });
            }
        },

        /**
         * Override _updateContainerSize from superclass to add popup refresh
         */
        _updateContainerSize : function () {
            this.$Container._updateContainerSize.call(this);
            this.updatePosition();
        },

        /**
         * Move the popup to the current position if it is visible
         */
        updatePosition : function () {
            if (this._popup && this._popup.isOpen) {
                this._popup.moveTo({
                    center : this._cfg.center,
                    absolutePosition : {
                        left : this._cfg.xpos,
                        top : this._cfg.ypos,
                        height : this._cfg.height,
                        width : this._cfg.width
                    }
                });
                this._calculatePosition();
            }
        },

        /**
         * Compute the actual position of the popup and update the data model with the correct values
         */
        _calculatePosition : function () {
            var position = aria.utils.Dom.calculatePosition(this._domElt);
            this.setProperty("xpos", position.left);
            this.setProperty("ypos", position.top);
        },
        /**
         * Computes the size of the popup and update the data model with the updated values
         */
        _calculateSize : function () {
            var position = aria.utils.Dom.getGeometry(this._domElt);
            this.setProperty("height", position.height);
            this.setProperty("width", position.width);
        },

        /**
         * Create the Drag element with the specified configuration
         * @protected
         */
        _createDraggable : function () {
            this._draggable = new aria.utils.dragdrop.Drag(this._domElt, {
                handle : this._titleBarDomElt,
                cursor : "move",
                proxy : this._cfg.movableProxy,
                constrainTo : aria.utils.Dom.VIEWPORT
            });
            this._draggable.$on({
                "dragstart" : {
                    fn : this._onDragStart,
                    scope : this
                },
                "move" : {
                    fn : this._onDragMove,
                    scope : this
                },
                "dragend" : {
                    fn : this._onDragEnd,
                    scope : this
                }
            });
        },
        /**
         * Creates the Resize element with all the resize handle element.
         */
        _createResize : function () {

            if (this._handlesArr) {
                var handleArr = this._handlesArr, index = 0, parent = this._domElt, getDomElementChild = aria.utils.Dom.getDomElementChild;
                for (var i in handleArr) {
                    var handleElement = getDomElementChild(parent, ++index, false), axis = null, cursor;
                    cursor = handleArr[i];
                    if (cursor == "n-resize" || cursor == "s-resize") {
                        axis = "y";
                    }
                    if (cursor == "w-resize" || cursor == "e-resize") {
                        axis = "x";
                    }
                    this._resizable[cursor] = new aria.utils.resize.Resize(this._domElt, {
                        handle : handleElement,
                        cursor : cursor,
                        axis : axis
                    });
                    this._resizable[cursor].$on({
                        "beforeresize" : {
                            fn : this._onResizeStart,
                            scope : this
                        },
                        "resize" : {
                            fn : this._onResizing,
                            scope : this
                        },
                        "resizeend" : {
                            fn : this._onResizeEnd,
                            scope : this
                        }
                    });
                }
            }
        },

        /**
         * Internal handler for the "dragstart" event raised by the Drag instance
         * @protected
         */
        _onDragStart : function () {
            this.evalCallback(this._cfg.ondragstart);
        },

        /**
         * Internal handler for the "move" event raised by the Drag instance. Refresh the processing indicators on the
         * popup when no proxy is used
         * @protected
         */
        _onDragMove : function () {
            if (!this._cfg.movableProxy && this._popup) {
                this._popup.refreshProcessingIndicators();
            }
        },

        /**
         * Internal handler for the "dragend" event raised by the Drag instance. Refresh the data model with the new
         * position
         * @protected
         */
        _onDragEnd : function () {
            //this.updatePosition();
            if (this._popup) {
                this._popup.refreshProcessingIndicators();
            }
            this.setProperty("center", false);
            this._calculatePosition();
            this.updatePosition();
            this.evalCallback(this._cfg.ondragend);
        },

        /**
         * Internal handler for the "beforeresize" event raised by the Drag instance on resize handler
         * @protected
         */
        _onResizeStart : function () {
            this.evalCallback(this._cfg.beforeresize);
        },

        /**
         * Internal handler for the "move" event raised by the Drag instance on resize handler. Refresh the processing
         * indicators on the popup when no proxy is used
         * @protected
         */
        _onResizing : function () {
            if (this._popup) {
                this._popup.refreshProcessingIndicators();
            }
        },

        /**
         * Internal handler for the "resizeend " event raised by the Drag instance on refresh handler. Refresh the data
         * model with the new position and reopen the popup
         * @protected
         */
        _onResizeEnd : function () {
            this._calculatePosition();
            this._calculateSize();
            this.setProperty("center", false);
            if (this._popup) {
                this.close();
                this.open();
                this._popup.refreshProcessingIndicators();
            }
            this.evalCallback(this._cfg.resizeend);
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
                "move" : {
                    fn : this._onDragMove,
                    scope : this
                },
                "dragend" : {
                    fn : this._onDragEnd,
                    scope : this
                }
            });
            this._draggable.$dispose();
            this._draggable = null;
        },
        /**
         * Remove listeners and dispose the resize instance
         * @protected
         */
        _destroyResizable : function () {
            var handleArr = this._handlesArr
            for (var i in handleArr) {
                var cursor = handleArr[i];
                this._resizable[cursor].$dispose();
                this._resizable[cursor] = null;
            }

        }

    }
});