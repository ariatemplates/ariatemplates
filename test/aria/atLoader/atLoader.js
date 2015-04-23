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

(function () {

    var err = [],
        document = Aria.$window.document;

    function checkEqual(arg1, arg2, value1, value2) {
        if (value1 !== value2) {
            var msg = arg1 + ' is ' + value1 + ' while ' + arg2 + ' is ' + value2;
            err.push(msg);
            console.error(msg);
        }
    }

    function showResult() {
        var res, className;
        if (err.length > 0) {
            err.unshift('test FAILED');
            res = err.join('<br>');
            className = 'error';
        } else {
            res = 'test PASSED';
            className = 'success';
        }
        document.write('<h2 id="result" class="' + className + '">' + res + '</h2>');
    }

    function testInjection() {
        var num = "55",
            convertedNum;

        Aria.load({
            classes : ['aria.utils.Number']
        });

        try {
            convertedNum = aria.utils.Number.toNumber(num);
        } catch (e) {
            console.error(e.message);
            err.push(e.message);
        }

        checkEqual('convertedNum', 'num', convertedNum, 55);
    }

    testInjection();
    showResult();

})();
