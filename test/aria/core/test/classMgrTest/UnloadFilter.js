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
 * Used for the unloadClass test to redirect test.aria.core.test.classMgrTest.Class1 to
 * test.aria.core.test.classMgrTest.Class1bis
 */
Aria.classDefinition({
    $classpath : 'test.aria.core.test.classMgrTest.UnloadFilter',
    $extends : 'aria.core.IOFilter',
    $prototype : {
        onRequest : function (req) {
            req.url = req.url.replace("Class1", "Class1bis");
        }
    }
});
