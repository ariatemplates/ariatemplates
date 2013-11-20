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
	$classpath : "test.aria.html.textarea.autoselect.AutoselectTestCaseTpl",
	$hasScript: true,
	$wlibs : {
		html : "aria.html.HtmlLibrary"
	}
}}

{macro main()}

<div id="testForTextAreaAutoselect">

  {@html:TextArea {
    id: "texttest",
    autoselect: true,
    on : {
        type : "textType",
        click : "textClick"
    },
    bind : {
        value: {
            inside: data,
            to: "location"
        }
    }
  }/}

  {@html:TextArea {
    id: "texttestOne",
    on : {
        type : "textType",
        click : "textClickWithoutAutoselect"
    },
    bind : {
        value: {
            inside: data,
            to: "departure"
        }
    }
  }/}

</div>

<div id="outsideDiv">&nbsp;</div>
{/macro}
{/Template}
