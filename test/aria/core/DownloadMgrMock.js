
/**
 * Mock for the DownloadMgr class
 */
Aria.classDefinition({
	$classpath:'test.aria.core.DownloadMgrMock',
	$singleton: true,
	$events: {
		'loadFileContent': {
			'description':'raised when the loadFileContent method is called',
			'properties':{
				'logicalPath':'logicalPath parameter of loadFileContent',
				'content':'content parameter of loadFileContent',
				'hasErrors':'hasErrors parameter of loadFileContent'
			}
		}
	},
	$constructor:function() {
	},
	$prototype:{
		// To be completed with other functions when needed
		loadFileContent:function(logicalPath,content,hasErrors) {
			this.$raiseEvent({name:'loadFileContent',logicalPath: logicalPath, content: content, hasErrors: hasErrors});
		},

		getURLWithTimestamp: function(url) {
			return url;
		}
	}
});