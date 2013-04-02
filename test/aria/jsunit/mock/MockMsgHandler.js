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
 * This mock Msg Handler is used by test cases in test.aria.jsunit
 */
Aria.classDefinition({
    $classpath : "test.aria.jsunit.mock.MockMsgHandler",
    $extends : "aria.core.IOFilter",
    $prototype : {
        /**
         * Method called before a request is sent to get a chance to change its arguments
         * @param {aria.modules.RequestMgr.FilterRequest} req
         */
        onRequest : function (req) {
            var sender = req.sender;
            if (sender && sender.classpath == "aria.modules.RequestMgr"
                    && sender.requestObject.moduleName == "test.aria.jsunit.mock") {
                var address = sender.requestData.address;
                this.redirectToFile(req, 'test/aria/jsunit/mock/' + address);
            }
        }
    }
});