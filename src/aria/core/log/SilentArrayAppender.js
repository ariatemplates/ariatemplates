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


/**
 * This appender is simply stacking all messages in a in-memory array. It is used by the jsUnit test framework to assert
 * the existence of logs during the execution of a test.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.core.log.SilentArrayAppender",
    $constructor : function () {
        /**
         * The stack of logs
         * @type Array
         */
        this.logs = [];
    },
    $destructor : function () {
        this.logs = [];
    },
    $prototype : {
        /**
         * Wheter the list of logs is empty or not
         * @return {Boolean} true if the list is empty
         */
        isEmpty : function () {
            return this.logs.length === 0;
        },

        /**
         * Empty the list of logs
         */
        empty : function () {
            this.logs = [];
        },

        /**
         * Get the list of logs
         * @return {Array}
         */
        getLogs : function () {
            return this.logs;
        },

        /**
         * Set the list of logs to the given array
         * @param {Array} logs
         */
        setLogs : function (logs) {
            this.logs = logs;
        },

        /**
         * Store a log in the list
         * @param {Object} log
         *
         * <pre>
         * {
         *      level : {String} log level [e.g. 'error', 'debug', 'warn', ...],
         *      msg : {String} log message,
         *      className : {String} class logging the message,
         *      msgId : {String} message text (before arguments are replaced),
         *      objOrErr : {Object} optional object to be inspected
         * }
         * </pre>
         * @private
         */
        _saveLog : function (log) {
            this.logs.push(log);
        },

        /**
         * Log a Debug message
         * @param {String} className class logging the message
         * @param {String} msg The message text (including arguments)
         * @param {String} msgText The message text (before arguments were replaced)
         * @param {Object} o An optional object to be inspected
         */
        debug : function (className, msg, msgText, o) {
            this._saveLog({
                level : "debug",
                msg : msg,
                className : className,
                msgId : msgText,
                objOrErr : o
            });
        },

        /**
         * Log an Info message
         * @param {String} className class logging the message
         * @param {String} msg The message text (including arguments)
         * @param {String} msgText The message text (before arguments were replaced)
         * @param {Object} o An optional object to be inspected
         */
        info : function (className, msg, msgText, o) {
            this._saveLog({
                level : "info",
                msg : msg,
                className : className,
                msgId : msgText,
                objOrErr : o
            });
        },

        /**
         * Log a Warn message
         * @param {String} className class logging the message
         * @param {String} msg The message text (including arguments)
         * @param {String} msgText The message text (before arguments were replaced)
         * @param {Object} o An optional object to be inspected
         */
        warn : function (className, msg, msgText, o) {
            this._saveLog({
                level : "warn",
                msg : msg,
                className : className,
                msgId : msgText,
                objOrErr : o
            });
        },

        /**
         * Log a Error message
         * @param {String} className class logging the message
         * @param {String} msg The message text (including arguments)
         * @param {String} msgText The message text (before arguments were replaced)
         * @param {Object} e The exception to format
         */
        error : function (className, msg, msgText, e) {
            this._saveLog({
                level : "error",
                msg : msg,
                className : className,
                msgId : msgText,
                objOrErr : e
            });
        }
    }
});
