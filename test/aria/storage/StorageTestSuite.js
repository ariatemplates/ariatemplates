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
    $classpath : "test.aria.storage.StorageTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);

        this.addTests("test.aria.storage.localStorage.APITestCase");
        this.addTests("test.aria.storage.localStorage.EventsTestCase");
        this.addTests("test.aria.storage.localStorage.SerializeTestCase");
        this.addTests("test.aria.storage.localStorage.NamespaceTestCase");

        this.addTests("test.aria.storage.sessionStorage.APITestCase");
        this.addTests("test.aria.storage.sessionStorage.EventsTestCase");
        this.addTests("test.aria.storage.sessionStorage.SerializeTestCase");
        this.addTests("test.aria.storage.sessionStorage.NamespaceTestCase");

        this.addTests("test.aria.storage.localStorage.EventIssueTestCase");

        this.addTests("test.aria.storage.userData.APITestCase");
        this.addTests("test.aria.storage.userData.EventsTestCase");
        this.addTests("test.aria.storage.userData.SerializeTestCase");
        this.addTests("test.aria.storage.userData.NamespaceTestCase");
    }
});
