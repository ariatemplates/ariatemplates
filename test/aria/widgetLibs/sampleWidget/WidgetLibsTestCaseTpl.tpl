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

{Template {
    $classpath:"test.aria.widgetLibs.sampleWidget.WidgetLibsTestCaseTpl",
    $wlibs: {
        "libA" : "test.aria.widgetLibs.sampleWidget.test.SampleWidgetLib"
    }
}}

    {macro main()}
        {@libA:SampleSimpleWidget {
            title: "a",
            add: "b"
        }/}{@libA:SampleContainerWidget {
            title: "c",
            add: "d",
            end: "f"
        }}e{/@libA:SampleContainerWidget}{@libA:SampleContainerWidget {
            title: "g",
            add: "h",
            end: "i",
            skipContent: true
        }}this will not be displayed{/@libA:SampleContainerWidget}{@libB:SampleSimpleWidget {
            title: "j",
            add: "k"
        }/}{@libB:SampleContainerWidget {
            title: "l",
            add: "m",
            end: "o"
        }}n{/@libB:SampleContainerWidget}
    {/macro}

{/Template}