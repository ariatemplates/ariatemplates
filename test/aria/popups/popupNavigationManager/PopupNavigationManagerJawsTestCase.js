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
var EnhancedJawsBase = require('test/EnhancedJawsBase');
var PopupNavigationManager = require('ariatemplates/popups/PopupNavigationManager');

var ariaUtilsArray = require('ariatemplates/utils/Array');
var ariaUtilsFunction = require('ariatemplates/utils/Function');



module.exports = Aria.classDefinition({
    $classpath : 'test.aria.popups.popupNavigationManager.PopupNavigationManagerJawsTestCase',
    $extends : EnhancedJawsBase,

    $constructor : function () {
        this.$EnhancedJawsBase.constructor.call(this);

        this._topTextAlternatives = [
            'AT Tests',
            'Aria Templates tests document',
            'Attester \\- slave',
            '1\\.1'
        ];
        this._topTextSubstitute = '1.1';

        this._bottomTextAlternatives = [
            'Aria Templates tests document end',
            '1\\.1\\.3'
        ];
        this._bottomTextSubstitute = '1.1.3';

        this.noiseRegExps = [/^(Aria Templates tests frame|New tab page)$/i];

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

        skipRemoveDuplicates: true,

        runTemplateTest : function () {
            // --------------------------------------------------- destructuring

            var topTextAlternatives = this._topTextAlternatives;
            var topTextSubstitute = this._topTextSubstitute;

            var bottomTextAlternatives = this._bottomTextAlternatives;
            var bottomTextSubstitute = this._bottomTextSubstitute;

            var self = this;

            // ------------------------------------------------------ processing

            // -----------------------------------------------------------------

            this._filter = function (content) {
                content = self._replaceAlternatives(content, topTextAlternatives, topTextSubstitute);
                content = self._replaceAlternatives(content, bottomTextAlternatives, bottomTextSubstitute);
                return content;
            };

            // -----------------------------------------------------------------

            this._localAsyncSequence(function (add) {
                add('_testHide');
                add('_testShowBack');
                add('_checkHistory');
            }, this.end);
        },

        _testHide : function (callback) {
            // --------------------------------------------------- destructuring

            var topTextSubstitute = this._topTextSubstitute;
            var bottomTextSubstitute = this._bottomTextSubstitute;

            var node = this._getReferenceNode();
            var targets = this._getClickTargets();

            // ------------------------------------------------------ processing

            // -----------------------------------------------------------------

            this._showOthersBack = DomNavigationManager.hidingManager.hideOthers(node);
            node.className += ' isolated';

            // -----------------------------------------------------------------

            this._executeStepsAndWriteHistory(callback, function (api) {
                // ----------------------------------------------- destructuring

                var step = api.step;
                var says = api.says;

                var click = api.click;
                var up = api.up;
                var down = api.down;

                // -------------------------------------------------- processing

                // -------------------------------------------------------------

                click(targets.top);
                says(topTextSubstitute);

                up(); // goes on the page's title | frame's top
                says(topTextSubstitute);
                up(); // repeats the page's title | goes on page's title
                says(topTextSubstitute);
                up(); // repeats the page's title
                says(topTextSubstitute);

                // -------------------------------------------------------------

                click(targets.bottom);
                says(bottomTextSubstitute);

                down();
                says(bottomTextSubstitute);

                down(); // one more time in case we went on the frame's bottom with the previous action
                says(bottomTextSubstitute); // repeats the bottom element's text content
            });
        },

        _testShowBack : function (callback) {
            // --------------------------------------------------- destructuring

            var topTextSubstitute = this._topTextSubstitute;
            var bottomTextSubstitute = this._bottomTextSubstitute;

            var node = this._getReferenceNode();
            var targets = this._getClickTargets();

            // ------------------------------------------------------ processing

            // -----------------------------------------------------------------

            this._showOthersBack();
            this._showOthersBack = null;

            node.className = 'node';

            // -----------------------------------------------------------------

            this._executeStepsAndWriteHistory(callback, function (api) {
                // ----------------------------------------------- destructuring

                var step = api.step;
                var says = api.says;

                var click = api.click;
                var up = api.up;
                var down = api.down;

                // -------------------------------------------------- processing

                // -------------------------------------------------------------

                click(targets.top);
                says(topTextSubstitute);

                up();
                says('1');

                // -------------------------------------------------------------

                click(targets.bottom);
                says(bottomTextSubstitute);

                down();
                says('1.2');
            });
        },



        ////////////////////////////////////////////////////////////////////////
        //
        ////////////////////////////////////////////////////////////////////////

        _getReferenceNode : function () {
            return this.getElementById('1.1');
        },

        _getNodeNameElement : function (node) {
            return node.getElementsByClassName('node_name')[0];
        },

        _getClickTargets : function () {
            var top = this._getNodeNameElement(this.getElementById('1.1'));
            var bottom = this._getNodeNameElement(this.getElementById('1.1.3'));

            return {
                top: top,
                bottom: bottom
            };
        },



        ////////////////////////////////////////////////////////////////////////
        //
        ////////////////////////////////////////////////////////////////////////

        _replaceAlternatives : function (content, alternatives, substitute) {
            return ariaUtilsArray.reduce(alternatives, function (content, alternative) {
                alternative = new RegExp('^' + alternative + '$', 'gmi');
                return content.replace(alternative, substitute);
            }, content);
        }
    }
});
