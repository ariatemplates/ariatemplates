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
    $classpath : "test.aria.widgets.container.dialog.container.DialogContainerScript",
    $dependencies : ["aria.templates.Layout"],
    $destructor : function() {
        if (this.changeTab) {
            this.$json.removeListener(this.data, "activeTab", this.changeTab);
            this.changeTab = null;
        }
    },
    $prototype : {
        $dataReady: function() {
            this.$json.setValue(this.data, "activeTab", "home");
            if (!this.changeTab) {
                this.changeTab = {
                    fn: this.changeTabListener,
                    scope: this
                };
                this.$json.addListener(this.data, "activeTab", this.changeTab);
            }
        },

        changeTabListener : function (info) {
            var oldDomElt = this.$getElementById(info.oldValue);
            var newDomElt = this.$getElementById(info.newValue);
            oldDomElt.classList.remove("active");
            newDomElt.classList.add("active");
            // The following method makes sure the position of all dialogs
            // inside the current tab is updated (even if there was a resize
            // of the viewport while the tab was hidden)
            aria.templates.Layout.refreshLayout();
        },

        toggleDialog: function(event, name) {
            var propName = name + "Visible";
            this.$json.setValue(this.data, propName, !this.data[propName]);
        }
    }
});
