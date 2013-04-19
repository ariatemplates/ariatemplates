Aria.classDefinition({
    $classpath : "test.aria.pageEngine.testContents.modules.SimpleModule1",
    $extends : "aria.templates.ModuleCtrl",
    $implements : ["aria.templates.IModuleCtrl"],
    $prototype : {
        $publicInterfaceName : "aria.templates.IModuleCtrl",

        init : function (initArgs, cb) {
            this.$callback(cb);
        }
    }
});
