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
  $classpath : "test.aria.widgets.form.autocomplete.popupposition.AutoCompleteMove",
  $hasScript : true
}}

  {macro main()}

	<div {id "messages"/} style="background-color:red;width:200px;height:0px;"></div>

    {@aria:AutoComplete {
      id : "ac",
      resourcesHandler : getHandler()
    }/} <br/>
    <div {id "underAutoComplete"/} style="background-color:blue;width:10px;height:10px;"></div>

  {/macro}

{/Template}
