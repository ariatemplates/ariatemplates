/*
 * Copyright 2016 Amadeus s.a.s.
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
    $classpath: "test.aria.widgets.wai.input.actionWidget.buttonFocusableWhenDisabled.FocusableDisabledButtonJawsTestCaseTpl",
    $hasScript: true
}}

    {macro main()}
        <div style="margin:10px;">
            <input {id "tf1"/} aria-label="First field"><br>
            {@aria:Button {
                waiAria: true,
                focusableWhenDisabled: true,
                disabled: true,
                label: "First button",
                bind: {
                    disabled: {
                        to: "firstButtonDisabled",
                        inside: data
                    }
                },
                onclick: {
                    fn: buttonClicked,
                    scope: this,
                    args: "firstButton"
                }
            } /}<br>
            {@aria:Button {
                waiAria: true,
                focusableWhenDisabled: true,
                label: "Second button",
                bind: {
                    disabled: {
                        to: "secondButtonDisabled",
                        inside: data
                    }
                },
                onclick: {
                    fn: buttonClicked,
                    scope: this,
                    args: "secondButton"
                }
            } /}<br>
            {@aria:Button {
                waiAria: true,
                // not focusable when disabled
                disabled: true,
                label: "Third button",
                bind: {
                    disabled: {
                        to: "thirdButtonDisabled",
                        inside: data
                    }
                },
                onclick: {
                    fn: buttonClicked,
                    scope: this,
                    args: "thirdButton"
                }
            } /}<br>
            {@aria:Button {
                waiAria: true,
                // not focusable when disabled
                label: "Fourth button",
                bind: {
                    disabled: {
                        to: "fourthButtonDisabled",
                        inside: data
                    }
                },
                onclick: {
                    fn: buttonClicked,
                    scope: this,
                    args: "fourthButton"
                }
            } /}<br>
            <input {id "tf2"/} aria-label="Last field"><br>
            {@aria:CheckBox {
                label: "First button disabled",
                bind: {
                    value: {
                        to: "firstButtonDisabled",
                        inside: data
                    }
                }
            }/}<br>
            {@aria:CheckBox {
                label: "Second button disabled",
                bind: {
                    value: {
                        to: "secondButtonDisabled",
                        inside: data
                    }
                }
            }/}<br>
            {@aria:CheckBox {
                label: "Third button disabled",
                bind: {
                    value: {
                        to: "thirdButtonDisabled",
                        inside: data
                    }
                }
            }/}<br>
            {@aria:CheckBox {
                label: "Fourth button disabled",
                bind: {
                    value: {
                        to: "fourthButtonDisabled",
                        inside: data
                    }
                }
            }/}<br><br>
            {section {
                macro: "buttonClickCounters",
                bindRefreshTo: [
                    {
                        to: "firstButtonNbClicks",
                        inside: data,
                        recursive: false
                    },
                    {
                        to: "secondButtonNbClicks",
                        inside: data,
                        recursive: false
                    },
                    {
                        to: "thirdButtonNbClicks",
                        inside: data,
                        recursive: false
                    },
                    {
                        to: "fourthButtonNbClicks",
                        inside: data,
                        recursive: false
                    }
                ]
            } /}
        </div>
    {/macro}

    {macro buttonClickCounters()}
        First button was clicked ${data.firstButtonNbClicks|default:0} time(s)<br>
        Second button was clicked ${data.secondButtonNbClicks|default:0} time(s)<br>
        Third button was clicked ${data.thirdButtonNbClicks|default:0} time(s)<br>
        Fourth button was clicked ${data.fourthButtonNbClicks|default:0} time(s)<br>
    {/macro}

{/Template}
