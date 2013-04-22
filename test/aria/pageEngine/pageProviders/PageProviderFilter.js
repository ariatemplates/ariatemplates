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
