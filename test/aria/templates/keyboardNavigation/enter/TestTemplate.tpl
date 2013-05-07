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
  $classpath: "test.aria.templates.keyboardNavigation.enter.TestTemplate",
  $hasScript: true
}}

    {macro main ()}

        {section {
            id : "mySectionOne",
            macro : {
              name : "sectionMacro",
              args : ["1"]
            },
            type : "DIV",
            "keyMap" : [{
                key: "enter",
                event : "keyup",
                callback: {
                    fn: "updateLogs",
                    scope: this,
                    args: {
                      log : "section"
                    }
                }
            }]
        } /}

        {section {
            id : "mySectionTwo",
            macro : {
              name : "sectionMacro",
              args : ["2"]
            },
            type : "DIV",
            "keyMap" : [{
                key: "enter",
                event : "keyup",
                callback: {
                    fn: "updateLogs",
                    scope: this,
                    args: {
                      log : "section",
                      stopEvent : true
                    }
                }
            }]
        } /}

        {section {
            id : "mySectionThree",
            macro : {
              name : "sectionMacroTwo",
              args : ["3"]
            },
            type : "DIV",
            "keyMap" : [{
                key: "enter",
                event : "keyup",
                callback: {
                    fn: "updateLogs",
                    scope: this,
                    args: {
                      log : "section",
                      stopEvent : true
                    }
                }
            }]
        } /}
        {section {
            id : "mySectionFour",
            macro : {
              name : "sectionMacro",
              args : ["4"]
            },
            type : "DIV",
            "keyMap" : [{
                key: "enter",
                callback: {
                    fn: "updateLogs",
                    scope: this,
                    args: {
                      log : "section"
                    }
                }
            }]
        } /}

	    {section {
	        id : "logs",
	        macro : "displayLogs",
	        type : "DIV",
	        bindRefreshTo: [{
	            to : "logs",
	            inside : data
	        }]
	    } /}

    {/macro}


    {macro sectionMacro (wId)}

        {@aria:Button {
           id : "myButton" + wId,
           label: "Button",
           onclick: {
             fn: "updateLogs",
                 scope: this,
                 args: {
                 log : "button"
             }
           }
        } /}

        {@aria:Link {
           id : "myLink" + wId,
           label: "Link",
           onclick: {
             fn: "updateLogs",
                 scope: this,
                 args: {
                    log : "link"
                 }
           }
        } /}

        <a href="#" {id "anchor" + wId + "1"/}{on click {fn : "updateLogs", scope : this, args: {log : "anchorOne", preventDefault : true}} /}>first anchor</a>
        <a href="#"
            {id "anchor" + wId + "2"/}
            {on keydown {fn : "updateLogsOnEnter", scope : this, args: {log : "anchorTwoOnEnter"}} /}
            {on click {fn : "updateLogs", scope : this, args: {log : "anchorTwo", preventDefault : true}} /}
        >second anchor</a>

    {/macro}

    {macro sectionMacroTwo (wId)}

        {@aria:Button {
           id : "myButton" + wId,
           label: "Button",
           onclick: {
             fn: "updateLogs",
                 scope: this,
                 args: {
                 log : "button",
                 stopEvent : true
             }
           }
        } /}

        {@aria:Link {
           id : "myLink" + wId,
           label: "Link",
           onclick: {
             fn: "updateLogs",
                 scope: this,
                 args: {
                    log : "link",
                    stopEvent : true
                 }
           }
        } /}

        <a href="#" {id "anchor" + wId + "1"/}{on click {fn : "updateLogs", scope : this, args: {log : "anchorOne", preventDefault : true, stopEvent : true}} /}>first anchor</a>
        <a href="#"
            {id "anchor" + wId + "2"/}
            {on keyup {fn : "updateLogsOnEnter", scope : this, args: {log : "anchorTwoOnEnter", stopEvent : true}} /}
            {on click {fn : "updateLogs", scope : this, args: {log : "anchorTwo", preventDefault : true, stopEvent : true}} /}
        >second anchor</a>

    {/macro}

    {macro displayLogs ()}
        {foreach entry inArray data.logs}
            {separator}<br />{/separator}
            ${entry}
        {/foreach}
    {/macro}

{/Template}
