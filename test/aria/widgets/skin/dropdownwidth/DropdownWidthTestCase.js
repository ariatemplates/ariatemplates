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

Aria.classDefinition({
    $classpath : "test.aria.widgets.skin.dropdownwidth.DropdownWidthTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $prototype : {

        _getDropdown : function () {
            var popups = aria.popups.PopupManager.openedPopups;
            return popups.length ? popups[0].domElement : null;
        },

        // textEvidence is used to be sure that the right dropdown is open, and not a one open before
        _isDropdownOpen : function (textEvidence) {
            var div = this._getDropdown();
            return div != null && div.innerHTML.indexOf(textEvidence) > -1 && div.offsetWidth > 0 && div.offsetHeight > 0;
        },

        _checkWidth : function (width) {
            var skinName = aria.widgets.AriaSkin.skinName;
            if (skinName != "atFlatSkin") {
                // In this case, 15 pixels are added to consider the dropdown shadow
                width += 15;
            }

            var div = this._getDropdown();
            this.assertNotEquals(div, null, "The dropdown should be open");
            this.assertEquals(div.offsetWidth, width, "The dropdown's width should be %2 instead of %1");
         },


        runTemplateTest : function () {
            var expandButton = this.getExpandButton("selectBox");
            aria.utils.SynEvents.click(expandButton, {
                fn : function() {
                    this.waitFor({
                        condition: function() {
                            return this._isDropdownOpen("SelectboxItem");
                        },
                        callback : {
                            fn : this.checkSelectboxWidth,
                            scope : this
                        }
                    });
                },
                scope : this
            });
        },

        checkSelectboxWidth : function () {
            this._checkWidth(168);
            this.openMultiselect();
        },

        openMultiselect : function () {
            var expandButton = this.getExpandButton("multiselect");
            aria.utils.SynEvents.click(expandButton, {
                fn : function() {
                    this.waitFor({
                        condition: function() {
                            return this._isDropdownOpen("MultiselectItem");
                        },
                        callback : {
                            fn : this.checkMultiselectWidth,
                            scope : this
                        }
                    });
                },
                scope : this
            });
        },

        checkMultiselectWidth : function () {
            this._checkWidth(248);
            this.openAutocomplete();
        },
        openAutocomplete : function () {
            var expandButton = this.getExpandButton("autocomplete");
            aria.utils.SynEvents.click(expandButton, {
                fn : function() {
                    this.waitFor({
                        condition: function() {
                            return this._isDropdownOpen("all");
                        },
                        callback : {
                            fn : this.checkAutocompleteWidth,
                            scope : this
                        }
                    });
                },
                scope : this
            });
        },

        checkAutocompleteWidth : function () {
            this._checkWidth(168);
            this.openSelect();
        },

        openSelect : function () {
            var expandButton = this.getExpandButton("select");
            aria.utils.SynEvents.click(expandButton, {
                fn : function() {
                    this.waitFor({
                        condition: function() {
                            return this._isDropdownOpen("SelectItem");
                        },
                        callback : {
                            fn : this.checkSelectWidth,
                            scope : this
                        }
                    });
                },
                scope : this
            });
        },

        checkSelectWidth : function () {
            this._checkWidth(170);
            this.end();
        }
    }
});
