/**
 * Test class implementing an interface and extending another class which implements an interface.
 * @class test.aria.core.test.InheritAndImplementInterface
 */
Aria.classDefinition({
	$classpath : "test.aria.core.test.InheritAndImplementInterface",
	$extends : "test.aria.core.test.ImplementInterface1",
	$implements : ["test.aria.core.test.Interface2"],
	$constructor : function () {
		this.$ImplementInterface1.constructor.call(this);
	},
	$prototype : {
		myAdditionnalFunction : function (param1, param2) {
			// Real implementation here
			this.myData.myAdditionnalFunctionCalled++;
			this.myData.myAFParam1 = param1;
			this.myData.myAFParam2 = param2;
			return param1;
		}
	}
});