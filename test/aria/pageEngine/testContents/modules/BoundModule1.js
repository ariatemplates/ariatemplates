Aria.classDefinition({
    $classpath : "test.aria.pageEngine.testContents.modules.BoundModule1",
    $extends : "aria.templates.ModuleCtrl",
    $implements : ["aria.templates.IModuleCtrl"],
    $prototype : {
        $publicInterfaceName : "aria.templates.IModuleCtrl",

        init : function (initArgs, cb) {
            this._data = initArgs;
            this._data.newValue = false;

            this.$callback(cb);
        }
    }
});
