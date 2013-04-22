/**
 * A contentProcessor used for test purposes
 * @class test.aria.pageEngine.testContents.contentProcessors.ContentProcThree
 * @extends aria.core.JsObject
 * @singleton
 */
Aria.classDefinition({
	$classpath : "test.aria.pageEngine.testContents.contentProcessors.ContentProcThree",
	$extends : "aria.core.JsObject",
	$constructor : function () {},
	$destructor : function () {},
	$prototype : {
		processContent : function (content) {
			return {
				value : content.value + "ContentProcThree",
				contentType : "text/type2"
			};
		}
	}
});
