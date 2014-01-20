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
    $classpath : "test.aria.utils.UtilsTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);

        this.addTests("test.aria.utils.cssLoader.CSSLoader");
        this.addTests("test.aria.utils.cfgframe.AriaWindowTest");
        this.addTests("test.aria.utils.css.AnimationsTestSuite");
        this.addTests("test.aria.utils.css.Effects");
        this.addTests("test.aria.utils.environment.EnvironmentTestSuite");
        this.addTests("test.aria.utils.hashManager.HashManagerTestSuite");
        this.addTests("test.aria.utils.json.JsonTestSuite");
        this.addTests("test.aria.utils.overlay.OverlayTestSuite");
        this.addTests("test.aria.utils.sandbox.DOMPropertiesTest");
        this.addTests("test.aria.utils.mouse.MouseTestSuite");
        this.addTests("test.aria.utils.scriptloader.ScriptLoader");
        this.addTests("test.aria.utils.validators.ValidatorsTestSuite");

        this.addTests("test.aria.utils.Array");
        this.addTests("test.aria.utils.ClassList");
        this.addTests("test.aria.utils.Callback");
        this.addTests("test.aria.utils.Data");
        this.addTests("test.aria.utils.Date");
        this.addTests("test.aria.utils.DateInterpret");
        this.addTests("test.aria.utils.DatePatternInterpret");
        this.addTests("test.aria.utils.DateCompare");
        this.addTests("test.aria.utils.Delegate");
        this.addTests("test.aria.utils.Dom");
        this.addTests("test.aria.utils.Ellipsis");
        this.addTests("test.aria.utils.Event");
        this.addTests("test.aria.utils.FireDomEvent");
        this.addTests("test.aria.utils.Function");
        this.addTests("test.aria.utils.FunctionWriterTest");
        this.addTests("test.aria.utils.History");
        this.addTests("test.aria.utils.Html");
        this.addTests("test.aria.utils.IdManager");
        this.addTests("test.aria.utils.JsonTest");
        this.addTests("test.aria.utils.Math");
        this.addTests("test.aria.utils.Number");
        this.addTests("test.aria.utils.NumberFormat");
        this.addTests("test.aria.utils.NumberLocale");
        this.addTests("test.aria.utils.Object");
        this.addTests("test.aria.utils.Path");
        this.addTests("test.aria.utils.Profiling");
        this.addTests("test.aria.utils.Size");
        this.addTests("test.aria.utils.StackHashMapTest");
        this.addTests("test.aria.utils.Store");
        this.addTests("test.aria.utils.String");
        this.addTests("test.aria.utils.Time");
        this.addTests("test.aria.utils.TypeTest");
        this.addTests("test.aria.utils.Xml");
        this.addTests("test.aria.utils.DeviceTest");
        this.addTests("test.aria.utils.OrientationTest");
        this.addTests("test.aria.utils.dragdrop.DragTestSuite");
        this.addTests("test.aria.utils.events.EventsTestSuite");
    }
});
