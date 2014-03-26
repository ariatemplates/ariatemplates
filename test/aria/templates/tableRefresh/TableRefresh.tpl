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
   $classpath:'test.aria.templates.tableRefresh.TableRefresh'
}}
    {macro main()}
        <table {id "myTable"/}>
            {call mySectionMacro("head","thead")/}
            {call mySectionMacro("foot","tfoot")/}
            {call mySectionMacro("section1","tbody")/}
            {call mySectionMacro("section2","tbody")/}
            {call mySectionMacro("section3","tbody")/}
        </table>
    {/macro}

    {macro mySectionMacro(name,tagName)}
        {section {
        	id : name,
        	type : tagName,
        	macro : {
        		name : "mySectionContent",
        		args : [name]
        	}
        }/}
    {/macro}

    {macro mySectionContent(name)}
        {call myTRSectionMacro(name+"_1")/}
        {call myTRSectionMacro(name+"_2")/}
    {/macro}

    {macro myTRSectionMacro(name)}
        {section {
        	id : name,
        	type : "TR",
        	macro : {
        		name : "myTRContent",
        		args : [name]
        	}
        }/}
    {/macro}

    {macro myTRContent(name)}
    	<td>${name}.1-${data.refreshNbr}</td><td>${name}.2-${data.refreshNbr}</td>
    {/macro}

{/Template}
