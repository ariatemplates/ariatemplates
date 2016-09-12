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
 * Test case for aria.utils.json.JsonSerializer
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.json.JsonSerializerPerfTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.json.JsonSerializer", "aria.core.IO"],
    $prototype : {
        testAsyncJsonSerializer : function () {
            aria.core.IO.asyncRequest({
                url : Aria.rootFolderPath + this.$package.replace(/\./g, '/') + '/bigFile.json',
                expectedResponseType : 'json',
                callback : {
                    scope : this,
                    fn : this._afterJsonLoad
                }
            });
        },

        _afterJsonLoad : function (res) {
            var serializer = new aria.utils.json.JsonSerializer(true);

            var json = res.responseJSON, serialized;
            var n = 1;
            var startTime = new Date();
            for (var i = 0; i < n; i++) {
                serialized = serializer.serialize(json);
            }
            var endTime = new Date();
            this.assertJsonEquals(serializer.parse(serialized), json);
            this.assertTrue(endTime.getTime() - startTime.getTime() < 2000);

            serializer.$dispose();
            this.notifyTestEnd();
        }
    }
});
