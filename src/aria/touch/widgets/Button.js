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

Aria.classDefinition({
    $classpath : "aria.touch.widgets.Button",
    $extends : "aria.html.Element",
    $dependencies : ["aria.touch.widgets.ButtonCfg", "aria.touch.Tap", "aria.utils.ClassList"],
    $css : ["aria.touch.widgets.ButtonCSS"],
    $statics : {
        INVALID_USAGE : "Widget %1 can only be used as a %2.",
        BUTTON_CLASS : "appButton",
        LINK_CLASS : "appLink"
    },
    $constructor : function (cfg, context, line) {
        /**
         * Reference to hold the cancel id of the timer delay
         * @type String
         * @protected
         */
        this._timerId = null;

        cfg.tagName = cfg.tagName || "div";

        cfg.on = cfg.on || {};
        /**
         * Delay for highlighting the state change in milliseconds
         * @type Integer
         * @protected
         */
        this._timeDelay = cfg.delay || 30;

        /**
         * Flag used for switching between Button and Link.
         * @type Boolean
         * @protected
         */
        this._isLink = cfg.isLink;
        this.$cfgBean = this.$cfgBean || "aria.touch.widgets.ButtonCfg.Properties";

        if (!cfg.attributes || !cfg.attributes.disabled) {
            this._registerListeners(cfg);
        }

        /**
         * Needed for browsers where classList doesn't exist natively (e.g Android < 3 Version and IOS < 5.X)
         * @type {aria.utils.ClassList}
         * @protected
         */
        this._classList = null;

        this.$Element.constructor.call(this, cfg, context, line);
    },
    $destructor : function () {
        if (this.timerId) {
            aria.core.Timer.cancelCallback(this.timerId);
            this.timerId = null;
        }

        if (this._classList) {
            this._classList.$dispose();
            this._classList = null;
        }
        this.$Element.$destructor.call(this);
    },
    $prototype : {
        /**
         * This widget shouldn't be used a self closing tag, because there's no way to write markup in it
         * @param {aria.templates.MarkupWriter} out Markup writer
         */
        writeMarkup : function (out) {
            out.write("# Widget Error #");
            this.$logError(this.INVALID_USAGE, ["Button", "container"]);
        },

        /**
         * Initialization method called after the markup of the widget has been inserted in the DOM.
         */
        initWidget : function () {
            this.$Element.initWidget.call(this);
            this._classList = new aria.utils.ClassList(this._domElt);
            var classType = (this._isLink) ? this.LINK_CLASS : this.BUTTON_CLASS;
            this._classList.add(classType);
        },

        /**
         * Add special listeners on top of the ones specified in configuration.
         * @param {aria.touch.widgets.ButtonCfg.Properties} cfg Widget configuration.
         * @protected
         */
        _registerListeners : function (cfg) {
            var listeners = cfg.on;

            this._chainListener(listeners, "tapstart", {
                fn : this._manageEvents,
                scope : this
            });

            this._chainListener(listeners, "tapcancel", {
                fn : this._manageEvents,
                scope : this
            });

            this._chainListener(listeners, "tap", {
                fn : this._manageEvents,
                scope : this
            });
        },

        /**
         * Manage the touch events defined by the widget itself
         * @param {HTMLEvent} event Native event
         */
        _manageEvents : function (event) {
            if (event.type == "tapstart") {
                this.timerId = aria.core.Timer.addCallback({
                    fn : this._delayedHighlightCB,
                    scope : this,
                    delay : this._timeDelay
                });
            }
            if (event.type == "tapcancel" || event.type == "tap") {
                if (this.timerId) {
                    aria.core.Timer.cancelCallback(this.timerId);
                    this.timerId = null;
                }

                if (event.type == "tapcancel" || (event.type == "tap" && !this._isLink)) {
                    this._classList.remove("touchLibButtonPressed");
                }
            }
        },

        /**
         * Highlight the widget after a given timeout
         * @protected
         */
        _delayedHighlightCB : function () {
            this._classList.add("touchLibButtonPressed");
        }
    }
});
