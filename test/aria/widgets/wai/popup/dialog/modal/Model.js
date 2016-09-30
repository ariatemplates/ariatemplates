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
var ariaUtilsArray = require('ariatemplates/utils/Array');
var ariaUtilsString = require('ariatemplates/utils/String');
var subst = ariaUtilsString.substitute;



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

    var fill = options.fill;
    if (fill == null) {
        fill = false;
    }
    this.fill = fill;

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
    titlePart = subst('%1%2%3',
        wai ? ' (wai)' : '',
        fullyEmpty ? ' (fully empty)' : '',
        displayInContainer ? ' (in container)' : ''
    );

    var buttonLabel = options.buttonLabel;
    if (buttonLabel == null) {
        buttonLabel = subst('Open dialog%1', titlePart);
    }
    this.buttonLabel = buttonLabel;

    // -------------------------------------------------------------- attributes

    var id = subst('dialog%1%2%3',
        wai ? '_wai' : '',
        fullyEmpty ? '_fullyEmpty' : '',
        displayInContainer ? '_displayInContainer' : ''
    );
    this.id = id;

    var buttonId = subst('%1_button', id);
    this.buttonId = buttonId;

    var elementBeforeId = subst('before_%1', buttonId);
    this.elementBeforeId = elementBeforeId;

    var firstInputId = null;
    if (fill) {
        firstInputId = subst('%1_firstInput', id);
    }
    this.firstInputId = firstInputId;

    var secondInputId = null;
    if (fill) {
        secondInputId = subst('%1_secondInput', id);
    }
    this.secondInputId = secondInputId;

    var title = subst('Dialog%1', titlePart);
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

        macro: {
            name: 'dialogContent',
            args: [this]
        },

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
    var dialogs = ariaUtilsArray.map([
        {
            wai: false
        },
        {
            wai: true,
            fill: true
        },
        {
            wai: true,
            fullyEmpty: true
        },
        {
            wai: true,
            displayInContainer: true
        }
    ], function (spec) {
        return new Dialog(spec);
    });

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
