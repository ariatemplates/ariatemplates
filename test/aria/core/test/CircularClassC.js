/**
 * Test class for detection of circular reference
 * @class test.aria.core.test.CircularClassC
 */
Aria.classDefinition({
	$classpath : 'test.aria.core.test.CircularClassC',
	$dependencies : ['test.aria.core.test.CircularClassF', 'test.aria.core.test.CircularClassA'],
	$constructor : function () {
		// TODO: implement constructor
	},
	$destructor : function () {
		// TODO: implement destructor
	},
	$prototype : {

		/**
		 * TODOC
		 */
		myPublicFunction : function () {},

		/**
		 * @private TODOC
		 */
		_myPrivateFunction : function () {}

	}
});