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
    var basePackage = "atplugins.lightWidgets";
    var basePath = basePackage + ".";
    var nspace = Aria.nspace(basePackage, true);

    Aria.classDefinition({
        $classpath : "atplugins.lightWidgets.DropDown",
        $dependencies : ["aria.utils.Dom", "aria.utils.Json", "aria.popups.Popup", "aria.html.Template",
                "aria.templates.Layout"],
        /**
         * @param {atplugins.lightWidgets.DropDownCfgBeans.Cfg} cfg
         */
        $constructor : function (cfg) {

            /**
             * Configuration of the dropdown
             * @type atplugins.lightWidgets.DropDownCfgBeans.Cfg
             */
            this._cfg = cfg;

            /**
             * Instance of popup that is displayed
             * @type aria.popups.Popup
             * @private
             */
            this._popup = null;

            /**
             * Offset for the dropdown
             * @type Object
             * @protected
             */
            this._offset = {
                "top" : 1,
                "bottom" : 0,
                "left" : 0,
                "right" : 0
            };

            /**
             * Whether to inhibit the call to the afterClose in the configuration
             * @type Boolean
             * @protected
             */
            this._inhibitAfterClose = false;

            aria.templates.Layout.$on({
                "viewportResized" : this._onViewportResized,
                scope : this
            });
        },
        $destructor : function () {
            aria.templates.Layout.$unregisterListeners(this);
            this.close();
        },
        $prototype : {

            /**
             * Open the dropdown
             */
            open : function () {
                var cfg = this._cfg;

                var section = cfg.context.createSection({
                    fn : this._contentWriter,
                    scope : this
                });
                this._popup = new aria.popups.Popup();
                this._connectPopupEvents();
                this._popup.open({
                    section : section,
                    domReference : cfg.domReference,
                    keepSection : false,
                    preferredPositions : [{
                                reference : "bottom left",
                                popup : "top left"
                            }, {
                                reference : "top left",
                                popup : "bottom left"
                            }],
                    offset : this._offset,
                    center : false,
                    closeOnMouseClick : true,
                    closeOnMouseScroll : false,
                    ignoreClicksOn : cfg.ignoreClicksOn
                });

            },

            /**
             * Close the dropdown
             */
            close : function () {
                if (this._popup && this._popup.isOpen) {
                    this._popup.close();
                }
            },

            /**
             * Check if the popup is open
             * @return {Boolean}
             */
            isOpen : function () {
                if (this._popup) {
                    return this._popup.isOpen;
                } else {
                    return false;
                }
            },

            /**
             * Refresh the position of the popup
             * @protected
             */
            _onViewportResized : function () {
                if (this.isOpen()) {
                    this._inhibitAfterClose = true;
                    this.close();
                    this._inhibitAfterClose = false;
                    this.open();
                }
            },

            /**
             * To be overridden. It takes care of filling the section inside the popup
             * @param {aria.templates.MarkupWriter} out Instance of the markup writer of the current section
             */
            _contentWriter : Aria.empty,

            _connectPopupEvents : function () {
                this._popup.$addListeners({
                    "*" : {
                        fn : this._onPopupEvent
                    },
                    scope : this
                });
            },

            _disconnectPopupEvents : function () {
                this._popup.$unregisterListeners(this);
            },

            _onPopupEvent : function (event) {
                var cfg = this._cfg;
                if (this["_" + event.name]) {
                    this["_" + event.name]();

                }
                if (cfg[event.name] && !this._inhibitAfterClose) {
                    this.$callback(cfg[event.name], event);
                }
            },

            _onAfterClose : function () {
                this._disconnectPopupEvents();
                this._popup.$dispose();
            }

        }
    });
})();