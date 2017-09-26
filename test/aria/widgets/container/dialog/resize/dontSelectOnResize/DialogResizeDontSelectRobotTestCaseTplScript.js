/*
 * Copyright 2017 Amadeus s.a.s.
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



Aria.tplScriptDefinition({
    $classpath: 'test.aria.widgets.container.dialog.resize.dontSelectOnResize.DialogResizeDontSelectRobotTestCaseTplScript',

    $prototype: {
        $dataReady: function () {
            // --------------------------------------------------- destructuring

            var data = this.data;

            // ------------------------------------------------------ processing

            data.open = false;
        },

        getCommonData: function () {
            return {
                textSample: 'select me',

                // ids to retrieve elements
                dialogId: 'dialog',
                buttonId: 'button',
                textId: 'text',
                inputId: 'input',

                // needed to be able to check the resize was performed properly
                left: 100,
                top: 100,
                width: 400,
                height: 200
            };
        },

        getDialogConfiguration: function () {
            // --------------------------------------------------- destructuring

            var data = this.data;
            var commonData = this.getCommonData();

            // --------------------------------------------- processing & return

            return {
                macro: 'displayDialog',

                id: commonData.dialogId,

                xpos: commonData.left,
                ypos: commonData.top,
                width: commonData.width,
                height: commonData.height,
                center: false,

                // needed for the test
                resizable: true,

                // to be able to close it using the escape key
                modal: true,

                bind: {
                    // to handle cases where the property is modified by the widget instead of us
                    visible: {inside: data, to: 'open'}
                }
            };
        },



        ////////////////////////////////////////////////////////////////////////
        //
        ////////////////////////////////////////////////////////////////////////

        toggleDialog: function() {
            // --------------------------------------------------- destructuring

            var Json = this.$json;

            var data = this.data;

            // ------------------------------------------------------ processing

            Json.setValue(data, 'open', !data.open);
        }
    }
});
