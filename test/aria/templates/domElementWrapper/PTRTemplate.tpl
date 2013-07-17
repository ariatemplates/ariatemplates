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
    $classpath:'test.aria.templates.domElementWrapper.PTRTemplate'

}}

    {macro main()}
        <input type="text" name="fname" id="textInput" />
        <br/>
        <textarea id="textArea"></textarea>
        <br/>
        <select id="selectBox">
          <option value="at">AT</option>
          <option value="jq">Jquery</option>
          <option value="yui">YUI</option>
          <option value="extjs">EXT JS</option>
        </select>
    {/macro}

{/Template}