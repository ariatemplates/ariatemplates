{Template {
	$classpath : "test.aria.widgets.form.issue411.Select",
	$width : { min : 500 }
	} }
	
	{macro main ( )}
		{@aria:Select {
			id : "select",
	     	options: data.options,
	     	popupOpen : true,
			bind: {
	           popupOpen : {
	                to : "popupopenSelect",
	                inside : data
	            }
	        }
    	}/}  
	{/macro}

{/Template}
