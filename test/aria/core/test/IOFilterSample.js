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
 * IO filter sample class used to test the IOFilter class.
 */
Aria.classDefinition({
    $classpath : "test.aria.core.test.IOFilterSample",
    $extends : "aria.core.IOFilter",
    $constructor : function (args) {
        this.$IOFilter.constructor.call(this);
        if (args == null) {
            args = {};
        }
        this.initArgs = args;
        if (this.initArgs.constructor) {
            this.initArgs.constructor.call(this, args);
        }
    },
    $destructor : function () {
        if (this.initArgs.destructor) {
            this.initArgs.destructor.call(this);
        }
        this.initArgs = null;
        this.$IOFilter.$destructor.call(this);
    },
    $prototype : {
        onRequest : function (req) {
            if (this.initArgs.onRequest) {
                this.initArgs.onRequest.call(this, req);
            }
        },

        onResponse : function (req) {
            if (this.initArgs.onResponse) {
                this.initArgs.onResponse.call(this, req);
            }
        }
    }
});
