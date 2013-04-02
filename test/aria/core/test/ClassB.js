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
 * Test class to test event definition in a sub-class
 */
Aria.classDefinition({
    $classpath : "test.aria.core.test.ClassB",
    $extends : "test.aria.core.test.ClassA",
    $events : {
        "begin" : "new event added to Class A list"/*,
        "end":"test to change an event definition (will not work)"*/
        // TODO: correctly test the error message when overriding an already defined event
    },
    $constructor : function () {
        this.$ClassA.constructor.call(this);
    }
});
