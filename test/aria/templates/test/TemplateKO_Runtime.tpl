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

	{var globalVar=["hello","all","the","world",/]/}

	{macro	main()}

	    // for the classic 'else' issue
		{if (true)}
		 ...
		{else/}
		 ...
		{/if}

		${msain()/}

		{var tmp=\\null/}
		{set tmp=\\otherVar/}
		{checkDefault tmp=1.2.3.56/}


		{@aria:Button { label: doesNotExist.at.all }/}

	{/macro}


{/Template}
