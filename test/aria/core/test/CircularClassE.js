/**
 * Test class for detection of circular reference
 * @class test.aria.core.test.CircularClassB
 */
Aria.classDefinition({
	$classpath : 'test.aria.core.test.CircularClassE',
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