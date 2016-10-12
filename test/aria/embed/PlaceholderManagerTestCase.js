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
 * Test case for aria.embed.PlaceholderManager
 */
Aria.classDefinition({
    $classpath : "test.aria.embed.PlaceholderManagerTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.embed.PlaceholderManager", "test.aria.embed.contentProviders.ContentProviderOne",
            "test.aria.embed.contentProviders.ContentProviderTwo"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this.placeholderMgr = aria.embed.PlaceholderManager;
        this.cpOne = new test.aria.embed.contentProviders.ContentProviderOne();
        this.cpTwo = new test.aria.embed.contentProviders.ContentProviderTwo();

        this._onChangeListener = {
            fn : this._onContentChange,
            scope : this
        };
        this._recordedChanges = [];
        this.placeholderMgr.$addListeners({
            "contentChange" : this._onChangeListener
        });
    },
    $destructor : function () {
        this.placeholderMgr.$removeListeners({
            "contentChange" : this._onChangeListener
        });
        this.cpOne.$dispose();
        this.cpTwo.$dispose();
        this.$TestCase.$destructor.call(this);
    },
    $prototype : {

        testRegister : function () {
            this.placeholderMgr.register(this.cpOne);
            this.placeholderMgr.register(this.cpOne);
            var content = this.placeholderMgr.getContent("a");
            this.assertTrue(content[0] == "aaa");
            this.assertTrue(content.length == 1);

            this.cpOne.$raiseEvent({
                name : "contentChange",
                contentPaths : ["a", "b"]
            });

            this.assertTrue(this._recordedChanges.length == 1);
            this.assertJsonEquals(this._recordedChanges[0], ["a", "b"]);

            this.placeholderMgr.register(this.cpTwo);
            content = this.placeholderMgr.getContent("a");
            this.assertTrue(content[0] == "aaa");
            this.assertTrue(content[2] == "aaa");
            this.assertTrue(content[1].classpath == "a.b.c");
            this.assertTrue(content.length == 3);

            this.cpOne.$raiseEvent({
                name : "contentChange",
                contentPaths : ["a", "b", "c"]
            });

            this.cpTwo.$raiseEvent({
                name : "contentChange",
                contentPaths : ["z"]
            });
            this.assertTrue(this._recordedChanges.length == 3);
            this.assertJsonEquals(this._recordedChanges[1], ["a", "b", "c"]);
            this.assertJsonEquals(this._recordedChanges[2], ["z"]);

            this._testUnregister();

        },

        _testUnregister : function () {
            this.placeholderMgr.unregister(this.cpOne);
            var content = this.placeholderMgr.getContent("a");
            this.assertTrue(content[1] == "aaa");
            this.assertTrue(content[0].classpath == "a.b.c");
            this.assertTrue(content.length == 2);

            this.cpOne.$raiseEvent({
                name : "contentChange",
                contentPaths : ["a", "b", "c"]
            });

            this.cpTwo.$raiseEvent({
                name : "contentChange",
                contentPaths : ["z"]
            });
            this.assertTrue(this._recordedChanges.length == 4);
            this.assertJsonEquals(this._recordedChanges[3], ["z"]);

            this.placeholderMgr.unregister(null);

            this._testContentNotFound();

            this.placeholderMgr.unregisterAll();
            this.cpOne.$raiseEvent({
                name : "contentChange",
                contentPaths : ["a", "b", "c"]
            });

            this.cpTwo.$raiseEvent({
                name : "contentChange",
                contentPaths : ["z"]
            });
            this.assertTrue(this._recordedChanges.length == 4);

            this._testContentNotFound();
        },

        _testContentNotFound : function () {
            var content = this.placeholderMgr.getContent("not.there");
            this.assertErrorInLogs(this.placeholderMgr.PLACEHOLDER_PATH_NOT_FOUND);
        },

        _onContentChange : function (args) {
            this._recordedChanges.push(args.placeholderPaths);
        }

    }
});
