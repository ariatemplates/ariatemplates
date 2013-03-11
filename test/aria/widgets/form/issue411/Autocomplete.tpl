{Template {
	$classpath : "test.aria.widgets.form.issue411.Autocomplete",
	$width : { min : 500 },
	$hasScript: true
	} }
	
	{macro main ( )}
		{@aria:AutoComplete {
			width : 200,
			id : "ac",
			resourcesHandler : getAirLinesHandler(),
			block : true,
			expandButton : true,
			popupWidth : 500,
			popupOpen : true,
			bind: {
				popupOpen : {
	                to : "popupopenAC",
	                inside : data
	            }
	        } }/},
	        
	     {@aria:AutoComplete {
			width : 200,
			id : "ac1",
			resourcesHandler : getAirLinesHandler(),
			block : true,
			popupWidth : 500,
			popupOpen : true,
			bind: {
				popupOpen : {
	                to : "popupopenAC1",
	                inside : data
	            }
	        } }/}
	   
	{/macro}

{/Template}
