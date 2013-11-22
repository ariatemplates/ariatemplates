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
 * Helper to test RequestFilter
 */
Aria.classDefinition({
    $classpath : "test.aria.modules.test.RequestFilterTester",
    $extends : "aria.core.IOFilter",
    $constructor : function (targetPkg) {
        this.$IOFilter.constructor.call(this);
        this._targetPkg = targetPkg;
        this.requestCalls = [];
    },
    $destructor : function () {
        this.requestCalls = null;
        this.$IOFilter.$destructor.call(this);
    },
    $prototype : {
        /**
         * Called when a request is sent to the filter. Simply store the request in this.requestCalls.
         * @param {aria.modules.RequestMgr.FilterRequest} req
         */
        onRequest : function (req) {
            this.requestCalls.push(req);
        }
    }
});
