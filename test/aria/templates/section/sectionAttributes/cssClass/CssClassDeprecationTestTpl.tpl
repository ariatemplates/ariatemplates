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

/* BACKWARD-COMPATIBILITY-BEGIN (cssclass) */
// This class must be completely deleted when the cssClass feature is completely removed

{Template {
	$classpath : "test.aria.templates.section.sectionAttributes.cssClass.CssClassDeprecationTestTpl"
}}

    {macro main()}
		// just cssClass
        {section {
        	id : "sectionOne",
        	macro : "anyMacro",
        	cssClass : "classOne classTwo classThree"
        }/}

        // cssClass and non-conflicting attributes
        {section {
        	id : "sectionTwo",
        	macro : "anyMacro",
        	attributes : data.sectionTwo.attributes,
        	cssClass : "classOne classTwo classThree"
        }/}

        // cssClass and conflicting attributes
        {section {
        	id : "sectionThree",
        	macro : "anyMacro",
        	attributes : data.sectionThree.attributes,
        	cssClass : "classOne classTwo classThree"
        }/}

        // cssClass and conflicting binding
        {section {
        	id : "sectionFour",
        	macro : "anyMacro",
        	cssClass : "classOne classTwo classThree",
        	bind : {
        		attributes : {
        			to : "attributes",
        			inside : data.sectionFour
        		}
        	}
        }/}

        // cssClass and non-conflicting binding to null
        {section {
        	id : "sectionFive",
        	macro : "anyMacro",
        	cssClass : "classOne classTwo classThree",
        	bind : {
        		attributes : {
        			to : "attributes",
        			inside : data.sectionFive
        		}
        	}
        }/}

        // cssClass and non-conflicting binding to a non-empty object
        {section {
        	id : "sectionSix",
        	macro : "anyMacro",
        	cssClass : "classOne classTwo classThree",
        	bind : {
        		attributes : {
        			to : "attributes",
        			inside : data.sectionSix
        		}
        	}
        }/}

    {/macro}

    {macro anyMacro()}
        The content of this macro is unimportant
    {/macro}

{/Template}
/* BACKWARD-COMPATIBILITY-END (cssclass) */