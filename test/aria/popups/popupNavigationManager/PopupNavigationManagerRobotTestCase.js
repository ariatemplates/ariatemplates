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

var Aria = require('ariatemplates/Aria');
var EnhancedRobotBase = require('test/EnhancedRobotBase');
var PopupNavigationManager = require('ariatemplates/popups/PopupNavigationManager');

var ariaUtilsString = require('ariatemplates/utils/String');
var subst = ariaUtilsString.substitute;
var ariaUtilsDom = require('ariatemplates/utils/Dom');



module.exports = Aria.classDefinition({
    $classpath : 'test.aria.popups.popupNavigationManager.PopupNavigationManagerRobotTestCase',
    $extends : EnhancedRobotBase,

    $constructor : function () {
        this.$EnhancedRobotBase.constructor.call(this);

        this.setTestEnv({
            template : 'test.aria.popups.popupNavigationManager.Tpl',
            data: {}
        });
    },



    ////////////////////////////////////////////////////////////////////////////
    //
    ////////////////////////////////////////////////////////////////////////////

    $prototype : {
        ////////////////////////////////////////////////////////////////////////
        // Tests
        ////////////////////////////////////////////////////////////////////////

        runTemplateTest : function () {
            this._localAsyncSequence(function (add) {
                // -------------------------------------------------------------

                add('_initialize', '1.1', true);
                add('_checkFocusedElement', '1.1');

                add('_navigateForward');
                add('_checkFocusedElement', '1.1.1');

                add('_navigateForward');
                add('_checkFocusedElement', '1.1.2');

                add('_navigateForward');
                add('_checkFocusedElement', '1.1.3');

                add('_navigateForward');
                add('_checkFocusedElement', '1.1');

                add('_navigateBackward');
                add('_checkFocusedElement', '1.1.3');

                add('_destroy');

                // -------------------------------------------------------------

                // In non-looping (i.e. blocking) mode, focus is maintained on an element despite pressing the tab key. Since "_navigateForward" and "_navigateBackward" are based upon "document.activeElement" change, this is not suitable (actually it changes, but twice in order to put it back to the originally focused element). In this case, we have to press the keys and use a delay (as we usually do for JawsTestCases anyways).
                add('_initialize', '1.1', false);
                add('_checkFocusedElement', '1.1');

                add('_pressShiftTab');
                add('_delay');
                add('_checkFocusedElement', '1.1');

                add('_navigateForward');
                add('_checkFocusedElement', '1.1.1');

                add('_navigateForward');
                add('_checkFocusedElement', '1.1.2');

                add('_navigateForward');
                add('_checkFocusedElement', '1.1.3');

                add('_pressTab');
                add('_delay');
                add('_checkFocusedElement', '1.1.3');

                add('_destroy');

                // -------------------------------------------------------------

                add('_navigateForward');
                add('_checkFocusedElement', '1.2', false);
            }, this.end);
        },

        _initialize : function (next, nodeId, loop) {
            // ------------------------------------------------------ processing

            // -----------------------------------------------------------------

            var node = this.getElementById(nodeId);
            this._currentNode = node;

            // -----------------------------------------------------------------

            this._showOthersBack = DomNavigationManager.hidingManager.hideOthers(node);
            node.className += ' isolated';

            // -----------------------------------------------------------------

            var interceptor = PopupNavigationManager.ElementNavigationInterceptor(node, loop);
            this._currentInterceptor = interceptor;
            interceptor.ensureElements();

            // -----------------------------------------------------------------

            var nodeName = node.getElementsByClassName('node_name')[0];
            nodeName.focus();

            // ---------------------------------------------------------- return

            next();
        },

        _destroy : function (next) {
            // --------------------------------------------------- destructuring

            var interceptor = this._currentInterceptor;
            var node = this._currentNode;

            // ------------------------------------------------------ processing

            // -----------------------------------------------------------------

            interceptor.destroyElements();

            // -----------------------------------------------------------------

            this._showOthersBack();
            this._showOthersBack = null;
            node.className = 'node';

            // -----------------------------------------------------------------

            this._currentNode = null;
            this._currentInterceptor = null;

            // ---------------------------------------------------------- return

            next();
        },

        _checkFocusedElement : function (next, expectedTextContent, shouldBeContained) {
            // -------------------------------------- input arguments processing

            if (shouldBeContained == null) {
                shouldBeContained = true;
            }

            // --------------------------------------------------- destructuring

            var ancestor = this._currentNode;

            var document = Aria.$window.document;
            var focusedElement = document.activeElement;
            var textContent = focusedElement.textContent;

            // ------------------------------------------------------ processing

            var result;
            var message;

            // -----------------------------------------------------------------

            result = ariaUtilsDom.isAncestor(focusedElement, ancestor);
            message = 'Focused element should%1be contained inside the element';

            var subtitution;
            if (shouldBeContained) {
                subtitution = '';
            } else {
                subtitution = 'not';
                result = !result;
            }

            message = subst(message, subtitution);
            this.assertTrue(result, message);

            // -----------------------------------------------------------------

            result = !!(expectedTextContent === textContent);
            this.assertTrue(result, subst('Focused element is not the expected one: it should have textContent "%1" instead of "%2"', expectedTextContent, textContent));

            // ---------------------------------------------------------- return

            next();
        }
    }
});
