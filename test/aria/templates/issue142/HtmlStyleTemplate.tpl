{Template {
  $classpath:'test.aria.templates.issue142.HtmlStyleTemplate',
  $wlibs : {
		html : "aria.html.HtmlLibrary"
	}
  
}}

	{macro main()}

  	{@html:Template {
  		id: "id1",
  		type:"div",
  		classpath: "test.aria.templates.issue142.HtmlSubTemplate",
  		attributes:{
  			classList:["c1","c2"],
  			title:"This acts like a title",
  			 style: "border:1px solid red;padding:10px;background-color:red;height:100px;width:200px;"
  		}
  	}/}
  
  	{@aria:Template {
      defaultTemplate:"test.aria.templates.issue142.HtmlSubTemplate",
      id:"id2",
      width: 400, 
      height: 150
    }/}

    {@html:Template {
      id: "id3",
      type:"div",
      classpath: "test.aria.templates.issue142.HtmlSubTemplate",
      attributes:{
        classList:["c1","c2"],
        title:"This acts like a title",
        style: "border:1px solid red;padding:10px;background-color:red;"
      }
		}/}

		{@aria:Template {
      defaultTemplate:"test.aria.templates.issue142.HtmlSubTemplate",
      id:"id4"
    }/}

	{/macro}

{/Template}
