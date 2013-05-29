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
 * Mock for async request with 100ms delay
 */
Aria.classDefinition({
    $classpath : "test.aria.core.mock.IOMock",
    $singleton : true,
    $constructor : function () {},
    $prototype : {

        /**
         * Perform an asynchronous request to the server Note: callback is always called in an asynchronous way (even in
         * case of errors)
         * @param {Object} req the request description
         */
        asyncRequest : function (req) {
            var cb = req.callback;
            setTimeout(function () {
                cb.fn.call(cb.scope, {}, cb.args);
            }, 100);
        }
    }
});
