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
  $classpath: "test.aria.widgets.container.dialog.indicators.DialogTestTemplate",
  $templates : ["test.aria.widgets.container.dialog.indicators.DialogTestSubTemplate"]
}}

    {macro main()}
        {@aria:Dialog {
          id : "firstDialog",
          bind: {
            visible : {
              to : "visible",
              inside : data
            }
          },
          contentMacro : "dialogMacro"
        }/}
        {@aria:Dialog {
          id : "secondDialog",
          bind: {
            visible : {
              to : "secondVisible",
              inside : data
            }
          },
          contentMacro : "secondDialogMacro"
        }/}
        {@aria:Dialog {
          id : "thirdDialog",
          bind: {
            visible : {
              to : "thirdVisible",
              inside : data
            }
          },
          contentMacro : "thirdDialogMacro"
        }/}
        {section {
          id : "testMainSection",
          bindProcessingTo: {
            to : "secondProcessing",
            inside : data
          },
          macro : "testSectionMacro"
        }/}
    {/macro}

    {macro dialogMacro()}
	    {section {
	      id : "testSection",
	      bindProcessingTo: {
	        to : "processing",
	        inside : data
	      },
	      macro : "testSectionMacro"
	    }/}
    {/macro}

	{macro testSectionMacro()}
		<div style="width: 300px; height: 300px;">The content of the macro is not important</div>
	{/macro}

    {macro secondDialogMacro()}

    {@aria:Template {
      id : "testSubTemplate",
      defaultTemplate: "test.aria.widgets.container.dialog.indicators.DialogTestSubTemplate",
      data : data
    } /}
    {/macro}

    {macro thirdDialogMacro()}
        {@aria:Div {
                    id : "testDiv"
                }}
	        {section {
	          id : "testDivSection",
	          bindProcessingTo: {
	            to : "processing",
	            inside : data
	          },
	          macro : "testSectionMacro"
	        }/}
	    {/@aria:Div}
    {/macro}


{/Template}
