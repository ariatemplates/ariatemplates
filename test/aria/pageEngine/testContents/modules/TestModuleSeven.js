/**
 * Test Module. It provides a method in order to retrievre initArgs
 */
Aria.classDefinition({
    $classpath : "test.aria.pageEngine.testContents.modules.TestModuleSeven",
    $extends : "aria.templates.ModuleCtrl",
    $implements : ["test.aria.pageEngine.testContents.modules.TestModuleSevenInterface"],
    $constructor : function () {
        this.$ModuleCtrl.constructor.call(this);
        this._initArgs = null;
    },
    $destructor : function () {
        this._initArgs = null;
        this.$ModuleCtrl.$destructor.call(this);
    },
    $prototype : {
        $publicInterfaceName : "test.aria.pageEngine.testContents.modules.TestModuleSevenInterface",

        init : function (args, cb) {
            this._initArgs = args;
            this.$callback(cb);
        },

        getInitArgs : function () {
            return this._initArgs;
        }
    }
});
