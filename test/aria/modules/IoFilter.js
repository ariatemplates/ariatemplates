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
 * Test for the RequestMgr class
 */
Aria.classDefinition({
    $classpath : 'test.aria.modules.IoFilter',
    $extends : 'aria.core.IOFilter',
    $constructor : function (translatePath, switchSyncAsync) {
        this.$IOFilter.constructor.call(this);
        this._switchSyncAsync = switchSyncAsync;
        this._translatePath = translatePath;
    },
    $prototype : {
        /**
         * Method called before a request is sent to get a chance to change its arguments
         * @param {aria.core.CfgBeans.IOAsyncRequestCfg} request
         */
        onRequest : function (request) {
            if (request.url == this._translatePath) {
                request.url = Aria.rootFolderPath + "test/aria/modules/test/SampleResponse.json";
            } else if (request.async !== false && this._switchSyncAsync) {
                // set all requests as sync
                request.async = false;
            }
        }
    }
});
