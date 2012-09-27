
/**
 * Test class to test event definition in a sub-class
 */
Aria.classDefinition({
	$classpath:'test.aria.core.test.ClassB',
	$extends:'test.aria.core.test.ClassA',
	$events: {
		"begin":"new event added to Class A list"/*,
		"end":"test to change an event definition (will not work)"*/
		// TODO: correctly test the error message when overriding an already defined event
	},
	$constructor:function() {
		this.$ClassA.constructor.call(this);
	}
})
