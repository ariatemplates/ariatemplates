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
   $classpath: "test.aria.utils.overlay.loadingIndicator.refresh.RefreshTestCaseTpl"
}}
	{macro main()}
		{if data.myBoolean}
			{section {
				id: "mySection",
				bindProcessingTo: {
					to: "processing",
					inside: data
				},
				macro: "myContent"
			}/}
		{/if}
 	{/macro}

 	{macro myContent()}
 		<div style="width:200px;height:200px;border:1px solid black;">
 			This is a section which is displayed only when a special condition is set.
 		</div>
 	{/macro}

{/Template}
