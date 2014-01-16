/*
 * Copyright 2014 Amadeus s.a.s.
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
 * Sample filter which returns a static response.
 */
Aria.classDefinition({
    $classpath : "test.aria.modules.test.StaticResponseFilter",
    $extends : "aria.core.IOFilter",
    $constructor : function (args) {
        args = args || {};
        this.$IOFilter.constructor.call(this, args);

        this._responseFile = args.responseFile || "test/aria/modules/test/SampleResponse.json";
    },
    $prototype : {

        /**
         * Method called before a request is sent to get a chance to change its arguments
         * @override
         * @param {aria.modules.RequestMgr.FilterRequest} req
         */
        onRequest : function (req) {
            req.delay = this.requestDelay;
            this.redirectToFile(req, this._responseFile, true);
        },

        /**
         * Method called when a response is received to change the result values before the RequestMgr callback is
         * called
         * @override
         * @param {aria.modules.RequestMgr.FilterResponse} resp
         */
        onResponse : function (resp) {
            resp.delay = this.responseDelay;
        }
    }
});
