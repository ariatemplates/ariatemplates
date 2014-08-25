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
var Aria = require("../Aria");
var ariaCoreIO = require("../core/IO");


/**
 * HTML UI Renderer for aria.core.IO
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.jsunit.IOViewer",
    $singleton : true,
    $constructor : function () {
        this._outputDiv = null; // reference to the DOM output div
        this._requests = [];
    },
    $destructor : function () {
        this._outputDiv = null;
        this._requests = null;
        ariaCoreIO.$unregisterListeners(this);
    },
    $prototype : {
        /**
         * Id of the DIV element to use as output container Can be changed by the user before run() is called
         * @type String
         */
        outputDivId : "_IOViewerOutput_",

        /**
         * Main function to display the IO report. If no div corresponding to outputDivId is found in the DOM, a new DIV
         * is created and appended at the end of the document body
         */
        run : function () {
            var document = Aria.$window.document;
            // get a reference to the output div
            var elt = document.getElementById(this.outputDivId);
            if (elt == null) {
                elt = document.createElement('div');
                document.body.appendChild(elt);
            }
            this._outputDiv = elt;
            ariaCoreIO.$on({
                'request' : this._onRequest,
                'response' : this._onResponse,
                scope : this
            });
            this._refreshDisplay();
        },
        /**
         * Internal listener called when a new request is created.
         * @param {aria.core.IO:request:event} evt the event
         * @private
         */
        _onRequest : function (evt) {
            this._requests[evt.req.id] = evt.req;
            this._refreshDisplay();
        },
        /**
         * Internal listener called when a pending request is completed.
         * @param {aria.core.IO:response:event} evt the event
         * @private
         */
        _onResponse : function (evt) {
            this._refreshDisplay();
        },
        /**
         * Update the IO report display in the HTML div
         * @private
         */
        _refreshDisplay : function () {
            var h = ['<div style="font-family:Arial;font-size:12px">',
                    '<span style="font-size:15px;font-weight:bold">IO Report</span>', '<hr/>',
                    '<div style="padding: 3px;font-size: 12px; font-weight: bold;font-family:Arial">', 'Requests: ',
                    ariaCoreIO.nbRequests, ' (pending: ',
                    ariaCoreIO.nbRequests - ariaCoreIO.nbOKResponses - ariaCoreIO.nbKOResponses, ', OK: ',
                    ariaCoreIO.nbOKResponses, ', failed: ', ariaCoreIO.nbKOResponses, ')<br />Traffic: ',
                    ariaCoreIO.trafficDown + ariaCoreIO.trafficUp, ' bytes (down: ', ariaCoreIO.trafficDown,
                    ' bytes, up: ', ariaCoreIO.trafficUp, ' bytes)', '</div>',
                    '<table style="font-size:12px;font-family:Arial; width:100%;">', '<tr style="font-weight: bold;">',
                    '<td style="width: 50px;">Method</td>', '<td>URL</td>',
                    '<td style="text-align: right; width: 50px;">Up</td>',
                    '<td style="text-align: right; width: 50px;">Down</td>',
                    '<td style="text-align: right; width: 50px;">Status</td>', '<td style="width: 250px;">Result</td>',
                    '<td style="width: 80px;">Duration</td>', '</tr>'];
            for (var i = this._requests.length - 1; i >= 0; i--) {
                var req = this._requests[i];
                if (req) {
                    var g;
                    if (req.res) {
                        g = ['<tr style="', req.res.status == "200" ? 'color: green;' : 'color: red;', '">', '<td>',
                                req.method, '</td>', '<td style="font-weight: bold;">', req.url, '</td>',
                                '<td style="text-align: right;">', req.requestSize, '</td>',
                                '<td style="text-align: right;">', req.responseSize, '</td>',
                                '<td style="text-align: right;">', req.res.status, '</td>', '<td>',
                                req.res.error ? req.res.error : 'OK', '</td>', '<td>', req.downloadTime, ' ms</td>'];
                    } else {
                        var g = ['<tr>', '<td>', req.method, '</td>', '<td style="font-weight: bold;">', req.url,
                                '</td>', '<td style="text-align: right;">', req.requestSize, '</td>', '<td></td>',
                                '<td></td>', '<td>Pending...</td>', '<td></td>'];
                    }
                    h.push(g.join(''));
                }
            }
            h.push('</table>');
            this._outputDiv.innerHTML = h.join('');
        }
    }
});
