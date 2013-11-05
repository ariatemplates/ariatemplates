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
    $classpath : "test.aria.pageEngine.pageEngine.issue626.PageProvider626",
    $implements : ["aria.pageEngine.pageProviders.PageProviderInterface"],
    $constructor : function () {

        // These are the only important things in this test provider, the rest is a boilerplate to have page engine
        // working. We need such an animation config which would trigger `this._isSequential()` return true in
        // utils/css/Animations and have `animateOut` enabled.
        this._animations = true;
        this._animationCfg = {
            animateIn : "flip",
            animateOut : "flip",
            type : 1
        };
    },

    $prototype : {

        /**
         * @override
         */
        loadSiteConfig : function (callback) {
            var siteConfig = {
                appData : {},
                containerId : "at-main",
                animations : this._animations
            };

            this.$callback(callback.onsuccess, siteConfig);
        },

        /**
         * @override
         */
        loadPageDefinition : function (pageRequest, callback) {
            this.$callback(callback.onsuccess, {
                pageId : "aaa",
                url : "/pageEngine/aaa",
                animation : this._animationCfg,
                pageComposition : {
                    template : "test.aria.pageEngine.pageEngine.site.templates.MainLayout",
                    placeholders : {}
                }
            });
        }
    }
});
