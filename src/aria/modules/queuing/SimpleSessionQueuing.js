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
 * Simple Session Queuing per session for standalone mode
 */
Aria.classDefinition({
    $classpath : "aria.modules.queuing.SimpleSessionQueuing",
    // TODO break the dependency passing a callback to the push
    // Note that this class has references to aria.modules.RequestMgr
    // but it cannot be added to the $dependencies array (otherwise, there is a circular dependency)
    // $dependencies : ['aria.utils.Json'],
    $constructor : function () {
        /**
         * Map a given id with a session
         * @protected
         * @type Object
         */
        this._idSessionMap = {};

        /**
         * Map of session id and queues
         * @protected
         * @type Object
         */
        this._sessionQueues = {};
    },
    $statics : {
        /**
         * Session id key when no session id is available
         * @type String
         */
        NO_SESSION_ID_KEY : '1'
    },
    $destructor : function () {
        this._idSessionMap = null;
        for (var key in this._sessionQueues) {
            if (this._sessionQueues.hasOwnProperty(key)) {
                delete this._sessionQueues[key];
            }
        }
        this._sessionQueues = null;
    },
    $prototype : {
        /**
         * Execute the request if possible, otherwise push it in the queue
         * @param {Object} requestObject
         * @param {Object} jsonData
         * @param {aria.core.CfgBeans:Callback} callback for this request
         */
        pushRequest : function (requestObject, jsonData, cb) {
            var queue, sessionId = requestObject.session.id;
            if (!sessionId) {
                sessionId = this.NO_SESSION_ID_KEY;
            }
            if (!this._sessionQueues[sessionId]) {
                this._sessionQueues[sessionId] = [];
            }
            queue = this._sessionQueues[sessionId];
            requestObject.actionQueuing = this;

            if (queue.length > 0) {
                // The queue is not empty, put the request in queue
                queue.push({
                    requestObject : requestObject,
                    jsonData : jsonData,
                    cb : cb
                });
                return aria.modules.RequestMgr.QUEUE_STATUS;
            } else {
                // The queue is empty, send the request
                var requestId = this._sendRequest(requestObject, jsonData, cb);
                if (requestId === aria.modules.RequestMgr.ERROR_STATUS) {
                    return requestId;
                } else if (requestObject.async !== false) {
                    // This request is ongoing
                    this._idSessionMap[requestId] = sessionId;
                    queue.push(requestId);
                    return aria.modules.RequestMgr.EXECUTE_STATUS;
                }
            }
        },

        /**
         * Handle the following request in the queue if any.
         * @param {String} id finishing request id
         */
        handleNextRequest : function (id) {
            // this check is for early disposal
            if (!this._idSessionMap) {
                return;
            }

            var sessionId = this._idSessionMap[id], next, nextId;
            if (sessionId) {
                delete this._idSessionMap[id];
                var queue = this._sessionQueues[sessionId];
                // queue should exists and it first element should be id
                this.$assert(99, queue && queue.length > 0);
                this.$assert(100, queue[0] === id);
                queue.splice(0, 1);
                while (queue.length > 0) {
                    next = queue[0];
                    nextId = this._sendRequest(next.requestObject, next.jsonData, next.cb);
                    if (nextId === aria.modules.RequestMgr.ERROR_STATUS) {
                        queue.splice(0, 1);
                    } else {
                        this._idSessionMap[nextId] = sessionId;
                        queue[0] = nextId;
                        return;
                    }
                }
            }
        },

        /**
         * Send an unqueued request
         * @protected
         * @param {Object} requestObject
         * @param {Object} jsonData
         * @param {aria.core.CfgBeans:Callback} callback for this request
         * @return {Integer} request id
         */
        _sendRequest : function (requestObject, jsonData, cb) {
            return aria.modules.RequestMgr.sendJsonRequest(requestObject, jsonData, cb);
        }
    }
});
