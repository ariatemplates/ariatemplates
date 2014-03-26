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
    $classpath: "test.aria.utils.overlay.loadingIndicator.automatic.SubTemplate"
}}

    {macro main()}

        The sub template simply has another section, but it's in a marco
        {call subSection() /}

    {/macro}

    {macro subSection()}
        {section {
            id : "subSection",
            macro : "subContent"
        }/}
    {/macro}

    {macro subContent()}
        <div style="height: 80px; border: 1px dashed black">&nbsp;</div>
    {/macro}

{/Template}
