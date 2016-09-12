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
 * This test checks the behavior of getResourcesHandler/suggestValue. The logic of getting suggestions is inside the
 * Resources Handler, so it's enough to check that the correct class is loaded.
 */
Aria.classDefinition({
    $classpath : "test.aria.html.controllers.suggestions.ResourcesHandlerTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.html.controllers.Suggestions", "test.aria.html.controllers.suggestions.mocks.ByClasspath",
            "test.aria.html.controllers.suggestions.mocks.ByInstance"],
    $prototype : {
        /**
         * Resources Handler is a dependency and is given by instance
         */
        testAsyncInstance : function () {
            var controller = Aria.getClassInstance("aria.html.controllers.Suggestions");
            var resources = Aria.getClassInstance("test.aria.html.controllers.suggestions.mocks.ByInstance");

            controller.setResourcesHandler(resources);

            controller.suggestValue("-");
            aria.core.Timer.addCallback({
                fn : this.checkInstance,
                scope : this,
                args : {
                    testName : "testAsyncInstance",
                    controller : controller,
                    resources : resources
                },
                delay : 400
            });
        },

        checkInstance : function (args) {
            var controller = args.controller, resources = args.resources, testName = args.testName;
            try {
                var suggestions = controller.data.suggestions;
                this.assertEquals(suggestions.length, 2, "ByInstance should have two suggestions");
                this.assertEquals(suggestions[0], "ByInstance-", "Suggestion 0 expecting %2, got %1");
                this.assertEquals(suggestions[1], "ByInstance-suggestion", "Suggestion 1 expecting %2, got %1");

                controller.$dispose();

                // Resources shouldn't be destroyed by the controller
                this.assertFalse(!!resources[Aria.FRAMEWORK_PREFIX + 'isDisposed'], "ByInstance was disposed");

                resources.$dispose();
            } catch (ex) {}

            this.notifyTestEnd(testName);
        },

        /**
         * Resources Handler is a dependency and is given by classpath
         */
        testAsyncClasspath : function () {
            var controller = Aria.getClassInstance("aria.html.controllers.Suggestions");

            controller.setResourcesHandler("test.aria.html.controllers.suggestions.mocks.ByClasspath");

            controller.suggestValue("-");
            aria.core.Timer.addCallback({
                fn : this.checkClasspath,
                scope : this,
                args : {
                    testName : "testAsyncClasspath",
                    controller : controller
                },
                delay : 400
            });
        },

        checkClasspath : function (args) {
            var controller = args.controller, resources = controller._resourcesHandler, testName = args.testName;
            try {
                var suggestions = controller.data.suggestions;
                this.assertEquals(suggestions.length, 2, "ByClasspath should have two suggestions");
                this.assertEquals(suggestions[0], "ByClasspath-", "Suggestion 0 expecting %2, got %1");
                this.assertEquals(suggestions[1], "ByClasspath-suggestion", "Suggestion 1 expecting %2, got %1");

                controller.$dispose();

                // Resources should be destroyed by the controller
                this.assertTrue(resources[Aria.FRAMEWORK_PREFIX + 'isDisposed'], "ByClasspath was not disposed");
            } catch (ex) {}

            this.notifyTestEnd(testName);
        },

        /**
         * Resources Handler is a dependency and is given by classpath
         */
        testAsyncDynamic : function () {
            var controller = Aria.getClassInstance("aria.html.controllers.Suggestions");

            controller.setResourcesHandler("test.aria.html.controllers.suggestions.mocks.Dynamic");

            controller.suggestValue("-");
            // wait a bit more to allow the class to be loaded
            aria.core.Timer.addCallback({
                fn : this.checkDynamic,
                scope : this,
                args : {
                    testName : "testAsyncDynamic",
                    controller : controller
                },
                delay : 1400
            });
        },

        checkDynamic : function (args) {
            try {
                var controller = args.controller, testName = args.testName;

                var suggestions = controller.data.suggestions;
                this.assertEquals(suggestions.length, 2, "Dynamic should have two suggestions");
                this.assertEquals(suggestions[0], "Dynamic-", "Suggestion 0 expecting expecting %2, got %1");
                this.assertEquals(suggestions[1], "Dynamic-suggestion", "Suggestion 1 expecting expecting %2, got %1");

                // Do another getSuggestion just in case, we do have some function rewrite in the class
                controller.suggestValue("+");
            } catch (ex) {}

            aria.core.Timer.addCallback({
                fn : this.checkSecondDynamic,
                scope : this,
                args : args,
                delay : 400
            });
        },

        checkSecondDynamic : function (args) {
            var controller = args.controller, resources = controller._resourcesHandler, testName = args.testName;
            try {
                var suggestions = controller.data.suggestions;
                this.assertEquals(suggestions.length, 2, "Dynamic should have two suggestions");
                this.assertEquals(suggestions[0], "Dynamic+", "Suggestion 0 expecting %2, got %1");
                this.assertEquals(suggestions[1], "Dynamic+suggestion", "Suggestion 1 expecting expecting %2, got %1");

                controller.$dispose();

                // Resources should be destroyed by the controller
                this.assertTrue(resources[Aria.FRAMEWORK_PREFIX + 'isDisposed'], "Dynamic was not disposed");
            } catch (ex) {}

            this.notifyTestEnd(testName);
        },

        testAsyncErrors : function () {
            var controller = Aria.getClassInstance("aria.html.controllers.Suggestions");

            controller.setResourcesHandler("something that doesn't exist");

            controller.suggestValue("-");
            // I should still be able to go on even if there's an error
            aria.core.Timer.addCallback({
                fn : this.checkErrors,
                scope : this,
                args : {
                    testName : "testAsyncErrors",
                    controller : controller
                },
                delay : 600
            });
        },

        checkErrors : function (args) {
            var controller = args.controller, testName = args.testName;
            try {
                var suggestions = controller.data.suggestions;
                this.assertEquals(suggestions.length, 0, "I shouldn't have suggestions in error");

                this.assertErrorInLogs(aria.html.controllers.Suggestions.INVALID_RESOURCES_HANDLER);
                this.assertErrorInLogs(aria.core.MultiLoader.LOAD_ERROR);

                controller.$dispose();
            } catch (ex) {}

            this.notifyTestEnd(testName);
        }
    }
});
