/*
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
    $classpath : "test.aria.templates.css.cssMgr.tagReuse.TagReuseTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.templates.CSSMgr", "aria.utils.Dom"],
    $css : ["test.aria.templates.css.cssMgr.tagReuse.TestCss"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
    },
    $prototype : {
        testCSSMgrReusesExistingTags : function () {
            this.__addTag();
            var head = this.__getHead();
            this._count = head.children.length;

            aria.templates.CSSMgr.loadClassPathDependencies(this.$classpath, this.$css);
            this.assertEquals(this.__getHead().children.length, this._count, "A tag with has been created instead of using the one with the same id");

            aria.templates.CSSMgr.unloadClassPathDependencies(this.$classpath, this.$css);
        },

        __addTag : function () {
            var cssMgr = aria.templates.CSSMgr;

            var document = Aria.$window.document;
            var head = this.__getHead();
            var tag = document.createElement("style");

            this._id = tag.id = cssMgr.__TAG_PREFX + "pool" + cssMgr.__NEXT_TAG_INDEX;

            head.appendChild(tag);
            this._tag = head.lastChild;
        },

        __getHead : function () {
            return Aria.$window.document.getElementsByTagName("head")[0];
        }

    }
});
