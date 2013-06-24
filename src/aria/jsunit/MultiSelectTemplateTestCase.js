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

/**
 * Class to be extended to create a template test case that tests the multiselect widget. Provides utility methods
 * related to multiselect.
 */
Aria.classDefinition({
    $classpath : "aria.jsunit.MultiSelectTemplateTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $prototype : {

        /**
         * Helper method for all syn event clicks.
         * @param {Object} inputField
         * @param {Object} next
         * @param {Object} scope
         */
        _MSClick : function (inputField, next, scope) {
            scope.synEvent.click(inputField, {
                fn : next,
                scope : scope
            });
        },

        /**
         * Helper method for all syn event typing.
         * @param {Object} inputField
         * @param {String} keyPresses
         * @param {Object} next
         * @param {Object} scope
         */
        _MSType : function (inputField, keyPresses, next, scope) {
            scope.synEvent.type(inputField, keyPresses, {
                fn : next,
                scope : scope
            });
        },

        /**
         * Return a checkbox of a multiselect
         * @param {String} msId multiselect id
         * @param {Number} index
         */
        getCheckBox : function (msId, index) {
            var ms = this.getWidgetInstance(msId), list = ms.controller.getListWidget();
            if (list._tplWidget) {
                return list._tplWidget.subTplCtxt._mainSection._content[1]._content[0].section._content[index].behavior;
            }
            return null;
        },

        /**
         * Helper to check a multiselect option
         * @param {String} msId multiselect id
         * @param {Number} index
         * @param {Function} continueWith what to do next
         */
        toggleMultiSelectOption : function (msId, index, continueWith) {
            var checkBox = this.getCheckBox(msId, index).getDom();
            if (checkBox) {
                this.synEvent.click(checkBox, {
                    fn : continueWith,
                    scope : this
                });
            }
        },

        /**
         * Helper to check if multiselect is already available and open
         * @param {String} msId
         * @return {Boolean}
         */
        isMultiSelectOpen : function (msId) {
            var listWidget = this.getWidgetInstance(msId).controller.getListWidget();
            return !!(listWidget && listWidget._tplWidget && listWidget._tplWidget.subTplCtxt);
        },

        /**
         * Helper method to be used to toggle the multiselect on (wraps the callback so it's invoked only once the
         * dropdown is visible).
         * @param {String} msId multiselect id
         * @param {Function} continueWithWhenOpened what to do next
         */
        toggleMultiSelectOn : function (msId, continueWithWhenOpened) {
            var msIcon = this.getMultiSelectIcon(msId);
            this.synEvent.click(msIcon, {
                fn : this.__waitMSOpenByClick,
                scope : this,
                args : [msId, continueWithWhenOpened]
            });
        },

        /**
         * Helper method to be used to toggle the multiselect off.
         * @param {String} msId multiselect id
         * @param {Function} continueWith what to do next
         */
        toggleMultiSelectOff : function (msId, continueWith) {
            var msIcon = this.getMultiSelectIcon(msId);
            this.synEvent.click(msIcon, {
                fn : continueWith,
                scope : this
            });
        },

        /**
         * Helper method which checks for the presence of the multiselect and then triggers the callback.
         * @param {String} msId multiselect id
         * @param {Function} continueWith what to do next
         */
        waitUntilMsOpened : function (msId, continueWith) {
            this.__waitUntilMsState(msId, continueWith, true);
        },

        /**
         * Helper method which checks for the lack of presence of the multiselect and then triggers the callback.
         * @param {String} msId multiselect id
         * @param {Function} continueWith what to do next
         */
        waitUntilMsClosed : function (msId, continueWith) {
            this.__waitUntilMsState(msId, continueWith, false);
        },

        /**
         * Private helper which waits for the multiselect to be open/closed and triggers the callback.
         * @param {String} msId multiselect id
         * @param {Function} continueWith what to do next
         * @param {Boolean} wantOpened if we wait for MS to be opened or closed
         */
        __waitUntilMsState : function (msId, continueWith, wantOpened) {
            this.waitFor({
                condition : function () {
                    var isOpen = this.isMultiSelectOpen(msId);
                    return wantOpened ? isOpen : !isOpen;
                },
                callback : {
                    fn : continueWith,
                    scope : this
                }
            });
        },

        /**
         * Private helper which launches callback {args[1]} once multiselect {args[0]} is open.
         * @param {Boolean} bool
         * @param {Array} args
         * @private
         */
        __waitMSOpenByClick : function (bool, args) {
            var msId = args[0];
            var continueWith = args[1];
            this.waitUntilMsOpened(msId, continueWith);
        }
    }
});
