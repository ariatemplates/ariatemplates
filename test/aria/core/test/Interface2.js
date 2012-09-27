/**
 * Sample interface definition, extending another interface.
 * @class test.aria.core.test.Interface2
 */
Aria.interfaceDefinition({
	$classpath : "test.aria.core.test.Interface2",
	$extends : "test.aria.core.test.Interface1",
	$events : {
		"MyEventFromInterface2" : "This  event belongs to interface 2."
	},
	$interface : {
		myAdditionnalFunction : function () {}
	}
});