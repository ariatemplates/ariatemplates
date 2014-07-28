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

Aria.tplScriptDefinition({
    $classpath : "atplugins.lightWidgets.autocomplete.AutocompleteTemplateScript",
    $constructor : function () {
        this._refContainer = "suggestionsRows";
        this._itemShift = 0;
        this.onKbNav = {
            fn : this._onKeyboardNavigation,
            scope : this
        };
    },

    $destructor : function () {
        this.$json.removeListener(this.data, "highlightedIdx", this.onKbNav);
    },

    $prototype : {

        $dataReady : function () {
            if (this.data.preselect !== undefined) {
                var hasPreselect = this.data.preselect;
                // this.data.highlightedIdx = this.data.selectedIdx;
            }

        },

        $displayReady : function () {
            this.$json.addListener(this.data, "highlightedIdx", this.onKbNav);
        },

        itemClick : function (evt) {
            evt.preventDefault();
            evt.stopPropagation();
            if (this.data.popupOpen) {
                var itemIdx = evt.target.getData("itemIdx", true);
                if (itemIdx) {
                    this.$json.setValue(this.data, "selectedIdx", this.data.highlightedIdx);
                    this.$json.setValue(this.data, "popupOpen", false);
                }
            }
        },

        itemMouseOver : function (evt) {
            if (this.data.popupOpen) {
                var itemIdx = evt.target.getData("itemIdx", true);
                if (itemIdx) {
                    var oldHighlighted = this.data.highlightedIdx;
                    var newHighlighted = parseInt(itemIdx, 10);

                    this.data.oldHighlightedIdx = oldHighlighted;
                    this.data.highlightedIdx = newHighlighted;
                    if (oldHighlighted >= 0) {
                        this.$getElementById("itemIdx" + oldHighlighted).classList.setClassName(this._getClassForItem(oldHighlighted));
                    }
                    this.$getElementById("itemIdx" + newHighlighted).classList.setClassName(this._getClassForItem(newHighlighted));
                }
            }
        },

        _getClassForItem : function (itemIndex) {
            var retVal = [this.data.skin.cssClassItem];
            if (itemIndex == this.data.highlightedIdx) {
                retVal.push(this.data.skin.cssClassSelected);
            }
            if (this.data.disabled) {
                retVal.push(this.data.skin.cssClassDisabled);
            } else {
                retVal.push(this.data.skin.cssClassEnabled);
            }
            return retVal.join(" ");

        },

        _onKeyboardNavigation : function (change) {

            var itemIdx = change.newValue;
            if (change.oldValue != this.data.oldHighlightedIdx) {
                var oldHighlighted = this.data.oldHighlightedIdx;
            } else {
                var oldHighlighted = change.oldValue;
            }

            var newHighlighted = itemIdx;

            this.data.highlightedIdx = newHighlighted;
            if (oldHighlighted !== undefined) {
                this.$getElementById("itemIdx" + oldHighlighted).classList.setClassName(this._getClassForItem(oldHighlighted));
            }
            this.$getElementById("itemIdx" + newHighlighted).classList.setClassName(this._getClassForItem(newHighlighted));

            this.$json.setValue(this.data, "highlightedIdx", newHighlighted);
        }
    }
});