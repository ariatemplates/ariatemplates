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

Aria.tplScriptDefinition({
    $classpath : "test.aria.widgets.action.sortindicator.fixSortKeyGetter.SortIndicatorSortKeyGetterRobotTestCaseTplScript",
    $dependencies : ["aria.utils.Date"],
    $statics: {
        friends: [
            {
                firstName: "Jeremy",
                birthDate: new Date(1990,5,24)
            }, {
                firstName: "Timothee",
                birthDate: new Date(1996,8,7)
            }, {
                firstName: "Marie",
                birthDate: new Date(1992,7,29)
            }, {
                firstName: "Anne-Claire",
                birthDate: new Date(1988,9,21)
            }, {
                firstName: "Mathilde",
                birthDate: new Date(1990,11,12)
            }
        ]
    },
    $destructor : function () {
        if (this.vFriends) {
            // dispose the view as it is not disposed automatically
            this.vFriends.$dispose();
            this.vFriends = null;
        }
    },
    $prototype : {
        refreshes: 0,
        sortByFieldArgs: null,
        sortByFieldCalls: 0,

        sortByField: function (o, args) {
            if (args === this.sortByFieldArgs) {
                this.sortByFieldCalls++;
            } else {
                this.sortByFieldCalls = 1;
                this.sortByFieldArgs = args;
            }
            return o.value[args.field];
        },

        sortBirthDateClick: function () {
            this.vFriends.toggleSortOrder("birthDate", {
                scope: this,
                fn: this.sortByField,
                args: {
                    field: "birthDate"
                }
            });
            this.vFriends.refresh();
            this.$refresh();
        },

        computeAge: function (date) {
            var now = new Date();
            var diff = now.getFullYear() - date.getFullYear();
            if (now.getMonth() < date.getMonth() || (now.getMonth() == date.getMonth() && now.getDate() < date.getDate())) {
                diff -= 1;
            }
            return diff;
        },

        $afterRefresh: function () {
            this.refreshes++;
        }
    }
});
