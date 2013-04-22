/**
 * Beans to describe the parameters used in aria.pageEngine.pageProviders.BasePageProvider
 */
Aria.beanDefinitions({
    $package : "aria.pageEngine.pageProviders.BasePageProviderBeans",
    $description : "Definition of the beans used in aria.pageEngine.pageProviders.BasePageProvider",
    $namespaces : {
        "json" : "aria.core.JsonTypes"
    },
    $beans : {
        "Config" : {
            $type : "json:Object",
            $description : "Argument given to the constructor.",
            $properties : {
                "siteConfigLocation" : {
                    $type : "json:String",
                    $description : "Location of the file that contains the site configuration.",
                    $mandatory : true
                },
                "pageBaseLocation" : {
                    $type : "json:String",
                    $description : "Location of the folder that contains all the page definitions. Each file containing a page definition has to be called [pageId].json.",
                    $mandatory : true
                },
                "cache" : {
                    $type : "json:Boolean",
                    $description : "Whether to cache page definitions or to re-retrieve them from the speciefied url when navigating to them.",
                    $default : true
                },
                "homePageId" : {
                    $type : "json:String",
                    $description : "Id of the home page. It will be used as a default page.",
                    $mandatory : true
                }
            }
        }
    }
});
