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
var ariaCoreIO = require("../IO");
var ariaUtilsJson = require("../../utils/Json");


/**
 * This type of appender gathers all the logs sent to it and sends them in a JSON POST
 * message to the configured server URL. This is experimental for now. Never tested.
 * @param {String} url The URL to send the logs to (the server logic running at this url should be prepared to handle
 * JSON POST messages in the following form: {logs: [{time: <ms timestamp>, level: <debug|info|warn|error>, msg: <the
 * message>, classpath: <the classpath>}]}. See aria.core.IO to know which type of URL is supported.
 * @param {Number} minInterval Optional, defaults to 3000. The minimum amount of time (in ms) to wait before sending
 * logs (logs are sent as a batch)
 * @param {Number} minLogNb Optional, defaults to 5. The minimum number of separate log entries to wait before sending
 * logs (logs are sent as a batch)
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.core.log.AjaxAppender",
    $constructor : function (url, minInterval, minLogNb) {
        this._logStack = [];
        this._lastLogSent = 0;

        this.minimumInterval = minInterval || 3000;
        this.minimumLogNb = minLogNb || 5;
        this.url = url;
    },
    $prototype : {
        /**
         * Stack a new log entry in the internal stack. This method will then ask to process the stack.
         * @private
         * @param {String} className The classname of the object sending the log
         * @param {String} msg The message
         * @param {String} level The level
         */
        _stackLogObject : function (className, msg, level) {
            var logObject = {
                classpath : className,
                msg : msg,
                level : level,
                time : new Date().getTime()
            };
            this._logStack.push(logObject);
            this._processStack();
        },

        /**
         * Process the stack. Ask to send the request to the server according to the minim delay and minimum number of
         * logs. Flush the stack if request sent.
         * @private
         */
        _processStack : function () {
            // The strategy to send logs is either after a certain delay, or when the stack is bigger than ...
            var now = new Date().getTime();
            if (this._logStack.length > this.minimumLogNb && now > this._lastLogSent + this.minimumInterval) {
                this._lastLogSent = new Date().getTime();
                this._sendStack();
                this._logStack = [];
            }
        },

        /**
         * Actually send the stack to the server. See aria.core.IO.
         */
        _sendStack : function () {
            // stringify the json data
            var data = ariaUtilsJson.convertToJsonString({
                logs : this._logStack
            }, {
                maxDepth : 4
            });

            // Send json post request
            ariaCoreIO.asyncRequest({
                sender : {
                    classpath : this.$classpath
                },
                url : this.url,
                method : "POST",
                data : data,
                callback : {
                    fn : this._stackSent,
                    scope : this
                }
            });
        },

        /**
         * Callback called when the response is received. Doesn't do anything.
         */
        _stackSent : function () {},

        /**
         * Debug
         * @param {String} className
         * @param {String} msg The message text (including arguments)
         * @param {String} msgText The message text (before arguments were replaced)
         * @param {Object} o An optional object to be inspected
         */
        debug : function (className, msg, msgText, o) {
            this._stackLogObject(className, msg, "debug");
        },

        /**
         * Info
         * @param {String} className
         * @param {String} msg The message text (including arguments)
         * @param {String} msgText The message text (before arguments were replaced)
         * @param {Object} o An optional object to be inspected
         */
        info : function (className, msg, msgText, o) {
            this._stackLogObject(className, msg, "info");
        },

        /**
         * Warn
         * @param {String} className
         * @param {String} msg The message text (including arguments)
         * @param {String} msgText The message text (before arguments were replaced)
         * @param {Object} o An optional object to be inspected
         */
        warn : function (className, msg, msgText, o) {
            this._stackLogObject(className, msg, "warn");
        },

        /**
         * Error
         * @param {String} className
         * @param {String} msg The message text (including arguments)
         * @param {String} msgText The message text (before arguments were replaced)
         * @param {Object} e The exception to format
         */
        error : function (className, msg, msgText, e) {
            this._stackLogObject(className, msg + this._formatException(e), "error");
        },

        /**
         * Format an exception object
         * @param {Object} e The exception to format
         * @return {String} The message ready to be shown
         * @private
         */
        _formatException : function (e) {
            var str = "";

            if (typeof e == 'undefined' || e == null) {
                return str;
            }

            str = "\nException";
            str += "\n" + '---------------------------------------------------';
            if (e.fileName)
                str += '\nFile: ' + e.fileName;
            if (e.lineNumber)
                str += '\nLine: ' + e.lineNumber;
            if (e.message)
                str += '\nMessage: ' + e.message;
            if (e.name)
                str += '\nError: ' + e.name;
            if (e.stack)
                str += '\nStack:' + "\n" + e.stack.substring(0, 200) + " [...] Truncated stacktrace.";
            str += "\n" + '---------------------------------------------------' + "\n";

            return str;
        }
    }
});
