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
    $classpath : 'test.aria.widgetLibs.BaseWidgetTest',
    $extends : 'aria.jsunit.TestCase',
    $dependencies : ['aria.widgetLibs.BaseWidget', 'test.aria.widgetLibs.helpers.IdManagerSpy'],
    $prototype : {

        /**
         * Test the dynamic ids part (_createDynamicId and _releaseDynamicId methods, and what happens on dispose) of
         * the BaseWidget class.
         */
        testDynamicIds : function () {
            var idManagerSpy = new test.aria.widgetLibs.helpers.IdManagerSpy(this);

            // now create widgets and ids and check ids are correctly released
            var ctxt = {}; // mocked context

            // simplest scenario: create a widget and id, and dispose the widget
            // the id must be released
            var widget = new aria.widgetLibs.BaseWidget({}, ctxt, 0);
            var id = widget._createDynamicId();
            idManagerSpy.assertIdCreated(id);
            idManagerSpy.assertEmptyArrays();
            widget.$dispose();
            idManagerSpy.assertIdReleased(id);
            idManagerSpy.assertEmptyArrays();

            // create a widget and three ids and dispose one, then release the widget
            widget = new aria.widgetLibs.BaseWidget({}, ctxt, 0);
            var id1 = widget._createDynamicId();
            idManagerSpy.assertIdCreated(id1);
            idManagerSpy.assertEmptyArrays();
            var id2 = widget._createDynamicId();
            var id3 = widget._createDynamicId();
            idManagerSpy.assertIdCreated(id2);
            idManagerSpy.assertIdCreated(id3);
            idManagerSpy.assertEmptyArrays();
            widget._releaseDynamicId(id1);
            idManagerSpy.assertIdReleased(id1);
            idManagerSpy.assertEmptyArrays();
            widget.$dispose();
            idManagerSpy.assertIdReleased(id2);
            idManagerSpy.assertIdReleased(id3);
            idManagerSpy.assertEmptyArrays();

            // create two widgets and create an id with one and try to release it with the other (which should
            // not work)
            var widget1 = new aria.widgetLibs.BaseWidget({}, ctxt, 0);
            var widget2 = new aria.widgetLibs.BaseWidget({}, ctxt, 0);
            id1 = widget1._createDynamicId();
            id2 = widget2._createDynamicId();
            idManagerSpy.assertIdCreated(id1);
            idManagerSpy.assertIdCreated(id2);
            idManagerSpy.assertEmptyArrays();
            widget2._releaseDynamicId(id1);
            widget1._releaseDynamicId(id2);
            // ids must not be released when not done through the right widget
            idManagerSpy.assertEmptyArrays();
            widget1._releaseDynamicId(id1);
            widget2._releaseDynamicId(id2);
            idManagerSpy.assertIdReleased(id1);
            idManagerSpy.assertIdReleased(id2);
            idManagerSpy.assertEmptyArrays();
            widget1.$dispose();
            widget2.$dispose();
            idManagerSpy.assertEmptyArrays();

            idManagerSpy.$dispose();
        }
    }
});
