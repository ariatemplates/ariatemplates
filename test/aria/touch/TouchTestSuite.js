/**
 * Test suite regrouping all tests on aria.touch
 * @class test.templateTests.tests.touch.TouchTestSuite
 * @extends aria.jsunit.TestSuite
 */
Aria.classDefinition({
	$classpath : 'test.aria.touch.TouchTestSuite',
	$extends : 'aria.jsunit.TestSuite',
	$constructor : function () {
		this.$TestSuite.constructor.call(this);
		this._tests = ["test.aria.touch.gestures.GesturesTestSuite",
		               "test.aria.touch.EventTest"];
	}
});
