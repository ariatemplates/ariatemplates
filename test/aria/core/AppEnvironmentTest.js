/**
 * Test case for the application environment
 */
Aria.classDefinition({
	$classpath : 'test.aria.core.AppEnvironmentTest',
	$extends : 'aria.jsunit.TestCase',
	$dependencies : ["aria.core.environment.Environment"],
	$constructor : function () {
		this.$TestCase.constructor.call(this);
	},

	$prototype : {

		setUp : function () {
			// resets the environment, so that other tests don't have any impact on tests in this suite
			aria.core.AppEnvironment.setEnvironment({});
		},

		tearDown : function () {
			// resets the environment, so that this suite doesn't have impacts on other tests
			aria.core.AppEnvironment.setEnvironment({});
		}
	}
});
