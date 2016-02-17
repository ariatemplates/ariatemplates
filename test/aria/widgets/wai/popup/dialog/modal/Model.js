/*
 * Copyright 2016 Amadeus s.a.s.
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

var ariaUtilsJson = require('ariatemplates/utils/Json');



////////////////////////////////////////////////////////////////////////////////
// Model: Dialog
////////////////////////////////////////////////////////////////////////////////

function Dialog(options) {
    // -------------------------------------------------------------- properties

    if (options == null) {
        options = {};
    }

    var wai = options.wai;
    if (wai == null) {
        wai = false;
    }
    this.wai = wai;

    var fullyEmpty = options.fullyEmpty;
    if (fullyEmpty == null) {
        fullyEmpty = false;
    }
    this.fullyEmpty = fullyEmpty;

    var displayInContainer = options.displayInContainer;
    if (displayInContainer == null) {
        displayInContainer = false;
    }
    this.displayInContainer = displayInContainer;

    var titlePart = '';
    if (wai) {
        titlePart += ' (wai)';
    }
    if (fullyEmpty) {
        titlePart += ' (fully empty)';
    }
    if (displayInContainer) {
        titlePart += ' (in container)';
    }

    var buttonLabel = options.buttonLabel;
    if (buttonLabel == null) {
        buttonLabel = 'Open dialog' + titlePart;
    }
    this.buttonLabel = buttonLabel;

    // -------------------------------------------------------------- attributes

    var id = 'dialog';
    if (wai) {
        id += '_wai';
    }
    if (fullyEmpty) {
        id += '_fullyEmpty';
    }
    if (displayInContainer) {
        id += '_displayInContainer';
    }
    this.id = id;

    var buttonId = id + '_button';
    this.buttonId = buttonId;

    var elementBeforeId = 'before_' + buttonId;
    this.elementBeforeId = elementBeforeId;

    var title = 'Dialog' + titlePart;
    this.title = title;

    var visible = false;
    this.visible = visible;

    var visibleBinding = {
        inside: this,
        to: 'visible'
    };
    this.visibleBinding = visibleBinding;

    var maximizeLabel = 'maximize me';
    this.maximizeLabel = maximizeLabel;

    var closeLabel = 'close me';
    this.closeLabel = closeLabel;

    var configuration = {
        id: id,
        waiAria: wai,

        closable: !fullyEmpty,
        closeLabel: closeLabel,
        maximizable: !fullyEmpty,
        maximizeLabel: maximizeLabel,
        modal: true,
        width: 400,
        maxHeight: 500,

        title: title,

        macro: 'dialogContent',

        bind: {
            'visible': visibleBinding
        }
    };
    if (displayInContainer) {
        configuration.container = 'container';
    }
    this.configuration = configuration;
}

Dialog.prototype.open = function () {
    var visibleBinding = this.visibleBinding;
    ariaUtilsJson.setValue(visibleBinding.inside, visibleBinding.to, true);
};




////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////

function buildData(index) {
    var dialogs = [];

    dialogs.push(new Dialog({
        wai: false
    }));

    dialogs.push(new Dialog({
        wai: true
    }));
    dialogs.push(new Dialog({
        wai: true,
        fullyEmpty: true
    }));
    dialogs.push(new Dialog({
        wai: true,
        displayInContainer: true
    }));

    if (index != null) {
        dialogs = [dialogs[index]];
    }

    return {
       dialogs: dialogs
    };
}



////////////////////////////////////////////////////////////////////////////////
// Exports
////////////////////////////////////////////////////////////////////////////////

exports.Dialog = Dialog;
exports.buildData = buildData;
