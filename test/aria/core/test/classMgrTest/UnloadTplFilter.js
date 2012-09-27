/**
 * Used for the unloadClass test to redirect test.aria.core.test.classMgrTest.Class1 to
 * test.aria.core.test.classMgrTest.Class1bis
 */
Aria.classDefinition({
	$classpath : 'test.aria.core.test.classMgrTest.UnloadTplFilter',
	$extends : 'aria.core.IOFilter',
	$prototype : {
		onRequest : function (req) {
			req.url = req.url.replace("Tpl1", "Tpl1bis");
		}
	}
});