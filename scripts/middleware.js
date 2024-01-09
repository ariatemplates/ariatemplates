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

var url = require("url");

var echoUrlRegExp = /^\/middleware\/echo(\?|$)/;
function echo(req, res, next) {
    if (echoUrlRegExp.test(req.url)) {
        var query = url.parse(req.url, true).query;
        setTimeout(function () {
            res.status(parseInt(query.status) || 200);
            var content = query.content || "";
            res.end(content);
        }, parseInt(query.delay) || 0);
    } else {
        next();
    }
}

var echoJsonpUrlRegExp = /^\/middleware\/echojsonp(\?|$)/;
function echoJsonp(req, res, next) {
    if (echoJsonpUrlRegExp.test(req.url)) {
        var query = url.parse(req.url, true).query;
        var callback = query.callback;
        delete query.callback;
        var jsonQuery = JSON.stringify(query);
        var content = callback ? callback + "(" + jsonQuery + ");" : jsonQuery;
        res.status(200);
        res.end(content);
    } else {
        next();
    }
}

module.exports = [echo, echoJsonp];
