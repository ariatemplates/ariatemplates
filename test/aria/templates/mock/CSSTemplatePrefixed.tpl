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




{CSSTemplate {
	someConfiguration: true,
	someOther: "string"
}}

{var index = 0}
{ var zero = 0}
{  var one = 1}

{macro main()}







	#nasty \{

		content : "\{"
	\}
	${varsHereAreDangerous}


	html \{
		margin: ${zero};
		padding: ${zero};
		{for index=0; index<1; index+=1}


			color: black;
			content : "$"
		{/for}
	\}

	{call another()/}
	{ call deep({arg1: 1, arg2: 2} /}
{/macro}

${zero}

{macro another()}{set index += 1}
	p \{
		margin-top: ${index};
		text-align: justify;
	\}
	{var fields = {left:5, right:5, top: 2, bottom: 6} /}
	h3 \{
		{foreach position in fields}
			font-${position}:${fields[position]}
		{/for}
	\}

	{var complex = {object: {another: {0}}} /}
{/macro}

{macro deep(arg1, arg2) }
	{call deeper()/}
{/macro}
{macro deeper()}{call evenmore()/}{/macro}
{macro evenmore()}
	a, a:hover, a:visited \{
		text-decoration: underline;
	\}
{/macro}
{/CSSTemplate}