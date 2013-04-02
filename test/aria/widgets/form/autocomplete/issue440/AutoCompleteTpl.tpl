{Template {
	$classpath:'test.aria.widgets.form.autocomplete.issue440.AutoCompleteTpl',
	$hasScript:true,
	$width: {min: 500}
}}

		


	{macro main()}
		<h2>AutoComplete with AIR resources handler</h2> <br />
		
		{@aria:AutoComplete {
			id: "acDest1",
			label:"Choose your destination: ",			
			labelPos:"left",
			labelAlign:"right",
			width:400,
			block:false,
			labelWidth:180,
			resourcesHandler:getAirLinesHandler(),
			bind:{
			  	"value" : {
			  		inside : data, 
			  		to : 'ac_air_value'
		  		}
			},
			selectionKeys : [{
						key : "a"
					}]	
		}/}		
		
		{@aria:AutoComplete {
			id: "acDest2",
			label:"Choose your destination: ",			
			labelPos:"left",
			labelAlign:"right",
			width:400,
			block:false,
			labelWidth:180,
			resourcesHandler:getAirLinesHandler(),
			bind:{
			  	"value" : {
			  		inside : data, 
			  		to : 'ac_air_value'
		  		}
			}	
		}/}		
		
	{/macro}

{/Template}