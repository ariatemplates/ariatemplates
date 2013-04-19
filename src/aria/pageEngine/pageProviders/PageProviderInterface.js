/**
 * Public API of a page provider
 */
Aria.interfaceDefinition({
    $classpath : 'aria.pageEngine.pageProviders.PageProviderInterface',
    $events : {
        "pageDefinitionChange" : {
            description : "Raised when the definition of a page changes.",
            properties : {
                "pageId" : "Identifier of the page that has changed"
            }
        }
    },
    $interface : {

        /**
         * @param {aria.pageEngine.CfgBeans.ExtendedCallback} callback
         */
        loadSiteConfig : function (callback) {},

        /**
         * @param {aria.pageEngine.CfgBeans.PageNavigationInformation} pageRequest
         * @param {aria.pageEngine.CfgBeans.ExtendedCallback} callback
         */
        loadPageDefinition : function (pageRequest, callback) {}

    }
});
