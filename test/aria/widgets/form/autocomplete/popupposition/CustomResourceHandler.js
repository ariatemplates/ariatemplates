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
    $classpath : "test.aria.widgets.form.autocomplete.popupposition.CustomResourceHandler",
    $extends : "aria.resources.handlers.LCResourcesHandler",
    $constructor : function (id) {
        this._messagesEltId = id;
        this._messagesElt = null;
        this.$LCResourcesHandler.constructor.call(this);
    },
    $destructor : function () {
        this._messagesElt = null;
        this.$LCResourcesHandler.$destructor.call(this);
    },
    $prototype : {
        /**
         * Call the callback with an array of suggestions in its arguments.
         * @param {String} textEntry Search string
         * @param {aria.core.CfgBeans.Callback} callback Called when suggestions are ready
         */
        getSuggestions : function (textEntry, callback) {
            var messagesElt = this._messagesElt;
            if (messagesElt == null) {
                messagesElt = Aria.$window.document.getElementById(this._messagesEltId);
                this._messagesElt = messagesElt;
            }
            var show = (textEntry.length % 2) === 0;
            messagesElt.style.height = show ? "200px" : "0";

            this.$callback(callback, {
                suggestions : [{
                            label : "My label 1",
                            code : "CODE1"
                        }, {
                            label : "My label 2",
                            code : "CODE2"
                        }],
                repositionDropDown : true
            });
        }
    }
});
