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
 * Test case for aria.utils.Xml
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.XmlTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Xml"],
    $prototype : {
        /**
         * TestCase1 Tests valid use cases.
         */
        testAsyncXmlToJson : function () {
            var url = Aria.rootFolderPath + "test/aria/utils/AmadeusRSSFeed.xml";
            aria.core.IO.asyncRequest({
                url : url,
                callback : {
                    fn : this._onResponseReceive,
                    scope : this,
                    onerror : this._onResponseError
                }
            });
        },

        _onResponseError : function (res) {
            try {
                this.fail("RSS feed not found");
                this.notifyTestEnd("testAsyncXmlToJson");
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        },
        _onResponseReceive : function (asyncRes) {
            try {
                var json = aria.utils.Xml.convertXmlToJson(asyncRes.responseText);
                this.assertTrue(json.rss.channel.title == "Amadeus News - English");
                this.assertTrue(json.rss.channel.item.length == 20);
                this.assertTrue(json.rss.channel.item[0].hasOwnProperty("description"));
                this.notifyTestEnd("testAsyncXmlToJson");
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        }
    }
});
