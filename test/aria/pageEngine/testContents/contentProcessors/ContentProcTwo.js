/**
 * A contentProcessor used for test purposes
 * @class test.aria.pageEngine.testContents.contentProcessors.ContentProcTwo
 * @extends aria.core.JsObject
 */
Aria.classDefinition({
	$classpath : "test.aria.pageEngine.testContents.contentProcessors.ContentProcTwo",
	$extends : "aria.core.JsObject",
	$constructor : function () {},
	$destructor : function () {},
	$prototype : {
		processContent : function (content) {
			return {
				value : content.value + "ContentProcTwo"
			};
		}
	}
});
