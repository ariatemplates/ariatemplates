/*
 * Copyright 2019 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.form.textinput.autocomplete.AutocompleteTestCaseTpl",
    $extends : "test.aria.widgets.form.textinput.onclick.OnClickTemplate",
    $hasScript : true
}}
    {macro main()}
        <form {on submit {fn: onSubmit, args: data.login}/} style="margin: 10px; border: 1px solid blue; padding: 10px;">
            <strong>Login form</strong><br><br>
            {@aria:TextField {
                id: "login_username",
                label: "User name",
                labelWidth: 100,
                autocomplete: "username",
                bind: {
                    value: {
                        to: "username",
                        inside: data.login
                    }
                }
            }/}<br>
            {@aria:PasswordField {
                id: "login_password",
                label: "Password",
                labelWidth: 100,
                autocomplete: "current-password",
                bind: {
                    value: {
                        to: "password",
                        inside: data.login
                    }
                }
            }/}<br>
            <br>
            <button type="submit">Login</button>
        </form>
        <form {on submit {fn: onSubmit, args: data.cp}/} style="margin: 10px; border: 1px solid blue; padding: 10px;">
            <strong>Change password</strong><br><br>
            {@aria:TextField {
                id: "cp_username",
                label: "User name",
                labelWidth: 100,
                autocomplete: "username",
                bind: {
                    value: {
                        to: "username",
                        inside: data.cp
                    }
                }
            }/}<br>
            {@aria:PasswordField {
                id: "cp_curpassword",
                label: "Current password",
                labelWidth: 100,
                autocomplete: "current-password",
                bind: {
                    value: {
                        to: "curpassword",
                        inside: data.cp
                    }
                }
            }/}<br>
            {@aria:PasswordField {
                id: "cp_newpassword1",
                label: "New password",
                labelWidth: 100,
                autocomplete: "new-password",
                bind: {
                    value: {
                        to: "newpassword1",
                        inside: data.cp
                    }
                }
            }/}<br>
            {@aria:PasswordField {
                id: "cp_newpassword2",
                label: "Confirm password",
                labelWidth: 100,
                autocomplete: "new-password",
                bind: {
                    value: {
                        to: "newpassword2",
                        inside: data.cp
                    }
                }
            }/}<br>
            <br>
            <button type="submit">Change password</button>
        </form>
        <form {on submit {fn: onSubmit, args: data.contact}/} style="margin: 10px; border: 1px solid blue; padding: 10px;">
            <strong>Contact information</strong><br><br>
            {@aria:TextField {
                id: "contact_organization",
                name: "organization",
                label: "Organization",
                labelWidth: 100,
                autocomplete: "organization",
                bind: {
                    value: {
                        to: "organization",
                        inside: data.contact
                    }
                }
            }/}<br>
            {@aria:TextField {
                id: "contact_name",
                name: "name",
                label: "Name",
                labelWidth: 100,
                autocomplete: "name",
                bind: {
                    value: {
                        to: "name",
                        inside: data.contact
                    }
                }
            }/}<br>
            {@aria:Textarea {
                id: "contact_street",
                name: "street",
                label: "Street",
                labelWidth: 100,
                autocomplete: "street-address",
                bind: {
                    value: {
                        to: "street",
                        inside: data.contact
                    }
                }
            }/}<br>
            {@aria:TextField {
                id: "contact_postalcode",
                name: "postalcode",
                label: "Postal code",
                labelWidth: 100,
                autocomplete: "postal-code",
                bind: {
                    value: {
                        to: "postalcode",
                        inside: data.contact
                    }
                }
            }/}<br>
            {@aria:TextField {
                id: "contact_city",
                name: "city",
                label: "City",
                labelWidth: 100,
                autocomplete: "address-level2",
                bind: {
                    value: {
                        to: "city",
                        inside: data.contact
                    }
                }
            }/}<br>
            {@aria:TextField {
                id: "contact_country",
                name: "country",
                label: "Country",
                labelWidth: 100,
                autocomplete: "country-name",
                bind: {
                    value: {
                        to: "country",
                        inside: data.contact
                    }
                }
            }/}<br>
            {@aria:TextField {
                id: "contact_email",
                name: "email",
                label: "E-mail",
                labelWidth: 100,
                autocomplete: "email",
                bind: {
                    value: {
                        to: "email",
                        inside: data.contact
                    }
                }
            }/}<br>
            {@aria:TextField {
                id: "contact_phone",
                name: "phone",
                label: "Phone",
                labelWidth: 100,
                autocomplete: "tel",
                bind: {
                    value: {
                        to: "phone",
                        inside: data.contact
                    }
                }
            }/}<br>
            <br>
            <button type="submit">Confirm</button>
        </form>

        {@aria:TextField {
            id: "tf"
        }/}

        {@aria:Textarea {
            id: "ta"
        }/}

        {@aria:NumberField {
            id: "nf"
        }/}

        {@aria:PasswordField {
            id: "pf"
        }/}

        {@aria:DateField {
            id: "df"
        }/}

        {@aria:TimeField {
            id: "time"
        }/}

        {@aria:DatePicker {
            id: "dp"
        }/}

        {@aria:AutoComplete {
            id: "ac",
            resourcesHandler: this.airlinesHandler
        }/}

        {@aria:MultiSelect {
            id: "ms",
            items: [{value : "a", code : "a"},{value : "b", code : "b"}]
        }/}

        {@aria:SelectBox {
            id: "sb",
            options: [{label : "a", value : "a"},{label : "b", value : "b"}]
        }/}

        {@aria:MultiAutoComplete {
            id: "mac",
            resourcesHandler: this.airlinesHandler
        }/}
    {/macro}
{/Template}
