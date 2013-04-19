Aria.classDefinition({
    $classpath : "test.aria.pageEngine.pageProviders.BaseProviderSiteTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.pageEngine.pageProviders.BasePageProvider",
            "aria.pageEngine.pageProviders.BasePageProviderBeans"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
    },
    $prototype : {

        testAsyncWrongSiteRetrieve : function () {
            this._pageProvider = new aria.pageEngine.pageProviders.BasePageProvider({
                siteConfigLocation : "test/aria/pageEngine/testContents/testSite/wrongsite.json",
                pageBaseLocation : "test/aria/pageEngine/testContents/testSite/pages/",
                homePageId : "firstPage"
            });

            this._pageProvider.loadSiteConfig({
                onsuccess : {},
                onfailure : {
                    fn : this._onSiteConfigFailure,
                    scope : this
                }
            });
        },

        _onSiteConfigFailure : function () {
            this._pageProvider.$dispose();
            this.notifyTestEnd("testAsyncWrongSiteRetrieve");
        },

        testAsyncCorrectSiteRetrieve : function () {
            this._pageProvider = new aria.pageEngine.pageProviders.BasePageProvider({
                siteConfigLocation : "test/aria/pageEngine/testContents/testSite/site.json",
                pageBaseLocation : "test/aria/pageEngine/testContents/testSite/pages/",
                homePageId : "firstPage"
            });
            this._pageProvider.loadSiteConfig({
                onsuccess : {
                    fn : this._onSiteConfigSuccess,
                    scope : this
                },
                onfailure : {}
            });
        },

        _onSiteConfigSuccess : function (siteConfig) {
            this.assertTrue(siteConfig.fake == "site");
            this._pageProvider.$dispose();
            this.notifyTestEnd("testAsyncCorrectSiteRetrieve");
        }

    }

});
