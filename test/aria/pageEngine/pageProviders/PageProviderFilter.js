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

Aria.classDefinition({
    $classpath : "test.aria.pageEngine.pageProviders.PageProviderFilter",
    $extends : "aria.core.IOFilter",
    $constructor : function (data) {
        this.$IOFilter.constructor.call(this);
        this._data = data;
    },
    $prototype : {

        onRequest : function (req) {
            if (req.url.match(/testSite/)) {
                var page = req.url.split("/");
                page = page[page.length - 1].split(".")[0];
                if (!(page in this._data)) {
                    this._data[page] = 0;
                }
                this._data[page]++;
            }
        }
    }
});
