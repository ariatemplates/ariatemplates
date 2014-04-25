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

var Aria = require("../../Aria");
var promise = require("noder-js/promise");
var asyncRequire = require("noder-js/asyncRequire").create(module);

var createGetData = function (instance, clsName) {
    instance.getData = function () {
        return instance.__getData(clsName);
    };
};

var preload = function (resProviderInfo) {
    var resProvider = resProviderInfo.resProvider;
    var providerPath = Aria.getLogicalPath(resProvider.provider, ".js");
    return asyncRequire(providerPath).thenSync(function (ProviderCstr) {
        if (!resProviderInfo.instance) {
            var instance = resProviderInfo.instance = new ProviderCstr();
            createGetData(instance, resProviderInfo.clsName);
            instance.__refName = resProviderInfo.refName;
            if (resProvider.hasOwnProperty("handler")) {
                instance.setHandler(resProvider.handler);
            }
            if (resProvider.hasOwnProperty("resources")) {
                instance.setResources(resProvider.resources);
            }
            if (!resProvider.onLoad) {
                // synchronous load
                var defer = promise.defer();
                resProviderInfo.fetchDataCalled = true;
                instance.fetchData(defer.resolve, resProviderInfo.clsName);
                resProviderInfo.preloadData = defer.promise;
            }
        }
        return resProviderInfo.preloadData;
    });
};

var load = function (resProviderInfo) {
    var promise = preload(resProviderInfo);
    if (!promise.isResolved()) {
        // FIXME: error reporting
        this.$logError("Not finished preloading resource provider.");
    } else if (!resProviderInfo.fetchDataCalled) {
        resProviderInfo.fetchDataCalled = true;
        resProviderInfo.instance.fetchData({
            fn : resProviderInfo.resProvider.onLoad,
            scope : resProviderInfo.clsProto
        }, resProviderInfo.clsName);
    }
    return resProviderInfo.instance;
};

load.$preload = preload;

module.exports = {
    load : load
};