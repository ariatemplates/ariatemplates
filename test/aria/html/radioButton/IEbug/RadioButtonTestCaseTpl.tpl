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
	$classpath : "test.aria.html.radioButton.IEbug.RadioButtonTestCaseTpl",
	$wlibs : {
		html : "aria.html.HtmlLibrary"
	}
}}

{macro main()}

{@html:RadioButton {
    value : "a",
	bind : {
		selectedValue : {
			inside : data,
			to : "selectedValue"
		}
	}
}/}
label 1 associated to value 'a'<br>

{@html:RadioButton {
    value : "b",
	bind : {
		selectedValue : {
			inside : data,
			to : "selectedValue"
		}
	}
}/}
label 2 associated to value 'b'<br>

{@html:RadioButton {
    value : "c",
	bind : {
		selectedValue : {
			inside : data,
			to : "selectedValue"
		}
	}
}/}
label 3 associated to value 'c'<br>


{/macro}
{/Template}
