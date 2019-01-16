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

Aria.classDefinition({
    $classpath : "test.aria.widgets.form.textinput.autocomplete.AutocompleteTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $prototype : {
        runTemplateTest : function () {
            var expectedAutoCompleteValues = {
                "login_username": "username",
                "login_password": "current-password",
                "cp_username": "username",
                "cp_curpassword": "current-password",
                "cp_newpassword1": "new-password",
                "cp_newpassword2": "new-password",
                "contact_organization": "organization",
                "contact_name": "name",
                "contact_street": "street-address",
                "contact_postalcode": "postal-code",
                "contact_city": "address-level2",
                "contact_country": "country-name",
                "contact_email": "email",
                "contact_phone": "tel",
                "tf": null,
                "ta": null,
                "nf": null,
                "pf": null,
                "df": null,
                "time": null,
                "dp": "off",
                "ac": "off",
                "ms": "off",
                "sb": "off",
                "mac": "off"
            };
            var expectedNameValues = {
                "contact_organization": "organization",
                "contact_name": "name",
                "contact_street": "street",
                "contact_postalcode": "postalcode",
                "contact_city": "city",
                "contact_country": "country",
                "contact_email": "email",
                "contact_phone": "phone"
            };

            for (var id in expectedAutoCompleteValues) {
                if (expectedAutoCompleteValues.hasOwnProperty(id)) {
                    var item = this.getInputField(id);
                    var autoCompleteValue = item.getAttribute("autocomplete");
                    var nameValue = item.getAttribute("name");
                    this.assertEquals(autoCompleteValue, expectedAutoCompleteValues[id], "Invalid autocomplete value for " + id + ":, expected %2, got: %1");
                    this.assertEquals(nameValue, expectedNameValues[id] || null, "Invalid name value for " + id + ":, expected %2, got: %1");
                }
            }
            this.end();
        }
    }
});
