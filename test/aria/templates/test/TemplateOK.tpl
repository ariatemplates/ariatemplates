/*
 * Copyright 2012 Amadeus s.a.s.
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

// Sample template used to test template class generator
{Template {
	$classpath:'test.aria.templates.test.TemplateOK',
	$hasScript:false,
	$width: {min: 500},
	$height: {min: 600}
}}
	{var globalVar=["hello","all","the","world"]/}
	{var otherVar=globalVar/}

	{macro	main()}

		// test escaped values
		\{ \}

		{var tmp=null/}
		{set tmp=otherVar/}
		{set tmp={}/}
		{set tmp.prop=otherVar/}
		{set tmp.prop.other=otherVar/}
		{call myMacroWithParams(tmp)/}
		{call myMacroWithParams(tmp)  /}
		{call myMacroWithParams(tmp)
		 /}
	{/macro}

	{macro myMacroWithParams(a,b)}
		{checkDefault	b=a/}
		{foreach word in a}
			{if word_ct>1}_{/if}${word|capitalize}
		{/foreach}
		{@aria:Div {sclass:"errortip", width:400}}
			{for var i=0; i<b.length; i++}
				{section {
					id : "mySection"+i,
					macro : {
						name : "mySectionContent",
						args : [i, b]
					}
				}/}
			{/for}
			<br />
			{@aria:Button { label: "OK" }/}
		{/@aria:Div}
	{/macro}

	{macro mySectionContent(i, b)}
		{if i==0}<br>{elseif i==1/}! {else/}-{/if}${b[i]|capitalize}
	{/macro}

{/Template}
