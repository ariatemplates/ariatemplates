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
 * Test for the disposal of templates after navigation
 */
Aria.classDefinition({
    $classpath : "test.aria.pageEngine.pageEngine.PageEngineTemplateDisposalTest",
    $extends : "test.aria.pageEngine.pageEngine.PageEngineBaseTestCase",
    $constructor : function () {
        this.$PageEngineBaseTestCase.constructor.call(this);
        this._dependencies.push("test.aria.pageEngine.pageEngine.site.PageProviderFour");
        this._headChildCount = -1;
    },
    $prototype : {

        _animations : false,

        runTestInIframe : function () {
            this._createPageEngine({
                oncomplete : "_onPageEngineStarted"
            });
        },

        _onPageEngineStarted : function (args) {
            this._testInstanceCount("MainLayout", 1, 0);
            this._testInstanceCount("Body", 1, 0);
            this._testInstanceCount("Template1", 1, 0);
            this._testInstanceCount("Template2", 1, 0);
            this._testInstanceCount("Template3", 0, 0);
            this._testInstanceCount("Template4", 0, 0);
            this._testInstanceCount("Template5", 0, 0);
            this._testInstanceCount("Template6", 0, 0);

            this.pageEngine.navigate({
                pageId : "bbb"
            }, {
                fn : this._afterSecondPageReady,
                scope : this
            });

        },

        _afterSecondPageReady : function () {
            this._testInstanceCount("MainLayout", 2, 1);
            this._testInstanceCount("Body", 2, 1);
            this._testInstanceCount("Template1", 1, 1);
            this._testInstanceCount("Template2", 1, 1);
            this._testInstanceCount("Template3", 1, 0);
            this._testInstanceCount("Template4", 1, 0);
            this._testInstanceCount("Template5", 0, 0);
            this._testInstanceCount("Template6", 0, 0);

            // Issue722
            this._headChildCount = this._testWindow.document.getElementsByTagName("head")[0].childElementCount;

            this.pageEngine.navigate({
                pageId : "ccc"
            }, {
                fn : this._afterThirdPageReady,
                scope : this
            });
        },

        _afterThirdPageReady : function () {
            this._testInstanceCount("MainLayout", 3, 2);
            this._testInstanceCount("Body", 3, 2);
            this._testInstanceCount("Template1", 1, 1);
            this._testInstanceCount("Template2", 1, 1);
            this._testInstanceCount("Template3", 1, 1);
            this._testInstanceCount("Template4", 1, 1);
            this._testInstanceCount("Template5", 1, 0);
            this._testInstanceCount("Template6", 1, 0);

            // Issue722
            this.assertEquals(this._testWindow.document.getElementsByTagName("head")[0].childElementCount, this._headChildCount);

            this.pageEngine.navigate({
                pageId : "bbb"
            }, {
                fn : this._afterFourthPageReady,
                scope : this
            });
        },

        _afterFourthPageReady : function () {
            this._testInstanceCount("MainLayout", 4, 3);
            this._testInstanceCount("Body", 4, 3);
            this._testInstanceCount("Template1", 1, 1);
            this._testInstanceCount("Template2", 1, 1);
            this._testInstanceCount("Template3", 2, 1);
            this._testInstanceCount("Template4", 2, 1);
            this._testInstanceCount("Template5", 1, 1);
            this._testInstanceCount("Template6", 1, 1);

            // Issue722
            this.assertEquals(this._testWindow.document.getElementsByTagName("head")[0].childElementCount, this._headChildCount);

            this.pageEngine.navigate({
                pageId : "ddd"
            }, {
                fn : this._afterFifthPageReady,
                scope : this
            });
        },

        _afterFifthPageReady : function () {
            this._testInstanceCount("MainLayout", 5, 4);
            this._testInstanceCount("Body", 5, 4);
            this._testInstanceCount("Template1", 1, 1);
            this._testInstanceCount("Template2", 1, 1);
            this._testInstanceCount("Template3", 2, 2);
            this._testInstanceCount("Template4", 2, 2);
            this._testInstanceCount("Template5", 2, 1);
            this._testInstanceCount("Template6", 2, 1);

            // Issue722
            this.assertEquals(this._testWindow.document.getElementsByTagName("head")[0].childElementCount, this._headChildCount);

            aria.core.Timer.addCallback({
                fn : this.end,
                scope : this,
                delay : 100
            });
        },

        _createPageEngine : function (args) {
            this.pageProvider = new this._testWindow.test.aria.pageEngine.pageEngine.site.PageProviderFour(this._animations);
            this.pageEngine = new this._testWindow.aria.pageEngine.PageEngine();
            this.pageEngine.start({
                pageProvider : this.pageProvider,
                oncomplete : {
                    fn : this[args.oncomplete],
                    scope : this
                }
            });

        },

        end : function () {
            this._disposePageEngine();
            this._testInstanceCount("MainLayout", 5, 5);
            this._testInstanceCount("Body", 5, 5);
            this._testInstanceCount("Template1", 1, 1);
            this._testInstanceCount("Template2", 1, 1);
            this._testInstanceCount("Template3", 2, 2);
            this._testInstanceCount("Template4", 2, 2);
            this._testInstanceCount("Template5", 2, 2);
            this._testInstanceCount("Template6", 2, 2);

            this.$PageEngineBaseTestCase.end.call(this);
        },

        _disposePageEngine : function () {
            this.pageEngine.$dispose();
            this.pageProvider.$dispose();
        },

        _testInstanceCount : function (tpl, constr, destr) {
            var instanceCounter = this._testWindow.test.aria.pageEngine.pageEngine.site.utils.InstanceCounter;
            instanceCounter.counters[tpl] = instanceCounter.counters[tpl] || {
                constr : 0,
                destr : 0
            };
            this.assertJsonEquals(instanceCounter.counters[tpl], {
                constr : constr,
                destr : destr
            }, "Template " + tpl + "has not been disposed correctly");

        }

    }
});
