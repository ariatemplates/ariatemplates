/*
 * Copyright 2015 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.action.sortindicator.fixSortKeyGetter.SortIndicatorSortKeyGetterTestTpl",
    $hasScript : true
}}
    {createView vFriends on friends /}

    {macro main()}
        <table>
            <thead>
                <tr>
                    <th>
                        {@aria:SortIndicator {
                            id: "sortIndicatorFirstName",
                            label: "First name",
                            sortName: "firstName",
                            view: vFriends,
                            sortKeyGetter: {
                                scope: this,
                                fn: this.sortByField,
                                args: {
                                    field: "firstName"
                                }
                            }
                        }/}
                    </th>
                    <th>
                        {@aria:Link {
                            id: "linkBirthDate",
                            label: "Birth date (age)",
                            onclick: this.sortBirthDateClick
                        }/}
                        {@aria:SortIndicator {
                            id: "sortIndicatorBirthDate",
                            sortName: "birthDate",
                            view: vFriends,
                            refreshArgs: [],
                            onclick: this.sortBirthDateClick
                        }/}
                    </th>
                </tr>
            </thead>
            <tbody {id "tableBody"/}>
                {foreach person inView vFriends}
                    <tr>
                        <td>${person.firstName}</td>
                        <td>${person.birthDate|dateFormat:"dd/MM/yyyy"} (${computeAge(person.birthDate)})</td>
                    </tr>
                {/foreach}
            </tbody>
        </table>
    {/macro}

{/Template}
