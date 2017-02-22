/*
 * Copyright 2017 Amadeus s.a.s.
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
    $classpath: 'test.aria.templates.binding.recursiveBindingLeak.RecursiveBindingLeakTestCaseTpl',
    $hasScript : true
}}

    {macro main()}
        {section {
            bindRefreshTo: [{
                inside: data,
                to: "someAttribute",
                recursive: true
            }],
            macro : "hello1"
        }/}<br>
        {section {
            bindRefreshTo: [{
                inside: data,
                to: "someAttribute",
                recursive: false
            }],
            macro : "hello2"
        }/}<br><br>
        {@aria:Button {
            label: "Trigger refresh",
            onclick: triggerRefresh
        }/}
    {/macro}

    {macro hello1()}
        Hello 1
    {/macro}

    {macro hello2()}
        Hello 2
    {/macro}

{/Template}