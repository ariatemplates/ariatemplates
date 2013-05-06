/*
 * Copyright 2013 Amadeus s.a.s.
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
 * Module Controller part of the test case for Autorefresh
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.autorefresh.RefreshModule",
    $extends : "aria.templates.ModuleCtrl",
    $implements : ["test.aria.templates.autorefresh.IRefreshModule"],
    $prototype : {
        $publicInterfaceName : "test.aria.templates.autorefresh.IRefreshModule",

        syncRefreshes : function (tplCtxt) {
            this.tplCtxt = tplCtxt;
            tplCtxt.$refresh();
            tplCtxt.$refresh();
            tplCtxt.$refresh();
        },

        asyncRefreshes : function (argCB) {
            var cb = {
                scope : this,
                fn : this._asyncRefreshesCB,
                args : {
                    oldCB : argCB
                }
            };
            this.submitJsonRequest("xyz", {
                ok : "ok"
            }, cb);
        },

        _asyncRefreshesCB : function (res, args) {
            this.tplCtxt.$refresh();
            this.tplCtxt.$refresh();
            this.tplCtxt.$refresh();

            // we call this asynchronously to give RefreshManager time to wrap the CB and call resume() on the
            // RefreshManager

            // this code below is a bit fugly, but then it's only used in the testcase and works
            // on all browsers.
            setTimeout(function () {
                var jso = new aria.core.JsObject(); // this will work on IE
                jso.$callback(args.oldCB);
                jso.$destructor();
            }, 1);
        }
    }
});
