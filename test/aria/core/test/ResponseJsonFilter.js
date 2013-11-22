Aria.classDefinition({
    $classpath : "test.aria.core.test.ResponseJsonFilter",
    $extends : "aria.core.IOFilter",
    $prototype : {
        /**
         * Method called before a request is sent to get a chance to change its arguments
         * @param {aria.core.CfgBeans.IOAsyncRequestCfg} request
         */
        onRequest : function (request) {
            if (request.url.indexOf("/getJson") > -1) {
                this.redirectToFile(request, "test/aria/core/test/filterJsonResponse.txt");
            }
        },

        /**
         * Method called when a response is received to change the result values before the callback is called
         * @param {aria.core.CfgBeans.IOAsyncRequestCfg} request
         */
        onResponse : function (response) {
            if (response.res.responseJSON) {
                response.res.responseJSONdefined = true;
            } else {
                response.res.responseJSONdefined = false;
            }
        }
    }
});
