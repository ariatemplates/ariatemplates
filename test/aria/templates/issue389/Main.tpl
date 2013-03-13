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
{Template {
 $classpath:'test.aria.templates.issue389.Main',
 $hasScript : false
}}
    // Template entry point

{macro main()}

<div id="outsideDiv"></div>
 {@aria:Dialog {
    id : "myDialog",
    icon : "std:info",
    width : 400,
    maxHeight : 500,
    modal : true,
    visible : false,
    contentMacro : "myContent",
    closeOnMouseClick : true,
    bind: {
      title: {
        to: 'dialogTitle',
        inside: data
      },
      visible: {
        to: 'visible',
        inside: data
      }
    }
  }/}

{/macro}

{macro myContent()}

    {@aria:TextField {
    id: "textField1",
    label: "Dialog title",
    bind: {
      value: {
        to: 'dialogTitle',
        inside: data
      }
    }
  }/}
{/macro}

{/Template}