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
    $classpath : "test.aria.utils.sandbox.DOMPropertiesTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.sandbox.DOMProperties"],
    $prototype : {
        testGetPropertyAccess : function () {
            var domProperties = aria.utils.sandbox.DOMProperties;
            this.assertTrue(domProperties.getPropertyAccess("a", "parentNode") == "--");
            this.assertTrue(domProperties.getPropertyAccess("a", "childNodes") == "--");
            this.assertTrue(domProperties.getPropertyAccess("IMG", "childNodes") == "--");
            this.assertTrue(domProperties.getPropertyAccess("h1", "childNodes") == "--");
            this.assertTrue(domProperties.getPropertyAccess("a", "href") == "rw");
            this.assertTrue(domProperties.getPropertyAccess("a", "src") == "--");
            this.assertTrue(domProperties.getPropertyAccess("img", "href") == "--");
            this.assertTrue(domProperties.getPropertyAccess("img", "src") == "rw");
            this.assertTrue(domProperties.getPropertyAccess("a", "baseURI") == "r-");
            this.assertTrue(domProperties.getPropertyAccess("a", "id") == "r-");
            this.assertTrue(domProperties.getPropertyAccess("IMG", "id") == "r-");
            this.assertTrue(domProperties.getPropertyAccess("H1", "id") == "r-");
            this.assertTrue(domProperties.getPropertyAccess("table", "rows") == "--");
            this.assertTrue(domProperties.getPropertyAccess("textarea", "rows") == "rw");
            this.assertTrue(domProperties.getPropertyAccess("p", "textContent") == "r-");
            this.assertTrue(domProperties.getPropertyAccess("p", "innerHTML") == "r-");
        },

        testIsReadSafe : function () {
            var domProperties = aria.utils.sandbox.DOMProperties;
            this.assertTrue(domProperties.isReadSafe("a", "parentNode") === false);
            this.assertTrue(domProperties.isReadSafe("a", "childNodes") === false);
            this.assertTrue(domProperties.isReadSafe("IMG", "childNodes") === false);
            this.assertTrue(domProperties.isReadSafe("h1", "childNodes") === false);
            this.assertTrue(domProperties.isReadSafe("a", "href") === true);
            this.assertTrue(domProperties.isReadSafe("a", "src") === false);
            this.assertTrue(domProperties.isReadSafe("img", "href") === false);
            this.assertTrue(domProperties.isReadSafe("img", "src") === true);
            this.assertTrue(domProperties.isReadSafe("a", "baseURI") === true);
            this.assertTrue(domProperties.isReadSafe("a", "id") === true);
            this.assertTrue(domProperties.isReadSafe("IMG", "id") === true);
            this.assertTrue(domProperties.isReadSafe("H1", "id") === true);
            this.assertTrue(domProperties.isReadSafe("table", "rows") === false);
            this.assertTrue(domProperties.isReadSafe("textarea", "rows") === true);
            this.assertTrue(domProperties.isReadSafe("p", "textContent") === true);
            this.assertTrue(domProperties.isReadSafe("p", "innerHTML") === true);
        },

        testIsWriteSafe : function () {
            var domProperties = aria.utils.sandbox.DOMProperties;
            this.assertTrue(domProperties.isWriteSafe("a", "parentNode") === false);
            this.assertTrue(domProperties.isWriteSafe("a", "childNodes") === false);
            this.assertTrue(domProperties.isWriteSafe("IMG", "childNodes") === false);
            this.assertTrue(domProperties.isWriteSafe("h1", "childNodes") === false);
            this.assertTrue(domProperties.isWriteSafe("a", "href") === true);
            this.assertTrue(domProperties.isWriteSafe("a", "src") === false);
            this.assertTrue(domProperties.isWriteSafe("img", "href") === false);
            this.assertTrue(domProperties.isWriteSafe("img", "src") === true);
            this.assertTrue(domProperties.isWriteSafe("a", "baseURI") === false);
            this.assertTrue(domProperties.isWriteSafe("a", "id") === false);
            this.assertTrue(domProperties.isWriteSafe("IMG", "id") === false);
            this.assertTrue(domProperties.isWriteSafe("H1", "id") === false);
            this.assertTrue(domProperties.isWriteSafe("table", "rows") === false);
            this.assertTrue(domProperties.isWriteSafe("textarea", "rows") === true);
            this.assertTrue(domProperties.isWriteSafe("p", "textContent") === false);
            this.assertTrue(domProperties.isWriteSafe("p", "innerHTML") === false);
        }
    }
});