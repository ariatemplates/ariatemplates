/*
 * Copyright 2015 Amadeus s.a.s.
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
    $classpath : "test.aria.utils.bridge.BridgeTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Bridge"],
    $prototype : {
        tearDown: function () {
            if (this.bridge) {
                this.bridge.close();
                this.bridge.$dispose();
                this.bridge = null;
            }
        },

        testAsyncCheckDownloadMgrMaps : function () {
            aria.core.DownloadMgr.updateRootMap({
                "bridgeTest": aria.core.DownloadMgr.resolveURL("test/aria/utils/bridge/root", true) + "/"
            });
            aria.core.DownloadMgr.updateUrlMap({
                "bridgeTest": {
                    "BridgeCtrl": "bridgeTest/BridgeCtrl-abcde.js",
                    "BridgeTpl": "bridgeTest/BridgeTpl-efghi.tpl"
                }
            });

            var bridge = this.bridge = new aria.utils.Bridge();
            bridge.open({
                title: "BridgeWindow",
                moduleCtrlClasspath: "bridgeTest.BridgeCtrl",
                displayClasspath: "bridgeTest.BridgeTpl"
            });

            this.waitFor({
                timeout: 30000,
                condition: function () {
                    return !! bridge._subWindow.document && bridge._subWindow.document.getElementById("myElementIsThere");
                },
                callback: function () {
                    // checks that changing the root map and the url map in the main window is reflected
                    // in the sub window as maps are linked
                    aria.core.DownloadMgr.updateRootMap({
                        "bridgeTest": {
                            "later": aria.core.DownloadMgr.resolveURL("test/aria/utils/bridge/laterRoot", true) + "/"
                        }
                    });
                    aria.core.DownloadMgr.updateUrlMap({
                        "bridgeTest": {
                            "later" : {
                                "LaterClass": "LaterClass-xyz.js"
                            }
                        }
                    });
                    bridge._subWindow.Aria.load({
                        classes: ["bridgeTest.later.LaterClass"],
                        oncomplete: {
                            scope: this,
                            fn: function () {
                                this.assertEquals(bridge._subWindow.bridgeTest.later.LaterClass.value, "OK-LOADED");
                                this.notifyTestEnd();
                            }
                        }
                    });
                }
            });
        }
    }
});
