/**
 * Test Module
 * @class test.aria.pageEngine.modules.TestModuleTwo
 * @extends aria.templates.ModuleCtrl
 */
Aria.classDefinition({
	$classpath : "test.aria.pageEngine.testContents.modules.TestModuleTwo",
	$extends : "aria.templates.ModuleCtrl",
	$implements : ["test.aria.pageEngine.testContents.modules.ITestModuleController"],
	$constructor : function () {
		this.$ModuleCtrl.constructor.call(this);
	},
	$destructor : function () {
		this.$ModuleCtrl.$destructor.call(this);
	},
	$prototype : {
		$publicInterfaceName : "test.aria.pageEngine.testContents.modules.ITestModuleController"
	}
});
