/**
 * Test Module Interface
 */
Aria.interfaceDefinition({
    $classpath : "test.aria.pageEngine.testContents.modules.TestModuleInterface",
    $extends : "aria.templates.IModuleCtrl",
    $events : {
        "navigate" : {
            description : "",
            properties : {
                "page" : ""
            }
        }
    },
    $interface : {

        triggerNavigation : {
            $type : "Function"
        }
    }
});
