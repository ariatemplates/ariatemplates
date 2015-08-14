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
 */
Aria.classDefinition({
    $classpath : "aria.widgets.container.Dialog",
    $extends : "aria.widgets.container.Container",
    $dependencies : ["aria.widgets.container.Div", "aria.popups.Popup", "aria.widgets.Icon", "aria.utils.Dom",
            "aria.utils.Function", "aria.utils.Delegate", "aria.templates.NavigationManager", "aria.utils.String",
            "aria.utils.Math", "aria.templates.Layout", "aria.popups.container.Manager"],
    $css : ["aria.widgets.container.DialogStyle"],

    /**
     * Dialog constructor
     * @param {aria.widgets.CfgBeans:DialogCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     */
    $constructor : function (cfg, ctxt) {
        this.$Container.constructor.apply(this, arguments);
        this._skinObj = aria.widgets.AriaSkinInterface.getSkinObject(this._skinnableClass, cfg.sclass);

        /**
         * Will contain the popup object.
         * @protected
         */
        this._popup = null;

        /**
         * Will contain the popup container object.
         * @protected
         */
        this._popupContainer = null;

        /**
         * Whether this widget requires default markup
         * @protected
         * @type Boolean
         */
        this._hasMarkup = false;

        /**
         * Indicates if Dialog is written as a container (to know whether to log a deprecation warning)
         * @protected
         * @type Boolean
         */
        this._container = true;

        /**
         * Id for event delegation on close icon
         * @protected
         * @type String
         */
        this._closeDelegateId = null;

        /**
         * Id for event delegation on maximize icon
         * @protected
         * @type String
         */
        this._maximizeDelegateId = null;

        /**
         * Created when the dialog is movable
         * @protected
         * @type aria.utils.dragdrop.Drag
         */
        this._draggable = null;

        var handles = cfg.handles || "n-resize,s-resize,e-resize,w-resize,ne-resize,nw-resize,se-resize,sw-resize";
        /**
         * The handles used for resizing the Dialog
         * @type Array
         * @protected
         */
        this._handlesArr = handles.split(",");

        /**
         * Created when the dialog is resizable
         * @protected
         * @type aria.utils.Resize
         */
        this._resizable = null;

        /**
         * Used when enabling maximized mode, to revert the settings when unmaximized. Initiated also in the open
         * method in case if the Dialog is maximized from the start.
         * @type Object
         * @protected
         */
        this._optionsBeforeMaximize = null;

        /**
         * Shadow values are used in maximized mode to position the Dialog properly without shadow being visible.
         */
        this._shadows = {
            left : this._skinObj.shadowLeft || 0,
            top : this._skinObj.shadowTop || 0,
            right : this._skinObj.shadowRight || 0,
            bottom : this._skinObj.shadowBottom || 0
        };

        /**
         * Offsets used by the Popup when maximized mode is off.
         */
        this._shadowsZero = {
            left : 0,
            top : 0,
            right : 0,
            bottom : 0
        };

        /**
         * Current width when in maximized mode. _cfg.width is left untouched when maximizing.
         * @type Integer
         */
        this._cfg.widthMaximized = null;

        /**
         * Current height when in maximized mode. _cfg.height is left untouched when maximizing.
         * @type Integer
         */
        this._cfg.heightMaximized = null;
    },
    $destructor : function () {
        this.close();
        this.$Container.$destructor.call(this);
    },
    $statics : {
        CONTAINER_USAGE_DEPRECATED : "%1The usage as a container {@aria:Dialog}{/@aria:Dialog} is deprecated; use the {@aria:Dialog /} syntax instead.",
        /* BACKWARD-COMPATIBILITY-BEGIN GH-687 */
        INCONSISTENT_MACRO_CONTENTMACRO_USAGE : "%1Please consistently use either 'macro' or 'contentMacro' in cfg and cfg.bind in the Dialog configuration and do not mix them.",
        CONTENTMACRO_DEPRECATED : "%1The 'contentMacro' property in Dialog configuration has been deprecated in favor of 'macro'.",
        /* BACKWARD-COMPATIBILITY-END GH-687 */
        MISSING_CONTENT_MACRO : "%1Missing 'macro' in Dialog configuration."
    },
    $prototype : {
        /**
         * Skinnable class to use for this widget.
         * @protected
         * @type String
         */
        _skinnableClass : "Dialog",

        /**
         * Manage the viewport resize event
         * @param {aria.DomEvent} event
         * @protected
         */
        _onViewportResized : function (event) {
            var containerSize = this._popupContainer.getClientSize();
            if (containerSize.width <= 0 || containerSize.height <= 0) {
                // do nothing if the container is not visible
                return;
            }

            var domElt = this._domElt;
            var maximized = this._cfg.maximized;

            if (domElt) {
                // Remove width and height, they will be recalculated later, to have the content size well calculated
                domElt.style.width = "";
                domElt.style.height = "";

                // constrain dialog to containerSize
                this._updateDivSize(containerSize);
                this._updateContainerSize();
            }

            if (maximized) {
                this._setMaximizedHeightAndWidth(containerSize);
            }
        },
        /* BACKWARD-COMPATIBILITY-BEGIN GH-687 */
        /**
         * Register listeners for the bindings associated to this widget
         * @protected
         */
        _registerBindings : function () {
            // Make 'macro' behave like an alias for 'contentMacro' for consistency with other widgets
            // Handle this before registering the bindings, not to have improper/duplicate bindings defined.
            // Store things inside "macro" internally instead of "contentMacro" for future-proofness
            var cfg = this._cfg;
            var bindCfg = cfg.bind;
            var logWarning = false;

            // Note that bound and not-bound property are not mutually exclusive;
            // i.e. there can be both .macro and .bind.macro defined at the same time.
            if (cfg.contentMacro && !cfg.macro) {
                cfg.macro = cfg.contentMacro;
                logWarning = true;
                delete cfg.contentMacro;
            }

            if (bindCfg && bindCfg.contentMacro && !bindCfg.macro) {
                bindCfg.macro = bindCfg.contentMacro;
                logWarning = true;
                delete bindCfg.contentMacro;
            }
            if (logWarning) {
                this.$logWarn(this.CONTENTMACRO_DEPRECATED);
            }
            this.$Container._registerBindings.call(this);
        },
        /* BACKWARD-COMPATIBILITY-BEGIN END-687 */

        /**
         * Check that a contentMacro is specified or bound to the dataModel
         * @param {aria.widgets.CfgBeans:DialogCfg} cfg
         * @protected
         */
        _checkCfgConsistency : function (cfg) {
            // Note also some related operations are done beforehand, in _registerBindings
            if (!("macro" in cfg) && !("bind" in cfg && "macro" in cfg.bind)) {
                this.$logError(this.MISSING_CONTENT_MACRO);
            }
            /* BACKWARD-COMPATIBILITY-BEGIN GH-687 */
            // They shouldn't be here anymore; if defined, they should've been replaced with "macro" in
            // _registerBindings. If they're still present, it means the user mixes "macro" and "contentMacro" usage
            if (("contentMacro" in cfg) || ("bind" in cfg && "contentMacro" in cfg.bind)) {
                this.$logError(this.INCONSISTENT_MACRO_CONTENTMACRO_USAGE);
            }
            /* BACKWARD-COMPATIBILITY-END GH-687 */
            var appEnvDialogSettings = aria.widgets.environment.WidgetSettings.getWidgetSettings().dialog;
            if (!("movable" in cfg)) {
                cfg.movable = appEnvDialogSettings.movable;
            }
            if (!("movableProxy" in cfg)) {
                cfg.movableProxy = appEnvDialogSettings.movableProxy;
            }
        },

        /**
         * Widget markup starts here
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         * @protected
         */
        _widgetMarkupBegin : function (out) {
            if (this._container) {
                // Dialog's usage as a container doesn't really make sense at all and probably no one uses that;
                // it still needs 'contentMacro' defined, and if anything is present between
                // {@aria:Dialog}{/@aria:Dialog}, it will be flushed to the HTML.
                this.$logWarn(this.CONTAINER_USAGE_DEPRECATED);
            }
            out.beginSection({
                id : "__dialog_" + this._domId
            });
        },

        /**
         * Widget markup ends here
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         * @protected
         */
        _widgetMarkupEnd : function (out) {
            out.endSection();
        },

        /**
         * Used to flush close / maximize buttons into the markup.
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         * @param {String} delegateId
         * @param {String} cssClassPostfix
         * @param {String} skinIcon
         */
        __writeTitlebarButton : function (out, delegateId, cssClassPostfix, skinIcon) {
            var cfg = this._cfg;
            // Adding atdraggable="" to make sure clicking on the button does not start the drag operation
            // Using the atdraggable attribute directly instead of the aria.utils.Mouse.DRAGGABLE_ATTRIBUTE
            // variable because aria.utils.Mouse may not be loaded yet.
            out.write(['<span atdraggable="" class="x', this._skinnableClass, '_', cssClassPostfix, ' x',
                    this._skinnableClass, '_', cfg.sclass, '_', cssClassPostfix, '" ',
                    aria.utils.Delegate.getMarkup(delegateId), '>'].join(''));
            var button = new aria.widgets.Icon({
                icon : this._skinObj[skinIcon]
            }, this._context, this._lineNumber);
            out.registerBehavior(button);
            button.writeMarkup(out);
            out.write('</span>');
        },

        /**
         * Method called when the dialog is not used as a container
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         */
        _widgetMarkup : function (out) {
            this._container = false;
            this._widgetMarkupBegin(out);
            this._widgetMarkupEnd(out);
        },

        /**
         * Callback called when the dialog's main section is refreshed
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         * @private
         */
        _writerCallback : function (out) {
            var cfg = this._cfg;

            var containerSize = this._popupContainer.getClientSize();

            // constrain dialog to containerSize
            var math = aria.utils.Math;
            var maxHeight, maxWidth;
            if (this._cfg.maximized) {
                maxHeight = containerSize.height + this._shadows.top + this._shadows.bottom;
                maxWidth = containerSize.width + this._shadows.left + this._shadows.right;
            } else {
                maxHeight = math.min(this._cfg.maxHeight, containerSize.height);
                maxWidth = math.min(this._cfg.maxWidth, containerSize.width);
            }
            this._div = new aria.widgets.container.Div({
                sclass : this._skinObj.divsclass,
                margins : "0 0 0 0",
                block : true,
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

            if (this._cfg.macro) {
                out.callMacro(this._cfg.macro);
            }

            out.endSection();

            this._div.writeMarkupEnd(out);
            // for resize handle markup
            if (cfg.resizable && this._handlesArr) {
                var handles = this._handlesArr;
                for (var i = 0, ii = handles.length; i < ii; i++) {
                    out.write(['<span class="x', this._skinnableClass, '_resizable xDialog_' + handles[i] + '">',
                            '</span>'].join(''));
                }
            }

            out.write(['<div class="xDialog_titleBar x', this._skinnableClass, '_', cfg.sclass, '_titleBar">'].join(''));
            if (cfg.icon) {
                out.write(['<span class="xDialog_icon x', this._skinnableClass, '_', cfg.sclass, '_icon">'].join(''));
                var icon = new aria.widgets.Icon({
                    icon : cfg.icon
                }, this._context, this._lineNumber);
                out.registerBehavior(icon);
                icon.writeMarkup(out);
                out.write('</span>');
            }
            out.write(['<span class="x', this._skinnableClass, '_title x', this._skinnableClass, '_', cfg.sclass,
                    '_title">', aria.utils.String.escapeHTML(cfg.title), '</span>'].join(''));

            // buttons are floated to the right, so close should be first in the markup
            if (cfg.closable) {
                this._closeDelegateId = aria.utils.Delegate.add({
                    fn : this._onCloseBtnEvent,
                    scope : this
                });
                this.__writeTitlebarButton(out, this._closeDelegateId, "close", "closeIcon");
            }
            if (cfg.maximizable) {
                this._maximizeDelegateId = aria.utils.Delegate.add({
                    fn : this._onMaximizeBtnEvent,
                    scope : this
                });
                this.__writeTitlebarButton(out, this._maximizeDelegateId, "maximize", "maximizeIcon");
            }
            out.write("</div>");

        },

        /**
         * initWidget to allow display of dialog on init if visible is true
         * @override
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
            if (this.getProperty("visible") && this._cfgOk) {
                this.open();
            }
        },

        /**
         * Internal method called when one of the model property that the widget is bound to has changed. Must be
         * overridden by sub-classes defining bindable properties
         * @param {String} propertyName the property name
         * @param {Object} newValue the new value
         * @param {Object} oldValue the old property value
         * @protected
         * @override
         */
        _onBoundPropertyChange : function (propertyName, newValue, oldValue) {

            if (propertyName === "visible") {
                this._cfg.visible = newValue;
                if (newValue) {
                    this.open();
                } else {
                    this.close();
                }
            } else if (propertyName === "movable") {
                this._cfg.movable = newValue;
                if (this._popup && this._popup.isOpen) {
                    if (newValue) {
                        this._loadAndCreateDraggable();
                    } else {
                        this._destroyDraggable();
                    }
                }
            } else if (propertyName === "title") {
                this._cfg.title = newValue;
                if (this._titleDomElt) {
                    this._titleDomElt.innerHTML = newValue;
                    this._onDimensionsChanged();
                }
            } else if (propertyName === "macro") {
                this._cfg.macro = newValue;
                if (this._popup) {
                    if (!this._popup.isOpen) {
                        this.open();
                    } else {
                        var args = {
                            section : "__dialogContent_" + this._domId,
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
            } else if (propertyName === "maximized") {
                this._toggleMaximize(newValue);
            } else if (propertyName === "width" || propertyName === "height") {
                this._onDimensionsChanged(false);
            } else {
                // delegate to parent class
                this.$Container._onBoundPropertyChange.apply(this, arguments);
            }
        },

        /**
         * Update the size and position if needed, in reaction to width/height change.
         * @param {Boolean} forceInMaximizedMode By default in maximized mode, bound width/height change is ignored,
         * however when entering maximized mode, width and height have to be changed using the same binding mechanism.
         * Hence it is necessary there to pass true to force proceeding.
         */
        _onDimensionsChanged : function (forceInMaximizedMode) {
            if (!this._domElt) { // if the Dialog has never been visible so far
                return;
            }
            if (this._cfg.maximized && !forceInMaximizedMode) {
                return;
            }

            this._updateDivSize(this._popupContainer.getClientSize());
            if (this._cfg.center) {
                this.updatePosition();
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
         * Event handler for maximize button
         * @protected
         * @param {aria.DomEvent} event
         */
        _onMaximizeBtnEvent : function (event) {
            if (event.type == "click") {
                this.actionToggleMaximize();
            }
        },

        /**
         * Action to close this popup, setting the appropriate value
         */
        actionClose : function () {
            this._actionFromTitlebarButton("onCloseClick", "visible", false);
        },

        /**
         * Action to maximize/unmaximize this popup, setting the appropriate value
         */
        actionToggleMaximize : function () {
            this._actionFromTitlebarButton("onMaximizeClick", "maximized", !this._cfg.maximized);
        },

        /**
         * Shared code for close / maximize buttons. Execute the callback and set appropriate config value.
         * @param {String} cbName Callback name to execute, if exists
         * @param {String} propName Name of the property to change
         * @param {Boolean} propNewVal New value of the changed property
         * @protected
         */
        _actionFromTitlebarButton : function (cbName, propName, propNewVal) {
            var cb = this._cfg[cbName];
            var cancelDefault = false;
            if (cb) {
                var params = {
                    cancelDefault : true
                };
                this.evalCallback(cb, params);
                cancelDefault = params.cancelDefault;
            }
            if (!cancelDefault) {
                this.changeProperty(propName, propNewVal);
            }
        },

        /**
         * Creates and displays the popup.
         */
        open : function () {
            var cfg = this._cfg;
            var refreshParams = {
                section : "__dialog_" + this._domId,
                writerCallback : {
                    fn : this._writerCallback,
                    scope : this
                }
            };

            var popupContainer = aria.popups.container.Manager.createPopupContainer(cfg.container);
            this._popupContainer = popupContainer;

            // store current options to reapply them when unmaximized
            this._optionsBeforeMaximize = this._createOptionsBeforeMaximize(cfg);

            var section = this._context.getRefreshedSection(refreshParams);
            var popup = new aria.popups.Popup();
            this._popup = popup;
            popup.$on({
                "onAfterOpen" : this._onAfterPopupOpen,
                "onEscape" : this.actionClose,
                "onAfterClose" : this._onAfterPopupClose,
                scope : this
            });
            if (cfg.closeOnMouseClick) {
                popup.$on({
                    "onMouseClickClose" : this._onMouseClickClose,
                    scope : this
                });
            }
            popup.open({
                section : section,
                keepSection : true,
                absolutePosition : {
                    left : cfg.xpos,
                    top : cfg.ypos
                },
                center : cfg.center,
                maximized : cfg.maximized,
                offset : cfg.maximized ? this._shadows : this._shadowsZero,
                modal : cfg.modal,
                maskCssClass : "xDialogMask",
                popupContainer : popupContainer,
                closeOnMouseClick : cfg.closeOnMouseClick,
                closeOnMouseScroll : false,
                parentDialog : this
            });

            // must be registered before we check for _cfg.maximized, to fire the event correctly after overflow change
            aria.templates.Layout.$on({
                "viewportResized" : this._onViewportResized,
                scope : this
            });

            // in case when bound "maximized" was toggled while Dialog was not visible
            if (this._cfg.maximized) {
                this._setContainerOverflow("hidden");
                this._setMaximizedHeightAndWidth();
            }
        },

        /**
         * Is called right after the popup is displayed.
         */
        _onAfterPopupOpen : function () {
            var cfg = this._cfg;
            var getDomElementChild = aria.utils.Dom.getDomElementChild;
            this._domElt = this._popup.domElement;
            var titleBarDomElt = this._titleBarDomElt = getDomElementChild(this._domElt, 0, true);
            this._titleDomElt = getDomElementChild(titleBarDomElt, cfg.icon ? 1 : 0);
            this._onDimensionsChanged();

            this._calculatePosition();

            if (cfg.modal) {
                aria.templates.NavigationManager.focusFirst(this._domElt);
            }

            aria.core.Timer.addCallback({
                fn : function () {
                    this.evalCallback(cfg.onOpen);
                },
                scope : this,
                delay : 4
            });

            if (cfg.maximized) {
                return; // don't create movable nor resizable
            }

            if (cfg.movable) {
                this._loadAndCreateDraggable();
            }

            if (cfg.resizable) {
                this._loadAndCreateResizable();
            }
        },

        /**
         * Create the Drag element; load the dependency before if not loaded yet.
         */
        _loadAndCreateDraggable : function () {
            if (aria.utils.dragdrop && aria.utils.dragdrop.Drag) {
                this._createDraggable();
            } else {
                Aria.load({
                    classes : ["aria.utils.dragdrop.Drag"],
                    oncomplete : {
                        fn : this._createDraggable,
                        scope : this
                    }
                });
            }
        },

        /**
         * Create the Resize element; load the dependency before if not loaded yet.
         */
        _loadAndCreateResizable : function () {
            if (aria.utils.resize && aria.utils.resize.Resize) {
                this._createResize();
            } else {
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
         * Is called right after the popup is closed.
         */
        _onMouseClickClose : function () {
            // forces the blur on the active input to store its value in the data model
            aria.utils.Delegate.delegate(aria.DomEvent.getFakeEvent('blur', Aria.$window.document.activeElement));
            this.actionClose();
        },

        /**
         * Hides and destroys the dialog
         */
        close : function () {
            var cfg = this._cfg;
            if (this._popup) {

                this._destroyDraggable();
                this._destroyResizable();

                if (cfg.maximized) {
                    this._setContainerOverflow(this._optionsBeforeMaximize.containerOverflow);
                }

                this._domElt = null;
                this._titleBarDomElt = null;
                this._titleDomElt = null;
                if (this._closeDelegateId) {
                    aria.utils.Delegate.remove(this._closeDelegateId);
                }
                if (this._maximizeDelegateId) {
                    aria.utils.Delegate.remove(this._maximizeDelegateId);
                }

                this._popup.close();
                this._popup.$unregisterListeners(this);
                this._popup.$dispose();
                this._popup = null;
                aria.popups.container.Manager.releasePopupContainer(this._popupContainer);
                this._popupContainer = null;

                aria.templates.Layout.$removeListeners({
                    "viewportResized" : this._onViewportResized,
                    scope : this
                });
            }
        },

        /**
         * Is called when the popup has been closed.
         */
        _onAfterPopupClose : function () {
            this.evalCallback(this._cfg.onClose);
        },

        /**
         * Override _updateContainerSize from superclass to add popup refresh
         */
        _updateContainerSize : function () {
            this.$Container._updateContainerSize.call(this);
            this.updatePosition();
        },

        /**
         * Calculate proper maxWidth/maxHeight depending if in maximized mode or not, and call the Div in which the
         * current Dialog is embedded to update its size accordingly.
         * @param {aria.utils.DomBeans:Size} containerSize
         * @protected
         */
        _updateDivSize : function (containerSize) {
            var cfg = this._cfg;
            var math = aria.utils.Math;

            var maxHeight, maxWidth;
            if (this._cfg.maximized) {
                maxHeight = containerSize.height + this._shadows.top + this._shadows.bottom;
                maxWidth = containerSize.width + this._shadows.left + this._shadows.right;
            } else {
                maxHeight = math.min(this._cfg.maxHeight, containerSize.height);
                maxWidth = math.min(this._cfg.maxWidth, containerSize.width);
            }

            var titleBarDomElt = this._titleBarDomElt;
            var titleDomElt = this._titleDomElt;

            var isIE7 = aria.core.Browser.isIE7;
            if (isIE7) {
                // without this, IE 7 gives wrong inner sizes
                titleDomElt.style.overflow = "visible";
            }

            titleDomElt.style.width = "";
            var titleWidth = titleDomElt.offsetWidth;
            var titleBarPaddings = aria.utils.Dom.getStylePx(titleBarDomElt, "paddingLeft", 0) + aria.utils.Dom.getStylePx(titleBarDomElt, "paddingRight",0);
            var childNodes = titleBarDomElt.childNodes;
            var iconsWidth = 0;
            for (var i = 0, ii = childNodes.length; i < ii; i++) {
                var node = childNodes[i];
                iconsWidth += node !== titleDomElt ? node.offsetWidth : 0;
            }

            // First manage the width of the modal depending on the title bar and the max width
            var shadows = this._shadows;
            var minWidth = math.max(cfg.width, cfg.minWidth);
            if (cfg.width == -1) {
                minWidth = math.max(titleBarPaddings + titleWidth + iconsWidth + shadows.left + shadows.right, minWidth);
            }

            // if maximized == true, then height|widthMaximized will be used; otherwise normal width and height
            this._div.updateSize({
                maxHeight : maxHeight,
                maxWidth : maxWidth,
                minWidth : minWidth,
                height : cfg.height,
                width : cfg.width,
                heightMaximized : cfg.heightMaximized,
                widthMaximized : cfg.widthMaximized,
                maximized : cfg.maximized
            });

            // The manage the title length to manage the text-overflow
            var titleBarInnerWidth = titleBarDomElt.clientWidth - titleBarPaddings;
            var titlePaddings = aria.utils.Dom.getStylePx(titleDomElt, "paddingLeft", 0) + aria.utils.Dom.getStylePx(titleDomElt, "paddingRight", 0);
            titleDomElt.style.width = math.max(titleBarInnerWidth - titlePaddings - iconsWidth - shadows.left - shadows.right - 1, 0) + "px";

            if (isIE7) {
                // Back to overflow hidden mode
                titleDomElt.style.overflow = "hidden";
            }

        },

        /**
         * Move the popup to the current position if it is visible
         */
        updatePosition : function () {
            if (this._popup && this._popup.isOpen) {
                this._popup.moveTo({
                    center : this._cfg.center,
                    absolutePosition : {
                        left : this._cfg.xpos, // in maximized mode, positioning is handled by the Popup itself
                        top : this._cfg.ypos,
                        height : this._cfg.maximized ? this._cfg.heightMaximized : this._cfg.height,
                        width : this._cfg.maximized ? this._cfg.widthMaximized : this._cfg.width
                    }
                });
                this._calculatePosition();
            }
        },

        /**
         * Compute the actual position of the popup and update the data model with the correct values
         */
        _calculatePosition : function () {
            if (!this._cfg.maximized) { // in maximized mode, positioning is handled by the Popup itself
                var position = this._popupContainer.calculatePosition(this._domElt);
                this.setProperty("xpos", position.left);
                this.setProperty("ypos", position.top);
            }
        },
        /**
         * Computes the size of the popup and update the data model with the updated values
         */
        _calculateSize : function () {
            var domElt = this._domElt;
            this.setProperty("height", domElt.offsetHeight);
            this.setProperty("width", domElt.offsetWidth);
        },

        /**
         * Turn maximize feature on or off.
         * @param {Boolean} newValue true to toggle on
         */
        _toggleMaximize : function (newValue) {
            this._cfg.maximized = newValue;
            if (newValue === true) {
                this._toggleMaximizeOn();
            } else {
                this._toggleMaximizeOff();
            }
        },

        /**
         * Maximize the Dialog if visible. Destroy the features that are not meant to work in maximized mode
         * (movability, resizability). Store all prior configuration options to restore later when unmaximized.
         */
        _toggleMaximizeOn : function () {
            // store current options to reapply them when unmaximized
            this._optionsBeforeMaximize = this._createOptionsBeforeMaximize(this._cfg);

            this.setProperty("center", false);
            this.setProperty("maxWidth", null);
            this.setProperty("maxHeight", null);
            if (this._popup && this._popup.isOpen) {
                // proceed with maximization
                this._popup.conf.maximized = true;
                this._popup.conf.offset = this._shadows;

                this._setContainerOverflow("hidden");
                this._setMaximizedHeightAndWidth();

                this._destroyResizable();
                this._destroyDraggable();
            }
        },

        /**
         * Unmaximize the Dialog. Reapply all the original options stored before maximizing.
         */
        _toggleMaximizeOff : function () {
            var opts = this._optionsBeforeMaximize;
            if (!opts) {
                return;
            }

            // reapply the old options
            if (this._popup) {
                this._popup.conf.maximized = false;
                this._popup.conf.offset = this._shadowsZero;
                this._setContainerOverflow(opts.containerOverflow);
            }

            // using setProperty instead of changeProperty for performance reasons; hence need to explicitly invoke
            // _onDimensionsChanged and updatePosition, instead of relying on onBoundPropertyChange
            this.setProperty("maxWidth", opts.maxWidth);
            this.setProperty("maxHeight", opts.maxHeight);
            this.setProperty("width", opts.width);
            this.setProperty("height", opts.height);
            this.setProperty("heightMaximized", null);
            this.setProperty("widthMaximized", null);
            this._onDimensionsChanged(false);

            if (opts.center) {
                this.setProperty("center", true);
            } else {
                this.setProperty("xpos", opts.xpos);
                this.setProperty("ypos", opts.ypos);
            }
            this.updatePosition();

            if (this._popup && this._popup.isOpen) {
                if (this._cfg.resizable) {
                    this._loadAndCreateResizable();
                }
                if (this._cfg.movable) {
                    this._loadAndCreateDraggable();
                }
            }
        },

        /**
         * Returns the subset of config options which might be useful to restore the Dialog from maximized state.
         * @param {aria.widgets.CfgBeans:DialogCfg} cfg the widget configuration
         * @return {Object}
         */
        _createOptionsBeforeMaximize : function (cfg) {
            return {
                center : cfg.center,
                width : cfg.width,
                height : cfg.height,
                maxWidth : cfg.maxWidth,
                maxHeight : cfg.maxHeight,
                xpos : cfg.xpos,
                ypos : cfg.ypos,
                containerOverflow : this._popupContainer ? this._popupContainer.getContainerOverflow() : ""
            };
        },

        /**
         * Set overflow on the container element and calls _onViewportResized.
         * @param {String} newValue Any value accepted by CSS "overflow" property
         */
        _setContainerOverflow : function (newValue) {
            this._popupContainer.changeContainerOverflow(newValue);
            // need to explicitly raise viewportResized so that maxwidth/maxheight constraints are recalculated
            this._onViewportResized();
        },

        /**
         * Special function to resize the widget in the maximized mode, to fill the whole container and include shadows
         * (thus resize to more than the real size of the container; the shadows will be off the container and therefore
         * invisible)
         * @param {aria.utils.DomBeans:Size} containerSize
         */
        _setMaximizedHeightAndWidth : function (containerSize) {
            if (!containerSize) {
                containerSize = this._popupContainer.getClientSize();
            }
            var newHeight = containerSize.height + this._shadows.top + this._shadows.bottom;
            var newWidth = containerSize.width + this._shadows.left + this._shadows.right;

            this.setProperty("heightMaximized", newHeight);
            this.setProperty("widthMaximized", newWidth);
            this._onDimensionsChanged(true);
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
                constrainTo : this._popupContainer.getContainerRef(),
                dragOverIFrame : true
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
         * @protected
         */
        _createResize : function () {
            if (this._handlesArr) {
                this._resizable = {};
                var handleArr = this._handlesArr, index = 0, parent = this._domElt, getDomElementChild = aria.utils.Dom.getDomElementChild;
                for (var i = 0, ii = handleArr.length; i < ii; i++) {
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
                        axis : axis,
                        constrainTo : this._popupContainer.getContainerRef()
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
            // this.updatePosition();
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
            if (!this._draggable) {
                return;
            }

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
            if (!this._cfg.resizable || !this._resizable) {
                return;
            }

            var handleArr = this._handlesArr;
            for (var i = 0, ii = handleArr.length; i < ii; i++) {
                var cursor = handleArr[i];
                if (this._resizable[cursor]) {
                    this._resizable[cursor].$dispose();
                    this._resizable[cursor] = null;
                }
            }
            this._resizable = null;
        }

    }
});
