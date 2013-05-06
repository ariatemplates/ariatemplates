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

Aria.classDefinition({
    $classpath : "test.aria.embed.placeholder.resources.ContentProviderOne",
    $implements : ["aria.embed.IContentProvider"],
    $constructor : function () {
        this.mode = 0;
    },
    $prototype : {
        getContent : function (path) {
            if (this.mode === 0) {

                if (path == "body") {
                    return "mode0bodyContentOne";

                }
            }
            if (this.mode === 1) {
                if (path == "body") {
                    return ["mode1bodyContentOne", {
                                classpath : "test.aria.embed.placeholder.resources.BodyTemplate"
                            }];

                }
                if (path == "body.middle") {
                    return "mode1bodyMiddleContentOne";
                }
                if (path == "body.middle.bottom") {
                    return "mode1bodyMiddleBottomContentOne";
                }
            }
            if (this.mode === 2) {
                if (path == "body") {
                    return ["mode1bodyContentOne", {
                                classpath : "test.aria.embed.placeholder.resources.BodyTemplate"
                            }];

                }
                if (path == "body.middle") {
                    return "mode1bodyMiddleContentModifiedOne";
                }
                if (path == "body.middle.bottom") {
                    return {
                        classpath : "test.aria.embed.placeholder.resources.SampleTemplate",
                        moduleCtrl : {
                            classpath : "test.aria.embed.placeholder.resources.SampleModule"
                        }
                    };
                }
                if (path == "body.left") {
                    return "bodyleft";

                }
            }
        }
    }
});
