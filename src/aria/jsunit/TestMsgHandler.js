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
var ariaJsunitConnectionSession = require("./ConnectionSession");
var ariaCoreIOFilter = require("../core/IOFilter");


(function () {

    var index = 0;

    /**
     * This class implements a message handler for the ModuleCtrlTestCase class. It intercepts and logs connection
     * requests and responses
     */
    module.exports = Aria.classDefinition({
        $classpath : 'aria.jsunit.TestMsgHandler',
        $extends : ariaCoreIOFilter,
        /**
         * This function initializes the filter so that the module controller which is using it can access its data
         * structures
         * @param {Object} mctrl the Module Controller object which is using the filter
         */
        $constructor : function (mctrl) {
            this.$IOFilter.constructor.call(this);
            // use an index so that everything works well in case there are several TestMsgHanlders registered
            this._metaData = this.CONNECTION_SESSION_METADATA + index;
            index++;
            this.cxLogs = [];
            mctrl.cxLogs = this.cxLogs;
        },
        $destructor : function () {
            this.cxLogs = null;
            this.$IOFilter.$destructor.call(this);
        },
        $statics : {
            CONNECTION_SESSION_METADATA : "aria.jsunit.TestMsgHandler:connectionSession"
        },
        $prototype : {

            onRequest : function (req) {
                var sender = req.sender;
                if (sender && sender.classpath == "aria.modules.RequestMgr") {
                    this.$assert(38, sender[this._metaData] == null);
                    var connectionSession = new ariaJsunitConnectionSession({
                        ioRequest : req
                    });
                    sender[this._metaData] = connectionSession;
                    this.cxLogs.push(connectionSession);
                }
            },

            onResponse : function (req) {
                var sender = req.sender;
                if (sender) {
                    var connectionSession = sender[this._metaData];
                    if (connectionSession) {
                        connectionSession.setIOResponse();
                    }
                }
            }
        }
    });
})();
