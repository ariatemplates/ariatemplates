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
  $classpath:"test.aria.widgets.form.autocomplete.iframe.AutoCompleteTpl",
  $hasScript:true,
  $width: {min: 500}
}}

{macro main()}
  <h1>Closing the AutoComplete when clicking on an iframe</h1>
  <iframe {id "display" /}></iframe>
  {@aria:AutoComplete {
      label : "Enter a country beginning by A:",
      resourcesHandler : getHandler(),
      expandButton : true,
      id: "ac1"
  }/}

  <select name="select">
    <option value="value1">Valeur 1</option>
    <option value="value2" >Valeur 2</option>
    <option value="value3">Valeur 3</option>
  </select>
{/macro}

{/Template}
