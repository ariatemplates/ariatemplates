/**
 * Custom Transport class for all requests.
 * @class test.aria.core.environment.CustomTransport
 * @extends aria.core.transport.BaseXHR
 * @singleton
 */
Aria.classDefinition({
	$classpath : "test.aria.core.environment.CustomTransport",
	$extends : "aria.core.transport.BaseXHR",
	$singleton : true,
	$constructor : function () {
		this.$BaseXHR.constructor.call(this);
	},
	$prototype : {}
});