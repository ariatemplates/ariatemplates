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
 * Page provider that raises the pageDefinition change event
 */
Aria.classDefinition({
    $classpath : "test.aria.pageEngine.pageEngine.site.PageProviderThree",
    $implements : ["aria.pageEngine.pageProviders.PageProviderInterface"],
    $constructor : function () {
        this._counter = 0;
    },
    $prototype : {

        raisePageDefinitionChangeEvent : function () {
            this._counter++;
            this.$raiseEvent({
                name : "pageDefinitionChange",
                pageId : "aaa"
            });
        },

        /**
         * @param {aria.pageEngine.CfgBeans.ExtendedCallback} callback
         */
        loadSiteConfig : function (callback) {
            this.$callback(callback.onsuccess, {
                appData : {
                    basefacts : {
                        one : "first",
                        two : "second",
                        third : "third"
                    }
                },
                containerId : "at-main",
                commonModules : {
                    "m1.m2" : {
                        classpath : "test.aria.pageEngine.pageEngine.site.modules.SimpleModule1",
                        bind : {
                            "message" : "appData:basefacts.one"
                        }
                    }
                },
                contentProcessors : {
                    "contentTypeOne" : "test.aria.pageEngine.pageEngine.site.contentProcessors.ContentProcessorOne",
                    "contentTypeTwo" : "test.aria.pageEngine.pageEngine.site.contentProcessors.ContentProcessorTwo"
                }
            });

        },

        /**
         * @param {String} pageId Id of the page
         * @param {aria.pageEngine.CfgBeans.ExtendedCallback} callback
         */
        loadPageDefinition : function (pageRequest, callback) {
            var pageId = pageRequest.pageId;
            if (this._counter === 0) {
                this.$callback(callback.onsuccess, {
                    pageId : "aaa",
                    contents : {
                        menus : {
                            mymenu : []

                        },
                        placeholderContents : {
                            "header" : {
                                value : "<div>Header for page AAAA</div>",
                                contentType : "contentTypeOne"
                            },
                            "footerOne" : {
                                value : "<div>Footer One for page AAAA</div>",
                                contentType : "contentTypeOne"
                            },
                            "footerTwo" : {
                                value : "<div>Footer Two for page AAAA</div>"
                            },
                            "middle" : {
                                value : "<div>The page engine works like a charm</div>",
                                contentType : "contentTypeTwo"
                            }
                        }
                    },
                    pageComposition : {
                        template : "test.aria.pageEngine.pageEngine.site.templates.MainLayout",
                        modules : {
                            "m3" : {
                                classpath : "test.aria.pageEngine.pageEngine.site.modules.SimpleModule2",
                                bind : {
                                    "message" : "appData:basefacts.two"
                                }
                            }
                        },
                        placeholders : {
                            "header" : {
                                "contentId" : "header"
                            },
                            "footer" : [{
                                        contentId : "footerOne"
                                    }, {
                                        contentId : "footerTwo"
                                    }],
                            "body" : {
                                template : "test.aria.pageEngine.pageEngine.site.templates.Body"
                            },
                            "body.left" : {
                                module : "common:m1.m2",
                                template : "test.aria.pageEngine.pageEngine.site.templates.Template1"
                            },
                            "body.middle" : {
                                module : "m3",
                                template : "test.aria.pageEngine.pageEngine.site.templates.Template2"
                            },
                            "body.right" : {
                                contentId : "middle"
                            }
                        }
                    }
                });
            }
            if (this._counter == 1) {
                this.$callback(callback.onsuccess, {
                    pageId : "aaa",
                    contents : {
                        menus : {
                            mymenu : []

                        },
                        placeholderContents : {
                            "footerOne" : {
                                value : "<div>Footer One for page BBBB</div>",
                                contentType : "contentTypeTwo"
                            },
                            "footerTwo" : {
                                value : "<div>Footer Two for page BBBB</div>",
                                contentType : "contentTypeOne"
                            },
                            "middle" : {
                                value : "<div>The page engine works like a charm</div>"
                            }
                        }
                    },
                    pageComposition : {
                        template : "test.aria.pageEngine.pageEngine.site.templates.MainLayout",
                        modules : {
                            "m3" : {
                                classpath : "test.aria.pageEngine.pageEngine.site.modules.SimpleModule3",
                                bind : {
                                    "message" : "appData:basefacts.third"
                                }
                            }
                        },
                        pageData : {
                            message : "myPageData"
                        },
                        placeholders : {
                            "header" : "<div>Header for page BBBB</div>",
                            "footer" : [{
                                        contentId : "footerOne"
                                    }, {
                                        contentId : "footerTwo"
                                    }],
                            "body" : {
                                template : "test.aria.pageEngine.pageEngine.site.templates.Body"
                            },
                            "body.left" : {
                                module : "common:m1.m2",
                                template : "test.aria.pageEngine.pageEngine.site.templates.Template1"
                            },
                            "body.middle" : {
                                module : "m3",
                                template : "test.aria.pageEngine.pageEngine.site.templates.Template3"
                            },
                            "body.right" : {
                                contentId : "middle"
                            }
                        }
                    }
                });
            }
        }
    }
});
