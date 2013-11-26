/*
 * Copyright 2013 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

{Template {
	$classpath : "test.aria.html.template.basic.SimpleSubTemplate",
	$hasScript : true,
	$css : ["test.aria.html.template.basic.SimpleSubTemplateCss"],
	$wlibs: {
		"html" : "aria.html.HtmlLibrary"
	}
}}

{macro main ()}
	<p id="subTemplateItem" class="elemContent">
		Sub template content loaded successfully and applied the css.
	</p>

	<h3>Data loaded from module controller </h3>
	<p id="moduleCtrlData">${data.inheritedData}</p>
	<p style="border-bottom:1px solid #ddd;">&nbsp;</p>
	<h3>Databinding in sub-template</h3>

	{@aria:TextField {
	  id : "t2",
	  label:"TextField 2",
	  bind: {
		"value": {
			inside:data, to:"label"
		}
	  }
	} /}

	{@aria:TextField {
	  id : "t3",
	  label:"TextField 3",
	  bind: {
		"value": {
			inside:data, to:"label"
		}
	  }
	} /}



	<p style="border-bottom:1px solid #ddd;">&nbsp;</p>

	{@html:Template {
		id: "viewMainTpl",
		type:"span",
		classpath: "test.aria.html.template.basic.SimpleChildSubTemplate",
		data:data["childTemplateData"],
		attributes:{
			classList:["c1","c2"],
			alt:"This acts like a title"
		}
	}/}


{/macro}

{/Template}