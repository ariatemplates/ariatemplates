/*
 * Copyright 2017 Amadeus s.a.s.
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

var Aria = require('aria/Aria');

var Dom = require('aria/utils/Dom');



module.exports = Aria.tplScriptDefinition({
    $classpath: 'test.aria.utils.overlay.loadingIndicator.zindex.newAlgorithm.ZIndexNewAlgorithmTestTplBaseScript',
    $prototype: {
        getStyle: function (element, property) {
        	return Dom.getStyle(element, property);
        }
    }
});
