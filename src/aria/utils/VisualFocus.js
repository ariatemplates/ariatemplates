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
 * Manages the visual focus. Loaded when needed by Environment
 * @class aria.utils.VisualFocus
 * @singleton: true
 */
Aria.classDefinition({
    $classpath : "aria.utils.VisualFocus",
    $dependencies : ['aria.core.Browser', 'aria.utils.environment.VisualFocus', 'aria.utils.Delegate'],
    $singleton : true,
    $constructor : function () {

        /**
         * Style of visual focus specified in the application environment. It is equal to null if no visual focus was
         * set, or even when the current browser is IE7 or IE6, which do not support the
         * @private
         * @type String
         */
        this.__style = (!aria.core.Browser.isIE6 && !aria.core.Browser.isIE7)
                ? aria.utils.environment.VisualFocus.getAppOutlineStyle()
                : null;

        /**
         * Currently focused element. When the class is initialized, it gets the current element under focus from the
         * delegate
         * @private
         * @type HTMLElement
         */
        this.__focusedElement = aria.utils.Delegate.getFocus();

        /**
         * Element that actually receives the outline
         * @private
         * @type HTMLElement
         */
        this.__outlinedElement = null;

        /**
         * Previous style property of the element whose outline is changed for visual focus. Its content depends on the
         * browser. If IE8 (lower IE's are not supported at all) is used, it contains the cssText value of the style
         * object of the element. In all other cases, it contains the outline specified in the style object of the
         * element. The latter solution is definitely better because it allows to restore completely the situation after
         * removing the visual focus. In particular, if the outline was not specified in the inline style attribute of
         * the element, then this.__previousOutline = "". When you try to reset the previous outline, doing
         * element.style.outline = "" does not work correctly in IE8. In fact, a the default value of "invert none 0px"
         * is inserted. The consequence is that any different outline specified in a CSS is overwritten by this
         * statement. In other browsers, element.style.outline = "" works correctly, so that the inline style does not
         * contain any information on the outline, and lower level css specifications are correctly applied. We tested
         * this in the template tests.
         * @private
         * @type String
         */
        this.__previousStyle = null;

        aria.utils.environment.VisualFocus.$on({
            "environmentChanged" : function () {
                this.updateOutlineStyle();
            },
            scope : this
        });

        aria.utils.Delegate.$on({
            "elementFocused" : function (evt) {
                this.addVisualFocus(evt.focusedElement);
            },
            scope : this
        });
        aria.utils.Delegate.$on({
            "elementBlurred" : function () {
                this.removeVisualFocus();
            },
            scope : this
        });

        // Update the visual focus in order to apply it on the element that is focused when the class is loaded
        this.__updateVisualFocus();
    },
    $destructor : function () {
        this.removeVisualFocus();

        // nullify all the private properties
        this.__style = null;
        this.__focusedElement = null;
        this.__outlinedElement = null;
        // unregister Listeners
        if (aria.utils.Delegate) {
            aria.utils.Delegate.$unregisterListeners(this);
        }
        if (aria.core.environment.Environment) {
            aria.core.environment.Environment.$unregisterListeners(this);
        }
    },
    $prototype : {

        /**
         * Add visual focus. It sets the outline CSS property of the appropriate HTML Element to the value specified in
         * the appOutLineStyle of the application configuration
         * @param {HTMLElement} Element on focus
         */
        addVisualFocus : function (element) {
            if (this.__focusedElement) {
                this.removeVisualFocus();
            }
            this.__focusedElement = element;

            if (this.__style) {
                var document = Aria.$window.document;
                // for anchors and buttons it looks better to have the outline property set directly on them. Otherwise
                // we look for the first span containing the element under focus
                if (this.__focusedElement.tagName != "A" && this.__focusedElement.tagName != "BUTTON") {
                    for (var curNode = this.__focusedElement; curNode.tagName != "SPAN" && curNode != document.body; curNode = curNode.parentNode) {}
                    if (curNode != document.body) {
                        this.__outlinedElement = curNode;
                    }
                } else {
                    this.__outlinedElement = this.__focusedElement;
                }
                if (this.__outlinedElement) {
                    // see comments on top of this.__previousOutline to uderstand the reason for this if statement
                    if (aria.core.Browser.isIE8) {
                        this.__previousStyle = this.__outlinedElement.style.cssText;// aria.utils.Dom.getStyle(this.__outlinedElement,
                        // "outline");
                    } else {
                        this.__previousStyle = (this.__outlinedElement.style.outline)
                                ? this.__outlinedElement.style.outline
                                : "";
                    }
                    // finally ste the outline property in inline style attribute
                    this.__outlinedElement.style.outline = this.__style;
                }
            }
        },

        /**
         * Restore the outline to its previous value
         */
        removeVisualFocus : function () {
            if (this.__style && this.__outlinedElement) {
                // restore the previous outline
                if (aria.core.Browser.isIE8) {
                    this.__outlinedElement.style.cssText = this.__previousStyle;
                } else {
                    this.__outlinedElement.style.outline = this.__previousStyle;
                }
                this.__outlinedElement = null;
                this.__previousStyle = null;
            }
            this.__focusedElement = null;
        },

        /**
         * Changes the outline style. If the newStyle argument is not provided, the appOutlineStyle of the application
         * environment is chosen. This method is called after the "environmentChanged" event raised by
         * aria.core.environment.Environment
         * @param {String} newStyle [optional] outline style that you want to apply
         */
        updateOutlineStyle : function (newStyle) {
            var styleToApply = (newStyle) ? newStyle : aria.utils.environment.VisualFocus.getAppOutlineStyle();
            this.__style = (!aria.core.Browser.isIE6 && !aria.core.Browser.isIE7) ? styleToApply : null;
            this.__updateVisualFocus();
        },

        /**
         * Updates the visual focus. Invoked when the outline style is changed, for example when the application
         * environment configuration is updated
         * @private
         */
        __updateVisualFocus : function () {
            if (this.__outlinedElement) {
                if (this.__style) {
                    this.__outlinedElement.style.outline = this.__style;
                } else {
                    if (aria.core.Browser.isIE8) {
                        this.__outlinedElement.style.cssText = this.__previousStyle;
                    } else {
                        this.__outlinedElement.style.outline = this.__previousStyle;

                    }
                    this.__outlinedElement = null;
                    this.__previousStyle = null;
                }
            } else if (this.__focusedElement) {
                this.addVisualFocus(this.__focusedElement);
            }
        },

        /**
         * Returns the current visual focus outline style
         * @return {String} current visual focus outline style
         */
        getStyle : function () {
            return this.__style;
        }
    }
});