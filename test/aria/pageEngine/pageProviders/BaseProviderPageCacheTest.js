Aria.classDefinition({
    $classpath : "test.aria.pageEngine.pageProviders.BaseProviderPageCacheTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.pageEngine.pageProviders.BasePageProvider",

            "test.aria.pageEngine.pageProviders.PageProviderFilter", "aria.core.IOFiltersMgr"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
    },
    $prototype : {

        setUp : function () {
            this._testData = {};
            this._filter = new test.aria.pageEngine.pageProviders.PageProviderFilter(this._testData);
            aria.core.IOFiltersMgr.addFilter(this._filter);
        },

        tearDown : function () {
            aria.core.IOFiltersMgr.removeFilter(this._filter);
            this._filter.$dispose();
            this._testData = null;
        },

        testAsyncWrongPage : function () {
            this._pageProvider = new aria.pageEngine.pageProviders.BasePageProvider({
                siteConfigLocation : "test/aria/pageEngine/testContents/testSite/site.json",
                pageBaseLocation : "test/aria/pageEngine/testContents/testSite/pages/",
                homePageId : "firstPage"
            });

            this._pageProvider.loadPageDefinition({
                pageId : "fake"
            }, {
                onsuccess : {},
                onfailure : {
                    fn : this._onPageConfigFailure,
                    scope : this
                }
            });
        },

        _onPageConfigFailure : function () {
            this._pageProvider.$dispose();
            this.notifyTestEnd("testAsyncWrongPage");
        },

        testAsyncPageWithCache : function () {
            this._pageProvider = new aria.pageEngine.pageProviders.BasePageProvider({
                siteConfigLocation : "test/aria/pageEngine/testContents/testSite/site.json",
                pageBaseLocation : "test/aria/pageEngine/testContents/testSite/pages/",
                homePageId : "firstPage"
            });

            this._pageProvider.loadPageDefinition(null, {
                onsuccess : {
                    fn : this._testAsyncPageWithCacheCbOne,
                    scope : this
                },
                onfailure : {}
            });
        },

        _testAsyncPageWithCacheCbOne : function (pageDef) {
            this.assertJsonEquals(pageDef, {
                pageId : "firstPage",
                url : "/app/first"
            });
            this.assertTrue(this._testData.firstPage == 1);
            this._pageProvider.loadPageDefinition({
                url : "/app/first"
            }, {
                onsuccess : {
                    fn : this._testAsyncPageWithCacheCbTwo,
                    scope : this
                },
                onfailure : {}
            });
        },

        _testAsyncPageWithCacheCbTwo : function (pageDef) {
            this.assertJsonEquals(pageDef, {
                pageId : "firstPage",
                url : "/app/first"
            });
            this.assertTrue(this._testData.firstPage == 1);
            this._pageProvider.loadPageDefinition({
                pageId : "firstPage",
                url : "/app/first/new"
            }, {
                onsuccess : {
                    fn : this._testAsyncPageWithCacheCbThree,
                    scope : this
                },
                onfailure : {}
            });
        },

        _testAsyncPageWithCacheCbThree : function (pageDef) {
            this.assertJsonEquals(pageDef, {
                pageId : "firstPage",
                url : "/app/first/new"
            });
            this.assertTrue(this._testData.firstPage == 1);
            this._pageProvider.loadPageDefinition({
                url : "/app/first/new"
            }, {
                onsuccess : {
                    fn : this._testAsyncPageWithCacheCbFour,
                    scope : this
                },
                onfailure : {}
            });
        },

        _testAsyncPageWithCacheCbFour : function (pageDef) {
            this.assertJsonEquals(pageDef, {
                pageId : "firstPage",
                url : "/app/first/new"
            });
            this.assertTrue(this._testData.firstPage == 1);
            this._testData.firstPage = 0;
            this._pageProvider.loadPageDefinition({
                pageId : "secondPage"
            }, {
                onsuccess : {
                    fn : this._testAsyncPageWithCacheCbFive,
                    scope : this
                },
                onfailure : {}
            });
        },

        _testAsyncPageWithCacheCbFive : function (pageDef) {
            this.assertJsonEquals(pageDef, {
                pageId : "secondPage",
                url : "/secondPage"
            });
            this.assertTrue(this._testData.secondPage == 1);

            this._pageProvider.loadPageDefinition({
                url : "/secondPage"
            }, {
                onsuccess : {
                    fn : this._testAsyncPageWithCacheCbSix,
                    scope : this
                },
                onfailure : {}
            });
        },

        _testAsyncPageWithCacheCbSix : function (pageDef) {
            this.assertJsonEquals(pageDef, {
                pageId : "secondPage",
                url : "/secondPage"
            });
            this.assertTrue(this._testData.secondPage == 1);
            this._testData.secondPage = 0;
            this._pageProvider.loadPageDefinition({
                pageId : "thirdPage",
                url : "/app/another/page"
            }, {
                onsuccess : {
                    fn : this._testAsyncPageWithCacheCbSeven,
                    scope : this
                },
                onfailure : {}
            });
        },

        _testAsyncPageWithCacheCbSeven : function (pageDef) {
            this.assertJsonEquals(pageDef, {
                pageId : "thirdPage",
                url : "/app/another/page"
            });
            this.assertTrue(this._testData.thirdPage == 1);
            this._pageProvider.loadPageDefinition({
                url : "/app/third"
            }, {
                onsuccess : {
                    fn : this._testAsyncPageWithCacheCbEight,
                    scope : this
                },
                onfailure : {}
            });
        },

        _testAsyncPageWithCacheCbEight : function (pageDef) {
            this.assertJsonEquals(pageDef, {
                pageId : "thirdPage",
                url : "/app/third"
            });
            this.assertTrue(this._testData.thirdPage == 1);
            this._pageProvider.$dispose();
            this.notifyTestEnd("testAsyncPageWithCache");
        }

    }

});
