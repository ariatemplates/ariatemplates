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
var Aria = require("../Aria");
var ariaUtilsIdManager = require("../utils/IdManager");
var ariaTemplatesCSSMgr = require("../templates/CSSMgr");
var ariaUtilsArray = require("../utils/Array");


(function () {
    var idMgr = null;
    var arrayUtils = null;

    /**
     * Add template and line number information to the msgArgs array to be used for logs functions. Return the modified
     * array.
     * @param {aria.widgetLibs.BaseWidget} widget widget instance
     * @param {Array} msgArgs array
     * @return {Array}
     * @private
     */
    var __logMsgArgsAddInfo = function (widget, msgArgs) {
        if (widget._context) {
            if (!msgArgs) {
                msgArgs = [];
            }
            msgArgs.unshift("Template: " + widget._context.tplClasspath + ", Line: " + widget._lineNumber + "\n");
        }
        return msgArgs;
    };

    /**
     * Base class that all widgets have to extend.
     */
    module.exports = Aria.classDefinition({
        $classpath : "aria.widgetLibs.BaseWidget",
        $onload : function () {
            idMgr = new ariaUtilsIdManager("w");
            arrayUtils = ariaUtilsArray;
        },
        $onunload : function () {
            idMgr.$dispose();
            idMgr = null;
            arrayUtils = null;
        },
        /**
         * Create an instance of the widget.
         * @param {Object} cfg widget configuration, which is the parameter given in the template
         * @param {aria.templates.TemplateCtxt} context template context
         * @param {Number} lineNumber line number in the template
         */
        $constructor : function (cfg, context, lineNumber) {
            /**
             * The widget configuration, as declared in the template.
             * @protected
             * @type Object
             */
            this._cfg = cfg;

            /**
             * Template context
             * @protected
             * @type aria.templates.TemplateCtxt
             */
            this._context = context;

            /**
             * Line number for this widget
             * @protected
             * @type Number
             */
            this._lineNumber = lineNumber;

            /**
             * Array of used dynamic ids.
             * @protected
             * @type Array
             */
            this._dynamicIds = null;

            // Notify the Skin Manager that a new widget was created
            ariaTemplatesCSSMgr.loadWidgetDependencies(this.$classpath, this.$css);

            /**
             * True if the CSS is loaded, false otherwise. This is to make sure the CSS is not unloaded twice.
             * @type Boolean
             */
            this.__cssLoaded = true;
        },
        $destructor : function () {
            this._releaseAllDynamicIds();

            if (this.__cssLoaded) {
                // Notify the Skin Manager that a widget was destroyed
                ariaTemplatesCSSMgr.unloadWidgetDependencies(this.$classpath, this.$css);
                this.__cssLoaded = false;
            } else {
                this.$logError(this.WIDGET_DISPOSED_TWICE);
            }
            this._context = null;
            this._cfg = null;
        },
        $statics : {
            WIDGET_CONTAINER_ONLY : "%1This widget must be used as a container.",
            WIDGET_NOT_CONTAINER : "%1This widget cannot be used as a container.",
            WIDGET_DISPOSED_TWICE : "This widget was disposed twice."
        },
        $prototype : {

            /**
             * Main widget entry-point called to allow the widget to write its markup (for non-container widgets). This
             * method is intended to be overridden by sub-classes. The method in BaseWidget logs an error.
             * @param {aria.templates.MarkupWriter} out
             */
            writeMarkup : function (out) {
                this.$logError(this.WIDGET_CONTAINER_ONLY);
            },

            /**
             * Main widget entry-point called to allow the widget to write the beginning of its markup, corresponding to
             * the opening tag (for container widgets). This method is intended to be overridden by sub-classes. The
             * method in BaseWidget logs an error.
             * @param {aria.templates.MarkupWriter} out
             */
            writeMarkupBegin : function (out) {
                this.$logError(this.WIDGET_NOT_CONTAINER);
            },

            /**
             * Method to get the main DOM element of the widget. This method is used by the inspector to get an element
             * to highlight. This method is intended to be overridden by sub-classes. The method in BaseWidget returns
             * null.
             * @return {HTMLElement} main html element of the widget. Can be null, depending on the implementation of
             * the widget.
             */
            getDom : function () {
                return null;
            },

            /**
             * Log an error message to the logger. The method from JsObject is overridden in BaseWidget to provide more
             * information about the widget (template and line number).
             * @param {String} msg the message text. If the string %1 is found in this message, it is replaced by the
             * widget additional information (template and line number). Note that arguments in msgArgs (msgArgs[0],
             * msgArgs[1]...) are available as %2, %3 ...
             * @param {Array} msgArgs An array of arguments to be used for string replacement in the message text
             * @param {Object} err The actual JS error object that was created or an object to be inspected in the
             * logged message
             */
            $logError : function (msgId, msgArgs, err) {
                this.$JsObject.$logError.call(this, msgId, __logMsgArgsAddInfo(this, msgArgs), err);
            },

            /**
             * Log a warning message to the logger. The method from JsObject is overridden in BaseWidget to provide more
             * information about the widget (template and line number).
             * @param {String} msg the message text. If the string %1 is found in this message, it is replaced by the
             * widget additional information (template and line number). Note that arguments in msgArgs (msgArgs[0],
             * msgArgs[1]...) are available as %2, %3 ...
             * @param {Array} msgArgs An array of arguments to be used for string replacement in the message text
             * @param {Object} obj An optional object to be inspected in the logged message
             */
            $logWarn : function (msgId, msgArgs, err) {
                this.$JsObject.$logWarn.call(this, msgId, __logMsgArgsAddInfo(this, msgArgs), err);
            },

            /**
             * Log an info message to the logger. The method from JsObject is overridden in BaseWidget to provide more
             * information about the widget (template and line number).
             * @param {String} msg the message text. If the string %1 is found in this message, it is replaced by the
             * widget additional information (template and line number). Note that arguments in msgArgs (msgArgs[0],
             * msgArgs[1]...) are available as %2, %3 ...
             * @param {Array} msgArgs An array of arguments to be used for string replacement in the message text
             * @param {Object} obj An optional object to be inspected in the logged message
             */
            $logInfo : function (msgId, msgArgs, err) {
                this.$JsObject.$logInfo.call(this, msgId, __logMsgArgsAddInfo(this, msgArgs), err);
            },

            /**
             * Log an error message to the logger. The method from JsObject is overridden in BaseWidget to provide more
             * information about the widget (template and line number).
             * @param {String} msg the message text. If the string %1 is found in this message, it is replaced by the
             * widget additional information (template and line number). Note that arguments in msgArgs (msgArgs[0],
             * msgArgs[1]...) are available as %2, %3 ...
             * @param {Array} msgArgs An array of arguments to be used for string replacement in the message text
             * @param {Object} obj An optional object to be inspected in the logged message
             */
            $logDebug : function (msgId, msgArgs, err) {
                this.$JsObject.$logDebug.call(this, msgId, __logMsgArgsAddInfo(this, msgArgs), err);
            },

            /**
             * Method called to allow the widget to write the end of its markup, corresponding to the closing tag (for
             * container widgets). This method is intended to be overridden by sub-classes. The method in BaseWidget
             * does nothing.
             * @param {aria.templates.MarkupWriter} out
             */
            writeMarkupEnd : function (out) {},

            /**
             * Initialization method called after the markup of the widget has been inserted in the DOM. This method is
             * intended to be overridden by sub-classes. The method in BaseWidget does nothing.
             */
            initWidget : function () {},

            /**
             * Create a dynamic id to be used in the markup generated by the widget in order to get a reference to the
             * corresponding DOM element later (for example in initWidget).
             * @return {String}
             */
            _createDynamicId : function () {
                var res = idMgr.getId();
                if (this._dynamicIds) {
                    this._dynamicIds.push(res);
                } else {
                    this._dynamicIds = [res];
                }
                return res;
            },

            /**
             * Release a dynamic id created with _createDynamicId, so that it can be reused for another widget. If the
             * id was not created with _createDynamicId or already released, the function does nothing.
             * @param {String} id id to be released.
             */
            _releaseDynamicId : function (id) {
                var dynamicIds = this._dynamicIds;
                if (dynamicIds) {
                    var index = arrayUtils.indexOf(dynamicIds, id);
                    if (index != -1) {
                        idMgr.releaseId(id);
                        if (dynamicIds.length == 1) {
                            this._dynamicIds = null;
                        } else {
                            arrayUtils.removeAt(dynamicIds, index);
                        }
                    }
                }
            },

            /**
             * Release all dynamic ids created with _createDynamicId, so that they can be reused for other widgets.
             */
            _releaseAllDynamicIds : function () {
                var dynamicIds = this._dynamicIds;
                if (dynamicIds) {
                    for (var i = dynamicIds.length - 1; i >= 0; i--) {
                        idMgr.releaseId(dynamicIds[i]);
                    }
                    this._dynamicIds = null;
                }
            }
        }
    });
})();
