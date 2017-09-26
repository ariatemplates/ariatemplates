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
    $classpath: 'test.aria.widgets.container.dialog.resize.dontSelectOnResize.DialogResizeDontSelectRobotTestCaseTpl',
    $hasScript: true
}}

{macro main()}
    {section {
        id: 'main',
        macro: 'displayMain',
        bindRefreshTo: [{inside: this.data, to: 'open', recursive: true}]
    } /}
{/macro}

{macro displayMain()}
    {var commonData = this.getCommonData() /}

    <div><span {id commonData.textId /} >${commonData.textSample}</span></div>
    <div><input {id commonData.inputId /} type='text' value='${commonData.textSample}' /></div>

    {@aria:Dialog this.getDialogConfiguration() /}

    {@aria:Button {
        id: commonData.buttonId,
        label: this.data.open ? 'Close dialog' : 'Open dialog',
        onclick: {
            scope: this,
            fn: this.toggleDialog
        }
    } /}
{/macro}

{macro displayDialog()}
    This is dialog content
{/macro}

{/Template}
