Aria.classDefinition({
    $classpath : "test.aria.core.io.ResponseJsonTestCase",
    $extends : "aria.jsunit.TestCase",
    $prototype : {
        setUp : function () {
            aria.core.IOFiltersMgr.addFilter("test.aria.core.test.ResponseJsonFilter");
        },

        tearDown : function () {
            aria.core.IOFiltersMgr.removeFilter("test.aria.core.test.ResponseJsonFilter");
        },

        testAsyncCallServer : function () {
            aria.core.IO.asyncRequest({
                url : "/getJson",
                callback : {
                    fn : this.callServerUnsetResponseType,
                    scope : this,
                    onerror : this.callServerUnsetResponseType
                },
                expectedResponseType : "json"
            });

        },
        callServerUnsetResponseType : function (res) {
            this.assertTrue(res.responseJSONdefined);
            aria.core.IO.asyncRequest({
                url : "/getJson",
                callback : {
                    fn : this.serverResponseTestEnd,
                    scope : this,
                    onerror : this.serverResponseTestEnd
                }
            });

        },
        serverResponseTestEnd : function (res) {
            this.assertFalse(res.responseJSONdefined);
            this.notifyTestEnd("testAsyncCallServer", true);
        }

    }
});
