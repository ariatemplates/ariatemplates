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
var Aria = require("../../Aria");
var ariaUtilsDate = require("../../utils/Date");
require("./LoggerDisplay.tpl");
var ariaToolsLoggerILoggerModule = require("./ILoggerModule");
var ariaTemplatesModuleCtrl = require("../../templates/ModuleCtrl");
var ariaCoreLog = require("../../core/Log");


/**
 * Utility to manage and highligh template and modules on an application
 * @class aria.tools.logger.LoggerModule
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.tools.logger.LoggerModule',
    $extends : ariaTemplatesModuleCtrl,
    $implements : [ariaToolsLoggerILoggerModule],
    $constructor : function () {

        // call parent constructor
        this.$ModuleCtrl.constructor.call(this);

        /**
         * Bridge used to communicate with main window.
         * @type aria.tools.Bridge
         */
        this.bridge = null;

        /**
         * Datas analysis of the application
         * @type Object
         */
        this._data = {
            // list of logs to display
            logs : []
        };

        /**
         * Number of messages to keep
         * @type Number
         */
        this.logsMaxLength = 20;

    },
    $destructor : function () {
        this.bridge.getAriaPackage().core.Log.removeAppender(this);
        this.$ModuleCtrl.$destructor.call(this);
    },
    $prototype : {
        $publicInterfaceName : "aria.tools.logger.ILoggerModule",

        /**
         * Override default init of moduleCtrl
         * @param {Object} initArgs init argument - actual type is defined by the sub-class
         * @param {aria.core.CfgBeans:Callback} callback the callback description
         */
        init : function (args, cb) {

            this.bridge = args.bridge;
            this.$assert(77, !!this.bridge);

            // add this module as an appender
            // PTR 05038013: aria.core.Log may not be loaded
            this.bridge.getAria().load({
                classes : ['aria.core.Log'],
                oncomplete : {
                    fn : function () {
                        this.bridge.getAriaPackage().core.Log.addAppender(this);
                        this.$callback(cb);
                    },
                    scope : this
                }
            });
        },

        /**
         * Debug
         * @param {String} className
         * @param {String} msg
         * @param {String} msgId The message id
         * @param {Object} o An optional object to be inspected
         */
        debug : function (className, msg, msgId, o) {
            this._log(ariaCoreLog.LEVEL_DEBUG, className, msg, msgId, o);
        },

        /**
         * Info
         * @param {String} className
         * @param {String} msg
         * @param {String} msgId The message id
         * @param {Object} o An optional object to be inspected
         */
        info : function (className, msg, msgId, o) {
            this._log(ariaCoreLog.LEVEL_INFO, className, msg, msgId, o);
        },

        /**
         * Warn
         * @param {String} className
         * @param {String} msg
         * @param {String} msgId The message id
         * @param {Object} o An optional object to be inspected
         */
        warn : function (className, msg, msgId, o) {
            this._log(ariaCoreLog.LEVEL_WARN, className, msg, msgId, o);
        },

        /**
         * Error
         * @param {String} className
         * @param {String} msg
         * @param {String} msgId The message id
         * @param {Object} e The exception to format
         */
        error : function (className, msg, msgId, e) {
            this._log(ariaCoreLog.LEVEL_ERROR, className, msg, msgId, e);
        },

        /**
         * Log any message
         * @protected
         * @param {Number}
         * @param {String} className
         * @param {String} msg
         * @param {String} msgId The message id
         * @param {Object} o An optional object to be inspected
         */
        _log : function (type, className, msg, msgId, o) {
            var logs = this._data.logs;
            var length = logs.unshift({
                type : type,
                className : className,
                msg : msg,
                msgId : msgId,
                object : o,
                date : ariaUtilsDate.format(new Date(), "HH:mm:ss")
            });
            // remove first element of array if size exceed limit
            if (length > this.logsMaxLength) {
                logs.pop();
            }
            this.$raiseEvent("newLog");
        },

        /**
         * Clean the logs
         */
        clean : function () {
            this._data.logs = [];
            this.$raiseEvent("newLog");
        }

    }
});
