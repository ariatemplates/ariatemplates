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

Aria.resourcesDefinition({
    $classpath : "test.aria.pageEngine.utils.test.PageConfigOne",
    $resources : {
        pageDef : {
            contents : {
                menus : {
                    "menuOne" : ["childOne", "childTwo"]
                },
                placeholderContents : {}
            },
            pageComposition : {
                template : "main.page.template",
                modules : {
                    "modOne" : {
                        classpath : "module.one.classpath"

                    },
                    "modTwo" : {
                        classpath : "module.two.classpath"

                    },
                    "mod.modthree" : {
                        classpath : "module.three.classpath",
                        initArgs : {
                            some : "args"
                        }
                    },
                    "modFour" : {
                        classpath : "module.two.classpath"

                    },
                    "modFive" : {
                        classpath : "module.two.classpath"
                    }
                },
                placeholders : {
                    "body" : {
                        template : "body.template"
                    },
                    "footer" : {
                        contentId : "footer_content"
                    },
                    "body.top" : {
                        template : "body.first.template"
                    },
                    "body.middle" : {
                        template : "body.middle.template"
                    },
                    "body.bottom" : {
                        template : "body.first.template"
                    },
                    "body.middle.left" : {
                        template : "body.first.template",
                        module : "mod.modthree"
                    },
                    "body.middle.center" : {
                        template : "body.second.template",
                        module : "modOne"
                    },
                    "body.middle.right" : {
                        template : "body.second.template",
                        module : "common:modOne"
                    },
                    "body.middle.top" : {
                        template : "body.second.template",
                        module : "modTwo"
                    },
                    "bottom" : {
                        template : "body.second.template",
                        module : "modFour"
                    },
                    "bottomLeft" : "Some html",
                    "bottomRight" : [{
                                contentId : "bottomRight_content"
                            }, {
                                template : "body.second.template",
                                module : "modNone"
                            }]
                }
            }
        },
        pageDefTwo : {
            contents : {
                menus : {
                    "menuOne" : ["childOne", "childTwo"]
                },
                placeholderContents : {}
            },
            pageComposition : {
                template : "main.page.template",
                css : ["g.css", "h.css"],
                modules : {
                    "modOne" : {
                        classpath : "module.one.classpath"

                    },
                    "modTwo" : {
                        classpath : "module.four.classpath"

                    },
                    "mod.modthree" : {
                        classpath : "module.three.classpath",
                        initArgs : {
                            some : "args"
                        }
                    },
                    "modFour" : {
                        classpath : "module.two.classpath"

                    },
                    "modFive" : {
                        classpath : "module.two.classpath"
                    }
                },
                placeholders : {
                    "body" : {
                        template : "body.template"
                    },
                    "footer" : {
                        contentId : "footer_content",
                        css : ["a.css", "e.css", "f.css"]
                    },
                    "body.top" : {
                        template : "body.first.template",
                        css : ["a.css"]
                    },
                    "body.middle" : {
                        template : "body.middle.template",
                        lazy : true,
                        css : ["b.css"]
                    },
                    "body.bottom" : {
                        template : "body.first.template"
                    },
                    "body.middle.left" : {
                        template : "body.first.template",
                        module : "mod.modthree"
                    },
                    "body.middle.center" : {
                        template : "body.second.template",
                        module : "modOne"
                    },
                    "body.middle.right" : {
                        template : "body.second.template",
                        module : "common:modOne"
                    },
                    "body.middle.top" : {
                        template : "body.second.template",
                        module : "modTwo",
                        lazy : true
                    },
                    "bottom" : {
                        template : "body.second.template",
                        module : "modFour",
                        css : ["d.css"]
                    },
                    "bottomLeft" : "Some html",
                    "bottomRight" : [{
                                contentId : "bottomRight_content",
                                lazy : true,
                                css : ["c.css", "d.css"]
                            }, {
                                template : "body.second.template",
                                module : "modNone"
                            }]
                }
            }
        }
    }
});
