/**
 * Used for the unloadClass test to redirect test.aria.core.test.classMgrTest.Class1 to
 * test.aria.core.test.classMgrTest.Class1bis
 */
Aria.classDefinition({
	$classpath : 'test.aria.core.test.classMgrTest.UnloadFilter',
	$extends : 'aria.core.IOFilter',
	$prototype : {
		onRequest : function (req) {
			req.url = req.url.replace("Class1", "Class1bis");
		}
	}
});