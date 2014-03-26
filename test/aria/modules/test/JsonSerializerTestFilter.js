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
 * IO filter sample class used by RequestMgrJsonSerializerTest.
 */
Aria.classDefinition({
    $classpath : 'test.aria.modules.test.JsonSerializerTestFilter',
    $extends : 'aria.core.IOFilter',
    $constructor : function () {
        this.$IOFilter.constructor.call(this);
    },
    $prototype : {
        onRequest : function (req) {
            if (req.sender.requestObject && req.sender.requestObject.actionName == "serializerTestAction") {
                this.__postData = req.data;
                this.redirectToFile(req, "test/aria/modules/test/TestFile.txt", false);
            }
        },
        onResponse : function (req) {
            if (req.sender.requestObject && req.sender.requestObject.actionName == "serializerTestAction") {
                req.res.responseText = this.__postData;
                this.__postData = null;
            }
        }
    }
});
