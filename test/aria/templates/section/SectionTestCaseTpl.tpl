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
    $classpath : "test.aria.templates.section.SectionTestCaseTpl",
    $hasScript : false
}}

    {var count = 0/}

    {macro main()}

        {section {
        	id : "mySimpleSection",
        	macro : "mySimpleMacro"
        }/}

        {section {
        	id : "myTypedSection",
        	type : "div",
        	macro : "myTypedContent"
        }/}

        {section {
            id : "myComplexeSection",
            type : "div",
            bindRefreshTo : [
                {
                    to : null,
                    inside : data
                }
            ],
            macro : "myComplexMacro"
        }/}

        {section {
            id : "mySectionWithMacro1",
            macro : "macroForSection",
            attributes : { classList: ["mySectionClass"] }
        }/}

        {section {
            id : "mySectionWithMacro2",
            macro : {
                name: "macroForSection",
                args: ["initialParam"]
            }
        }/}

    {/macro}

    {macro macroForSection(param)}
        {var dummy = (function () { data.macroRefreshCount += 1; })()/}
        {set dummy = (function () { data.macroParam = param })()/}
    {/macro}

    {macro mySimpleMacro()}
    	mySimpleSection
    {/macro}

    {macro myTypedContent()}
	    <div id="childOfTypedSection">myTypedSection</div>
    {/macro}

    {macro myComplexMacro()}
        // increment refresh counter and clean data.totoValue
        {var dummy = (function () { data.refreshCount += 1; delete data.totoValue;})()/}

        // test inner section widget that set a value in the datamodel -> should not fail
        {@aria:TextField {
            value : "toto",
            bind : {
                value : {
                    inside : data,
                    to : 'totoValue'
                }
            }
        }/}

        <div id="childOfComplexeSection">myComplexeSection</div>
    {/macro}

{/Template}
