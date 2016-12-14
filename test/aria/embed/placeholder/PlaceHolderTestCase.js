+/*
 * Copyright 2013 Amadeus s.a.s.
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
    $classpath : "test.aria.embed.placeholder.PlaceHolderTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.embed.PlaceholderManager", "aria.core.JsonValidator",
            "test.aria.embed.placeholder.resources.ContentProviderOne",
            "test.aria.embed.placeholder.resources.ContentProviderTwo",
            "test.aria.embed.placeholder.resources.SampleModule"],
    $templates : ["test.aria.embed.placeholder.resources.BodyTemplate",
            "test.aria.embed.placeholder.resources.MiddleTemplate",
            "test.aria.embed.placeholder.resources.SampleTemplate"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.embed.placeholder.resources.MainTemplate"
        });
        this.defaultTestTimeout = 10000;
        this.cpOne = new test.aria.embed.placeholder.resources.ContentProviderOne();
        this.cpTwo = new test.aria.embed.placeholder.resources.ContentProviderTwo();
        aria.embed.PlaceholderManager.register(this.cpOne);
        aria.embed.PlaceholderManager.register(this.cpTwo);
    },
    $prototype : {

        runTemplateTest : function () {
            var text = this.testDiv.innerHTML;
            this.assertTrue(text.match(/mode0bodyContentOnemode0bodyContentTwo/) !== null);
            this.cpOne.mode = 1;
            this.cpOne.$raiseEvent({
                name : "contentChange",
                contentPaths : ["body"]
            });
            text = this.testDiv.innerHTML;
            this.assertTrue(text.match(/mode1bodyContentOne/) !== null);
            this.assertTrue(text.match(/mode1bodyMiddleContentOnemode0bodyMiddleContentTwo/) !== null);
            this.assertTrue(text.match(/mode0bodyContentTwo/) !== null);
            this.cpTwo.mode = 1;
            this.cpTwo.$raiseEvent({
                name : "contentChange",
                contentPaths : ["body.middle"]
            });
            text = this.testDiv.innerHTML;
            this.assertTrue(text.match(/mode1bodyContentOne/) !== null);
            this.assertTrue(text.match(/mode1bodyMiddleContentOne/) !== null);
            this.assertTrue(text.match(/mode1bodyMiddleBottomContentOne/) !== null);
            this.assertTrue(text.match(/mode1bodyMiddleBottomContentTwo/) !== null);
            this.cpOne.mode = 2;
            this.cpOne.$raiseEvent({
                name : "contentChange",
                contentPaths : ["body.middle.bottom", "body.left"]
            });
            text = this.testDiv.innerHTML;
            this.assertTrue(text.match(/mode1bodyContentOne/) !== null);
            this.assertTrue(text.match(/mode1bodyMiddleContentOne/) !== null);
            this.assertTrue(text.match(/mode1bodyMiddleBottomContentOne/) === null);
            this.assertTrue(text.match(/sampleModuleMessage/) !== null);
            this.assertTrue(text.match(/mode1bodyMiddleBottomContentTwo/) !== null);
            this.assertTrue(text.match(/bodyleft/) !== null);

            this.templateCtxt.$refresh();
            text = this.testDiv.innerHTML;
            this.assertTrue(text.match(/mode1bodyContentOne/).length == 1);
            this.assertTrue(text.match(/mode1bodyMiddleContentModifiedOne/).length == 1);
            this.assertTrue(text.match(/sampleModuleMessage/).length == 1);
            this.assertTrue(text.match(/mode1bodyMiddleBottomContentTwo/).length == 1);
            this.assertTrue(text.match(/bodyleft/).length == 1);

            aria.embed.PlaceholderManager.unregister(this.cpOne);
            aria.embed.PlaceholderManager.unregister(this.cpTwo);
            this.cpOne.$dispose();
            this.cpTwo.$dispose();

            this._replaceTestTemplate({
                template : "test.aria.embed.placeholder.resources.WrongTemplate"
            }, {
                fn : this._testInvalidConfiguration,
                scope : this
            });
        },

        _testInvalidConfiguration : function () {
            this.assertErrorInLogs(aria.core.JsonValidator.INVALID_CONFIGURATION);
            this.end();
        }
    }
});
