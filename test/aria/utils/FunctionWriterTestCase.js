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

Aria.classDefinition({
    $classpath : "test.aria.utils.FunctionWriterTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.FunctionWriter"],
    $prototype : {
        testCreateFunction : function () {
            var writer = new aria.utils.FunctionWriter(["a", "b"]);
            writer.write("return a+b;");
            var fn = writer.createFunction();
            writer.$dispose();
            this.assertTrue(fn(1, 3) == 4);
            this.assertTrue(fn(5, 6) == 11);
        },

        testGetDotProperty : function () {
            this.dotPropertyTest("varName");
            this.dotPropertyTest("otherValue");
            this.dotPropertyTest("137");
            this.dotPropertyTest("1blabla");
            this.dotPropertyTest("blabla123");
            this.dotPropertyTest("bla?bla");
            this.dotPropertyTest("bla-bla");
            this.dotPropertyTest("bla*bla");
            this.dotPropertyTest("bla+bla");
            this.dotPropertyTest("bla'bla");
            this.dotPropertyTest('bla"bla');
            this.dotPropertyTest('bla"b\'la');
        },

        dotPropertyTest : function (propName) {
            var writer = new aria.utils.FunctionWriter(["arg"]);
            writer.write("return arg", writer.getDotProperty(propName), ";");
            var fn = writer.createFunction();
            writer.$dispose();
            var okValue = {};
            var myObj = {};
            myObj[propName] = okValue;
            this.assertTrue(fn(myObj) === okValue);
        }
    }
});
