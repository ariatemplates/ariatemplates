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
 * Test case for the default url pattern creation implementation
 */
Aria.classDefinition({
    $classpath : "test.aria.modules.urlService.PatternURLCreationImplTest",
    $dependencies : ["aria.modules.urlService.PatternURLCreationImpl", "aria.modules.RequestMgr"],
    $extends : "aria.jsunit.TestCase",
    $prototype : {
        /**
         * Test creation of url with wrong parameters
         */
        testUrlCreationEmpty : function () {
            // Get an instance
            var instance = new (Aria.getClassRef("aria.modules.urlService.PatternURLCreationImpl"))();

            this.assertFalse(!!instance.actionUrlPattern);
            this.assertFalse(!!instance.i18nUrlPattern);

            // Get the url
            this.assertFalse(!!instance.createActionUrl());
            this.assertFalse(!!instance.createI18nUrl());
            this.assertFalse(!!instance.createServiceUrl());

            this.assertFalse(!!instance.createActionUrl("a", "b", "c"));
            this.assertFalse(!!instance.createI18nUrl("a", "b", "c"));
            this.assertFalse(!!instance.createServiceUrl("a", "b", "c"));

            instance.$dispose();
        },

        /**
         * Test creation of url with no placeholder
         */
        testUrlCreationNoPlaceHolder : function () {
            // Get an instance
            var instance = new (Aria.getClassRef("aria.modules.urlService.PatternURLCreationImpl"))("a", "b");

            this.assertEquals(instance.actionUrlPattern, "a");
            this.assertEquals(instance.i18nUrlPattern, "b");

            // Get the url
            this.assertEquals(instance.createActionUrl(), "a");
            this.assertEquals(instance.createI18nUrl(), "b");
            this.assertEquals(instance.createServiceUrl(), "a");

            this.assertEquals(instance.createActionUrl("a", "b", "c"), "a");
            this.assertEquals(instance.createI18nUrl("a", "b", "c"), "b");
            this.assertEquals(instance.createServiceUrl("a", {
                actionName : "b"
            }, "c"), "a");

            instance.$dispose();
        },

        /**
         * Test creation of url with one placeholder
         */
        testUrlCreationModuleName : function () {
            // Get an instance
            var instance = new (Aria.getClassRef("aria.modules.urlService.PatternURLCreationImpl"))("a${moduleName}", "b${moduleName}");

            this.assertEquals(instance.actionUrlPattern, "a${moduleName}");
            this.assertEquals(instance.i18nUrlPattern, "b${moduleName}");

            // Get the url
            this.assertEquals(instance.createActionUrl(), "a");
            this.assertEquals(instance.createI18nUrl(), "b");
            this.assertEquals(instance.createServiceUrl(), "a");

            this.assertEquals(instance.createActionUrl("a", "b", "c"), "aa");
            this.assertEquals(instance.createI18nUrl("a", "b", "c"), "ba");
            this.assertEquals(instance.createServiceUrl("a", {
                actionName : "b"
            }, "c"), "aa");

            instance.$dispose();
        },

        /**
         * Test creation of url with correct parameters
         */
        testUrlCreation : function () {
            // Get an instance
            var instance = new (Aria.getClassRef("aria.modules.urlService.PatternURLCreationImpl"))("a${moduleName}/${actionName}?${sessionId}", "b${moduleName}/${actionName}?${sessionId}");

            this.assertEquals(instance.actionUrlPattern, "a${moduleName}/${actionName}?${sessionId}");
            this.assertEquals(instance.i18nUrlPattern, "b${moduleName}/${actionName}?${sessionId}");

            // Get the url
            this.assertEquals(instance.createActionUrl(), "a/?");
            this.assertEquals(instance.createI18nUrl(), "b/${actionName}?");
            this.assertEquals(instance.createServiceUrl(), "a/?");

            this.assertEquals(instance.createActionUrl("a", "b", "c"), "aa/b?c");
            this.assertEquals(instance.createI18nUrl("a", "b", "c"), "ba/${actionName}?b");
            this.assertEquals(instance.createServiceUrl("a", {
                actionName : "b"
            }, "c"), "aa/b?c");

            instance.$dispose();
        },

        /**
         * This function does the same tests previously done by RequestMgrTest
         */
        testOriginalCreation : function () {
            // Get an instance
            var instance = new (Aria.getClassRef("aria.modules.urlService.PatternURLCreationImpl"))("http://www.amadeus.com:8080/xyz/${moduleName}/${actionName};jsessionid=${sessionId}", "");

            this.__originalCreationImp(instance.createActionUrl, instance);
            this.__originalCreationImp(function (moduleName, actionName, sessionId) {
                return instance.createServiceUrl(moduleName, {
                    actionName : actionName
                }, sessionId);
            }, instance);

        },

        /**
         * Helper function for testOriginalCreation
         */
        __originalCreationImp : function (functToTest, instance) {
            var url = functToTest.call(instance, "m1", "doTest", '');
            this.assertTrue(url == "http://www.amadeus.com:8080/xyz/m1/doTest;jsessionid=");

            url = functToTest.call(instance, "m1", "doTest", '1234567890');
            this.assertTrue(url == "http://www.amadeus.com:8080/xyz/m1/doTest;jsessionid=1234567890");

            url = functToTest.call(instance, "m1", "doTest", '1234567890');
            this.assertTrue(url == "http://www.amadeus.com:8080/xyz/m1/doTest;jsessionid=1234567890");

            url = functToTest.call(instance, "m1", "doTest", '1234567890');
            this.assertTrue(url == "http://www.amadeus.com:8080/xyz/m1/doTest;jsessionid=1234567890");

            url = functToTest.call(instance, "m1", "doTest?param1=value1", '1234567890');
            this.assertTrue(url == "http://www.amadeus.com:8080/xyz/m1/doTest?param1=value1;jsessionid=1234567890");

            var rm = aria.modules.RequestMgr;
            rm.addParam("key1", "v1");
            url = functToTest.call(instance, "m1", "doTest?param1=value1", '1234567890');
            this.assertTrue(url == "http://www.amadeus.com:8080/xyz/m1/doTest?param1=value1;jsessionid=1234567890");

            rm.addParam("key2", "v2");
            url = functToTest.call(instance, "m1", "doTest?param1=value1", '1234567890');
            this.assertTrue(url == "http://www.amadeus.com:8080/xyz/m1/doTest?param1=value1;jsessionid=1234567890");

            url = functToTest.call(instance, "m2", "xyz", '1234567890');
            this.assertTrue(url == "http://www.amadeus.com:8080/xyz/m2/xyz;jsessionid=1234567890");

            rm.removeParam("key2");
            url = functToTest.call(instance, "m1", "doTest?param1=value1", '1234567890');
            this.assertTrue(url == "http://www.amadeus.com:8080/xyz/m1/doTest?param1=value1;jsessionid=1234567890");

            rm.removeParam();
            url = functToTest.call(instance, "m2", "xyz", '1234567890');
            this.assertTrue(url == "http://www.amadeus.com:8080/xyz/m2/xyz;jsessionid=1234567890");

            instance.$dispose();
        }
    }
});