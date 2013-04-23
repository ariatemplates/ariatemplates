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
 * Page provider
 */
Aria.classDefinition({
    $classpath : "test.aria.pageEngine.pageEngine.site.PageProvider",
    $implements : ["aria.pageEngine.pageProviders.PageProviderInterface"],
    $constructor : function (navigation) {

        this._navigation = navigation;

    },
    $prototype : {

        /**
         * @param {aria.pageEngine.CfgBeans.ExtendedCallback} callback
         */
        loadSiteConfig : function (callback) {
            var siteConfig = {
                appData : {
                    basefacts : {
                        one : "first",
                        two : "second",
                        third : "third"
                    }
                },
                css : ["test/templateTests/tests/pageEngine/site/css/cssOne.css"],
                containerId : "at-main",
                commonModules : {
                    "m1.m2" : {
                        classpath : "test.aria.pageEngine.pageEngine.site.modules.SimpleModule1",
                        bind : {
                            "message" : "appData:basefacts.one"
                        }
                    }
                }
            };

            if (this._navigation) {
                siteConfig.navigation = this._navigation;
            }
            this.$callback(callback.onsuccess, siteConfig);

        },

        /**
         * @param {String} pageId Id of the page
         * @param {aria.pageEngine.CfgBeans.ExtendedCallback} callback
         */
        loadPageDefinition : function (pageRequest, callback) {
            var cssBasePath = "test/templateTests/tests/pageEngine/site/css/";
            var pageId = pageRequest.pageId;
            if ((!pageId) || (pageId == "aaa")) {
                this.$callback(callback.onsuccess, {
                    pageId : "aaa",
                    url : "/pageEngine/aaa",
                    contents : {
                        menus : {
                            mymenu : []

                        },
                        placeholderContents : {
                            "header" : {
                                value : "<div>Header for page AAAA <div id=\"click-to-b\" href=\"/pageEngine/aaa\">click</a></div>"
                            },
                            "footerOne" : {
                                value : "<div>Footer One for page AAAA</div>"
                            },
                            "footerTwo" : {
                                value : "<div>Footer Two for page AAAA</div>"
                            },
                            "middle" : {
                                value : "<div>The page engine works like a charm</div>"
                            }
                        }
                    },
                    pageComposition : {
                        template : "test.aria.pageEngine.pageEngine.site.templates.MainLayout",
                        css : [cssBasePath + "cssSeven.css"],
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
                                "contentId" : "header",
                                "css" : [cssBasePath + "cssOne.css", cssBasePath + "cssTwo.css"]
                            },
                            "footer" : [{
                                        contentId : "footerOne",
                                        "css" : [cssBasePath + "cssOne.css", cssBasePath + "cssThree.css"]
                                    }, {
                                        contentId : "footerTwo"
                                    }],
                            "body" : {
                                template : "test.aria.pageEngine.pageEngine.site.templates.Body",
                                "css" : [cssBasePath + "cssThree.css", cssBasePath + "cssFour.css"]
                            },
                            "body.left" : {
                                module : "common:m1.m2",
                                template : "test.aria.pageEngine.pageEngine.site.templates.Template1",
                                "css" : [cssBasePath + "cssFive.css", cssBasePath + "cssFour.css"]
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
            if (pageId == "bbb") {
                this.$callback(callback.onsuccess, {
                    pageId : "bbb",
                    url : "/pageEngine/bbb",
                    contents : {
                        menus : {
                            mymenu : []

                        },
                        placeholderContents : {
                            "footerOne" : {
                                value : "<div>Footer One for page BBBB <div id=\"click-to-a\" href=\"/pageEngine/aaa\">click</a></div>"
                            },
                            "footerTwo" : {
                                value : "<div>Footer Two for page BBBB</div>"
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
                                        contentId : "footerTwo",
                                        "css" : [cssBasePath + "cssSix.css"]
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
            if (pageId == "ccc") {
                this.$callback(callback.onsuccess, {
                    pageId : "ccc",
                    url : "/pageEngine/ccc",
                    contents : {
                        menus : {
                            mymenu : []

                        },
                        placeholderContents : {
                            "footerOne" : {
                                value : "<div>Footer One for page CCCC</div>"
                            },
                            "footerTwo" : {
                                value : "<div>Footer Two for page CCCC</div>"
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
                            "header" : "<div>Header for page CCCC</div>",
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