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

    // shortcuts
    var eventUtils = null;
    var contextManager = null;
    var appEnvironment = null;
    var domUtils = null;

    /**
     * Contextual menu for debugging of applications. Contains identification of template, module, and refresh / reload
     * actions.
     * @singleton
     * @class aria.tools.contextual.ContextualMenu
     */
    Aria.classDefinition({
        $classpath : 'aria.tools.contextual.ContextualMenu',
        $singleton : true,
        $dependencies : ['aria.utils.Event', 'aria.DomEvent', 'aria.templates.TemplateCtxtManager',
                'aria.popups.Popup', 'aria.widgets.Template', 'aria.utils.Dom',
                'aria.tools.contextual.environment.ContextualMenu', 'aria.utils.AriaWindow'],
        $implements : ['aria.tools.contextual.IContextualMenu'],
        $constructor : function () {

            // shortcut
            eventUtils = aria.utils.Event;
            contextManager = aria.templates.TemplateCtxtManager;
            appEnvironment = aria.tools.contextual.environment.ContextualMenu;
            domUtils = aria.utils.Dom;

            /**
             * Specifies whether the contextual menu should be enabled (defined in the app environment).
             * @protected
             * @type Boolean
             */
            this._enabled = false;

            /**
             * Popup used to display contextual menu
             * @protected
             * @type aria.popups.Popup
             */
            this._popup = null;

            /**
             * Targeted template context
             * @type aria.templates.TemplateCtxt
             */
            this.targetTemplateCtxt = null;

            /**
             * Configuration for contextual menu from the App Environment.
             * @protected
             * @type aria.core.environment.EnvironmentBaseCfgBeans:AppCfg.ContextualMenu
             */
            this._appEnvCfg = null; // is set in _environmentChanged

            appEnvironment.$on({
                'environmentChanged' : this._environmentChanged,
                scope : this
            });
            this._environmentChanged();

            aria.utils.AriaWindow.$on({
                "attachWindow" : this._attachWindow,
                "detachWindow" : this._detachWindow,
                scope : this
            });
        },
        $destructor : function () {
            aria.core.environment.Environment.$unregisterListeners(this);
            aria.utils.AriaWindow.$unregisterListeners(this);

            // remove the listener:
            this._setEnabled(false);

            // close popup
            if (this._popup) {
                this._popup.close();
            }

            // break dom reference
            this.targetTemplateCtxt = null;
        },
        $prototype : {

            /**
             * This method is called when the framework is starting to use Aria.$window. It enables the contextual menu
             * if it is enabled in the app environment.
             */
            _attachWindow : function () {
                var appEnvCfg = appEnvironment.getContextualMenu();
                this._setEnabled(appEnvCfg.enabled);
            },

            /**
             * This method is called when the framework no longer uses Aria.$window. It disables the contextual menu.
             */
            _detachWindow : function () {
                this._setEnabled(false);
            },

            /**
             * Method called when the app environment has changed. This enables or disables the contextual menu
             * according to the value in the app environment.
             * @protected
             */
            _environmentChanged : function () {
                var appEnvCfg = appEnvironment.getContextualMenu();
                this._appEnvCfg = appEnvCfg;
                this._setEnabled(appEnvCfg.enabled);
            },

            /**
             * Enables or disables the contextual menu. Shoule not be called directly. Instead, the value should be set
             * in the app environment.
             * @param {Boolean} value if true, it enables the contextual menu, if false, it disables it
             * @protected
             */
            _setEnabled : function (value) {
                var document = Aria.$window.document;
                if (value) {
                    // add event listeners if AriaSkin is available
                    // (required as it uses widgets)
                    // TODO: investigate to plug with event delegation
                    // when ready
                    if (aria.widgets && aria.widgets.AriaSkin) {
                        this._enabled = true;
                        eventUtils.addListener(document, "contextmenu", {
                            fn : this._onContextMenu,
                            scope : this
                        });
                        if (aria.core.Browser.isSafari) {
                            // PTR 04547842: Safari does not support the
                            // ctrlKey property on contextmenu event
                            // register the mouseup event to get this
                            // information
                            eventUtils.addListener(document, "mouseup", {
                                fn : this._onSafariMouseUp,
                                scope : this
                            });
                        }
                    }
                } else {
                    this._enabled = false;
                    // remove event listeners
                    eventUtils.removeListener(document, "contextmenu", {
                        fn : this._onContextMenu
                    });
                    if (aria.core.Browser.isSafari) {
                        eventUtils.removeListener(document, "mouseup", {
                            fn : this._onSafariMouseUp
                        });
                    }
                }
            },

            /**
             * Handler for mouseup event on document.body for Safari. As Safari does not support the ctrlKey property on
             * contextmenu event, use the mouseup event to get this information (PTR 04547842)
             * @protected
             * @param {Event} event
             */
            _onSafariMouseUp : function (event) {
                this._safariCtrlKey = event.ctrlKey;
            },

            /**
             * Handler for context menu call on document.body
             * @protected
             * @param {Event} event
             */
            _onContextMenu : function (event) {
                if (!this._enabled) {
                    return;
                }
                event = new aria.DomEvent(event);
                if (aria.core.Browser.isSafari) {
                    event.ctrlKey = this._safariCtrlKey;
                }
                // ctrl right click only
                if (event.ctrlKey) {
                    // stop default behaviour, like opening real
                    // contextual menu
                    event.stopPropagation();
                    event.preventDefault();
                    var target = event.target;
                    this.__callContextualMenu(target, event.clientX, event.clientY);
                    event.$dispose();
                    return false;
                }
                event.$dispose();
            },
            /**
             * To call the Contexual Menu
             * @public
             * @param {aria.templates.TemplateCtxt} templateCtxt or DOM element
             * @param {Object} obj the object to set left and top position of the contextual menu
             */
            open : function (target, position) {
                // look for existing Contextual menu
                if (this._popup) {
                    aria.tools.contextual.ContextualMenu.close();
                }
                // first check the position else get positon from dom
                // element
                var domPosition = {};
                if (!position) {
                    if (!target.$TemplateCtxt) {
                        domPosition = domUtils.getGeometry(target);
                    } else {
                        domPosition = {
                            x : 0,
                            y : 0
                        };
                    }
                } else {
                    domPosition = position;
                }

                // look for template context
                if (target.$TemplateCtxt) {
                    this._notifyFound(target, domPosition.x, domPosition.y);
                    return;
                }
                // Internal call to initiate the notify
                this.__callContextualMenu(target, domPosition.x, domPosition.y);

                return false;

            },
            /**
             * Internal function used to notify Contextual menu
             * @param {HTMLElement} elm DOM element
             * @param {Number} xpos
             * @param {Number} ypos
             * @private
             */
            __callContextualMenu : function (target, x, y) {
                // check for template context
                var previousTarget;
                // look for the first template
                var body = Aria.$window.document.body;
                while (target && target != body && !target.__template) {
                    previousTarget = target;
                    target = target.parentNode;
                }
                // check for dom position

                if (target == body && previousTarget) {
                    // prevousTarget might be a popup
                    // first check whether the PopupManager is loaded:
                    if (aria.popups && aria.popups.PopupManager) {
                        // then look for the popup:
                        var popup = aria.popups.PopupManager.getPopupFromDom(previousTarget);
                        if (popup && popup.section && popup.section.tplCtxt) {
                            // a popup was found
                            this._notifyFound(popup.section.tplCtxt, x, y);
                        }
                    }
                } else if (target && target != body) {
                    this._notifyFound(contextManager.getFromDom(target.parentNode), x, y);
                }

            },

            /**
             * Clean stuff after closing popup
             * @protected
             * @param {aria.temaplates.ClassWriter}
             */
            _afterClose : function (evt) {
                if (this._popup) {
                    this._popup.$dispose();
                    this._popup = null;
                }
            },

            /**
             * Handle what to do when a target for inspection if retrieve
             * @protected
             * @param {aria.templates.TemplateCtxt} templateCtxt
             * @param {Number} xpos
             * @param {Number} ypos
             */
            _notifyFound : function (templateCtxt, xpos, ypos) {

                // bridge is open -> inspector will handle this as well
                var bridge = aria.tools.ToolsBridge;
                if (bridge && bridge.isOpen) {
                    bridge.$raiseEvent({
                        name : "forwardEvent",
                        event : {
                            name : "ContextualTargetFound",
                            templateCtxt : templateCtxt
                        }
                    });
                }

                if (this._popup) {
                    return;
                }

                var popup = new aria.popups.Popup();
                this._popup = popup;

                popup.$on({
                    "onAfterClose" : this._afterClose,
                    scope : this
                });

                // create a section on the founded template context
                var section = templateCtxt.createSection({
                    fn : function (out) {
                        var tplWidget = new aria.widgets.Template({
                            defaultTemplate : this._appEnvCfg.template,
                            moduleCtrl : {
                                classpath : this._appEnvCfg.moduleCtrl,
                                initArgs : {
                                    templateCtxt : templateCtxt.$interface("aria.templates.ITemplateCtxt"),
                                    driver : this.$interface("aria.tools.contextual.IContextualMenu")
                                }
                            }
                        }, templateCtxt, "NOLINE");
                        out.registerBehavior(tplWidget);
                        tplWidget.writeMarkup(out);
                    },
                    scope : this
                });

                popup.open({
                    section : section,
                    absolutePosition : {
                        top : ypos,
                        left : xpos
                    },
                    modal : true,
                    maskCssClass : "xDialogMask" /* uses the css class from the AriaSkin */,
                    preferredPositions : [{
                                reference : "bottom left",
                                popup : "top left"
                            }, {
                                reference : "bottom left",
                                popup : "top right"
                            }],
                    offset : {
                        top : 0,
                        left : 0
                    },
                    closeOnMouseClick : true,
                    closeOnMouseScroll : true
                });

                this.targetTemplateCtxt = templateCtxt;

            },

            /**
             * Close the contextual menu
             */
            close : function () {
                this.targetTemplateCtxt = null;
                if (this._popup) {
                    this._popup.close();
                }
            },

            /**
             * Start the tools module with a template context to inspect
             */
            openTools : function () {
                if (!aria.tools.ToolsBridge || !aria.tools.ToolsBridge.isOpen) {
                    Aria.load({
                        classes : ['aria.tools.ToolsBridge'],
                        oncomplete : function () {
                            aria.tools.ToolsBridge.open();
                            aria.tools.contextual.ContextualMenu.close();
                        }
                    });
                }
            }
        }
    });
})();
