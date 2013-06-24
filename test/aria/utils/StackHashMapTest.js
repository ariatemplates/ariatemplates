/* jshint -W080 : true */
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
 * Test case for the StackHashMap class.
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.StackHashMapTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.StackHashMap", "aria.utils.Array"],
    $prototype : {
        /**
         * Add entries with keys of different types to a StackHashMap object (using the push method) and then check they
         * are be retrieved correctly through the pop method.
         */
        testPushAndPop : function () {
            var myMap = new aria.utils.StackHashMap();
            var myKeyA = {};
            var myValueA1 = {};
            var myValueA2 = {};
            var myKeyB = {};
            var myValueB = {};
            var myKeyC = "string1";
            var myValueC1 = {};
            var myValueC2 = {};
            var myKeyD = "string2";
            var myValueD = {};
            var myKeyE = 3.5;
            var myValueE1 = {};
            var myValueE2 = {};
            var myKeyF = null;
            var myValueF1 = {};
            var myValueF2 = {};
            var myKeyG = undefined;
            var myValueG1 = {};
            var myValueG2 = {};
            myMap.push(myKeyA, myValueA1);
            myMap.push(myKeyA, myValueA2);
            myMap.push(myKeyB, myValueB);
            myMap.push(myKeyC, myValueC1);
            myMap.push(myKeyC, myValueC2);
            myMap.push(myKeyD, myValueD);
            myMap.push(myKeyE, myValueE1);
            myMap.push(myKeyE, myValueE2);
            myMap.push(myKeyF, myValueF1);
            myMap.push(myKeyF, myValueF2);
            myMap.push(myKeyG, myValueG1);
            myMap.push(myKeyG, myValueG2);
            this.assertEquals(myMap.pop(myKeyB), myValueB);
            this.assertEquals(myMap.pop(myKeyB), undefined);
            this.assertEquals(myMap.pop(myKeyA), myValueA2);
            this.assertEquals(myMap.pop(myKeyA), myValueA1);
            this.assertEquals(myMap.pop(myKeyA), undefined);
            this.assertEquals(myMap.pop(myKeyC), myValueC2);
            this.assertEquals(myMap.pop(myKeyC), myValueC1);
            this.assertEquals(myMap.pop(myKeyC), undefined);
            this.assertEquals(myMap.pop(myKeyF), myValueF2);
            this.assertEquals(myMap.pop(myKeyF), myValueF1);
            this.assertEquals(myMap.pop(myKeyF), undefined);
            this.assertEquals(myMap.pop(myKeyG), myValueG2);
            this.assertEquals(myMap.pop(myKeyG), myValueG1);
            this.assertEquals(myMap.pop(myKeyG), undefined);
            this.assertEquals(myMap.pop(myKeyD), myValueD);
            this.assertEquals(myMap.pop(myKeyD), undefined);
            this.assertEquals(myMap.pop(myKeyE), myValueE2);
            this.assertEquals(myMap.pop(myKeyE), myValueE1);
            this.assertEquals(myMap.pop(myKeyE), undefined);
            this.assertEquals(myMap.removeAll().length, 0);
            myMap.$dispose();
        },

        /**
         * Add entries with keys of different types to a StackHashMap object (using the push method) and then check they
         * are all retrieved correctly through the removeAll method.
         */
        testPushAndRemoveAll : function () {
            var arrayUtils = aria.utils.Array;
            var myMap = new aria.utils.StackHashMap();
            var myKeyA = {};
            var myValueA1 = {};
            var myValueA2 = {};
            var myKeyB = {};
            var myValueB = {};
            var myKeyC = "string1";
            var myValueC1 = {};
            var myValueC2 = {};
            var myKeyD = "string2";
            var myValueD = {};
            var myKeyE = 3.5;
            var myValueE1 = {};
            var myValueE2 = {};
            var myKeyF = null;
            var myValueF1 = {};
            var myValueF2 = {};
            var myKeyG = undefined;
            var myValueG1 = {};
            var myValueG2 = {};
            myMap.push(myKeyA, myValueA1);
            myMap.push(myKeyA, myValueA2);
            myMap.push(myKeyB, myValueB);
            myMap.push(myKeyC, myValueC1);
            myMap.push(myKeyC, myValueC2);
            myMap.push(myKeyD, myValueD);
            myMap.push(myKeyE, myValueE1);
            myMap.push(myKeyE, myValueE2);
            myMap.push(myKeyF, myValueF1);
            myMap.push(myKeyF, myValueF2);
            myMap.push(myKeyG, myValueG1);
            myMap.push(myKeyG, myValueG2);
            var removeAll = myMap.removeAll();
            this.assertEquals(removeAll.length, 12);
            this.assertTrue(arrayUtils.remove(removeAll, myValueA1));
            this.assertTrue(arrayUtils.remove(removeAll, myValueA2));
            this.assertTrue(arrayUtils.remove(removeAll, myValueB));
            this.assertTrue(arrayUtils.remove(removeAll, myValueC1));
            this.assertTrue(arrayUtils.remove(removeAll, myValueC2));
            this.assertTrue(arrayUtils.remove(removeAll, myValueD));
            this.assertTrue(arrayUtils.remove(removeAll, myValueE1));
            this.assertTrue(arrayUtils.remove(removeAll, myValueE2));
            this.assertTrue(arrayUtils.remove(removeAll, myValueF1));
            this.assertTrue(arrayUtils.remove(removeAll, myValueF2));
            this.assertTrue(arrayUtils.remove(removeAll, myValueG1));
            this.assertTrue(arrayUtils.remove(removeAll, myValueG2));
            this.assertEquals(removeAll.length, 0);
            this.assertEquals(myMap.pop(myKeyA), undefined);
            this.assertEquals(myMap.pop(myKeyB), undefined);
            this.assertEquals(myMap.pop(myKeyC), undefined);
            this.assertEquals(myMap.pop(myKeyD), undefined);
            this.assertEquals(myMap.pop(myKeyE), undefined);
            this.assertEquals(myMap.pop(myKeyF), undefined);
            this.assertEquals(myMap.pop(myKeyG), undefined);
            myMap.$dispose();
        }
    }
});
