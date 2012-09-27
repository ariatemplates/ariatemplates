/*
 * Copyright Amadeus
 */
// Sample resource for reload of resources
Aria.resourcesDefinition({
	$classpath : 'test.aria.core.test.classMgrTest.ExternalResource',
	$resources : {
		"common" : {
			"label" : {
				"ok" : "OK"
			}
		},
		"hello" : {
			"label" : {
				"welcome" : "Welcome to this localized example.",
				"ariaTemplatesDoc" : "Go to Aria Templates Documentation",
				"clickOK" : "You clicked on the OK button."
			},
			"link" : {
				"ariaTemplatesDoc" : "http://topspot/index.php/Aria_Templates"
			}
		}
	}
});