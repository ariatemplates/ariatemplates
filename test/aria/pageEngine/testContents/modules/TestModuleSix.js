/**
 * Test Module
 */
Aria.classDefinition({
    $classpath : "test.aria.pageEngine.testContents.modules.TestModuleSix",
    $extends : "aria.templates.ModuleCtrl",
    $implements : ["test.aria.pageEngine.testContents.modules.TestModuleInterface"],
    $constructor : function () {
        this.$ModuleCtrl.constructor.call(this);
    },
    $destructor : function () {
        this.$ModuleCtrl.$destructor.call(this);
    },
    $prototype : {
        $publicInterfaceName : "test.aria.pageEngine.testContents.modules.TestModuleInterface",

        triggerNavigation : function () {
            this.$raiseEvent({
                name : "navigate",
                page : {
                    pageId : "AAAA"
                }
            });

        }
    }
});
