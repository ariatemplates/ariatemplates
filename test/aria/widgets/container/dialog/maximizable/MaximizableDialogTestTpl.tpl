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
    $classpath : "test.aria.widgets.container.dialog.maximizable.MaximizableDialogTestTpl",
    $hasScript : true
}}

{macro main()}
    {call makeButtons() /}

    {call makeOverflows() /}

    // wrapping Dialogs in a section to simulate liquid-layout full section refresh in a test
    {section {
        macro : "macroWithDialogs",
        bindRefreshTo : [{
            inside : data,
            to : "sectionRefreshTimeStamp"
        }]
    } /}
{/macro}

{macro macroWithDialogs()}
        {call dialogMaxi() /}
        {call dialogMaxiFromStart() /}
{/macro}

{macro dialogMaxi()}
    {@aria:Dialog {
        id : "dialogMaxi",
        title: "Maximizable Dialog",
        contentMacro : "dialogContent",
        center : true,
        movable : true,
        resizable : true,
        maximizable : true,
        maxHeight: data.dialog.maxHeight, // this is to check that maximized takes precedence over maxHeight
        bind : {
            width : {
                inside : data.dialog,
                to : "width"
            },
            height : {
                inside : data.dialog,
                to : "height"
            },
            xpos : {
                inside : data.dialog,
                to : "xpos"
            },
            ypos : {
                inside : data.dialog,
                to : "ypos"
            },
            visible : {
                inside : data.dialog,
                to : "visible"
            },
            center : {
                inside : data.dialog,
                to : "center"
            },
            maximized : {
                inside : data.dialog,
                to : "maximized"
            }
        }
    }/}
{/macro}

{macro dialogMaxiFromStart()}
    {@aria:Dialog {
        id : "dialogMaxiFromStart",
        contentMacro : "dialogContent",
        center : false, // true is the default, we want to override it
        movable : true,
        resizable : true,
        maximizable : true,
        bind : {
            width : {
                inside : data.dialogMaxiFromStart,
                to : "width"
            },
            height : {
                inside : data.dialogMaxiFromStart,
                to : "height"
            },
            xpos : {
                inside : data.dialogMaxiFromStart,
                to : "xpos"
            },
            ypos : {
                inside : data.dialogMaxiFromStart,
                to : "ypos"
            },
            visible : {
                inside : data.dialogMaxiFromStart,
                to : "visible"
            },
            maximized : {
                inside : data.dialogMaxiFromStart,
                to : "maximized"
            }
        }
    }/}
{/macro}

{macro dialogContent()}
    <p>
        {for var j=0; j<14; j++}Lorem ipsum dolor sit amet {/for}
    </p>

    {for var i = 0; i < 45; i++}
        line ${i} <br/>
    {/for}
{/macro}

{macro makeButtons()}
    {@aria:Button {
      label : "Toggle visible",
      onclick : {
        fn : buttonClickToggleVisibility
      }
    }/}
    {@aria:Button {
      label : "Toggle maximized",
      onclick : {
        fn : buttonClickToggleMaximized
      }
    }/}
    {@aria:Button {
      label : "Move to (50,50)",
      onclick : {
        fn : buttonClickMoveTo5050
      }
    }/}
    {@aria:Button {
      label : "Make centered",
      onclick : {
        fn : buttonClickMakeCentered
      }
    }/}
{/macro}

{macro makeOverflows()}
    {if data.page.overflowX} // force x overflow
        <p>
        This is to force scrollbars on the page on the X axis<br/><br/>
        {for var j=0; j<4; j++}Donaudampfschiffahrtselektrizitaetenhauptbetriebswerkbauunterbeamtengesellschaft{/for}
        </p>
    {/if}
    {if data.page.overflowY} // force y overflow
        <p>This is to force scrollbars on the page on the Y axis<br/><br/>
        {for var i=0; i<40; i++}test<br/>{/for}
        {call makeButtons() /}
        {for var i=0; i<40; i++}test<br/>{/for}
        </p>
    {/if}
{/macro}

{/Template}
