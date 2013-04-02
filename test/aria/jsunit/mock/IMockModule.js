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
 * Public interface of test.aria.jsunit.mock.MockModule.
 */
Aria.interfaceDefinition({
    $classpath : "test.aria.jsunit.mock.IMockModule",
    $extends : "aria.templates.IModuleCtrl",
    $events : {
        "myEvent" : {
            description : "dummy event, used for testing"
        },
        "responseReceived" : {
            description : "raised when a successful response is received"
        }
    },
    $interface : {
        /**
         * Processes the command contained in the data model, sending the request to an appropriate address
         * @param {String} url the address to which the request must be sent
         * @param {aria.core.JsObject.Callback} cb callback
         */
        processCommand : function (url, cb) {}
    }
});
