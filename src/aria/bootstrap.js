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
 * Aria file to include through a <script> tag to get all the files required in development mode
 * @private
 */
(function () {

    var scripts, coreScripts, me, loadScript, baseURL;
    var global = (function () {
        return this;
    })();

    if (typeof Aria == 'undefined') {
        Aria = {};
    }

    if (Aria.rootFolderPath != null) {
        baseURL = Aria.rootFolderPath;
    }

    var window = global.window;
    if (window != null) {
        var document = window.document;

        if (baseURL == null) {
            // First we retrieve the url of DevPackage.js (me) in the page.
            // As browsers ensure that all file are executed in the good order, at this stage the script tag that loaded
            // me
            // can only be the last script tag of this page.
            scripts = document.getElementsByTagName("script");
            me = scripts[scripts.length - 1];

            var myUrl = me.src.indexOf("://") != -1 ? me.src : me.getAttribute('src', -1); // fixes 04317643

            // base url is just the folder above the folder of DevPackage
            baseURL = myUrl.replace(/aria\/[^\/]*$/, '');

            if (baseURL == myUrl) {
                // FIXME: log an error
            }
        }

        loadScript = function (path) {
            document.write('<script type="text/javascript" src="' + baseURL + path + '"></script>');
        };

    } else {
        // if we are not inside a browser, we suppose there is a load method to load a specified URL (as in Rhino)
        if (baseURL == null) {
            baseURL = "";
        }

        loadScript = function (path) {
            global.load(baseURL + path);
        };
    }

    Aria.rootFolderPath = baseURL;

    // DO NOT enable debug mode (because we must be able to use
    // the dev package without changing the behavior)
    // Aria.debug = true;
    // Aria.enableProfiling = true;

    // load main aria file
    loadScript("aria/Aria.js");

    coreScripts = [
            // IMPORTANT NOTICE: If you add or remove files from here, please also maintain the pom.xml
            // file as well, so that the content of the core is also correct when packaged.
            'aria/core/JsObject.js',

            // mandatory utils required by log
            'aria/utils/Type.js',
            'aria/utils/String.js',

            // errors and logs
            'aria/core/log/DefaultAppender.js',
            'aria/core/Log.js',

            // mandatory utils
            'aria/utils/Array.js',
            'aria/utils/QueryString.js',
            'aria/utils/json/JsonSerializer.js',
            'aria/utils/Json.js',
            'aria/utils/Object.js',
            'aria/core/Browser.js',

            // Dom
            'aria/dom/DomReady.js',

            // loaders
            'aria/core/Cache.js', 'aria/core/ClassLoader.js', 'aria/core/JsClassLoader.js',
            'aria/core/ResClassLoader.js', 'aria/core/TplClassLoader.js', 'aria/core/CSSClassLoader.js',
            'aria/core/TmlClassLoader.js', 'aria/core/CmlClassLoader.js', 'aria/core/TxtClassLoader.js',
            'aria/core/ClassMgr.js', 'aria/core/DownloadMgr.js', 'aria/core/FileLoader.js', 'aria/core/Timer.js',
            'aria/core/Interfaces.js', 'aria/core/transport/ITransports.js', 'aria/core/transport/BaseXHR.js',
            'aria/core/transport/XHR.js', 'aria/core/transport/XDR.js', 'aria/core/transport/Local.js',
            'aria/core/transport/JsonP.js', 'aria/core/transport/IFrame.js', 'aria/core/IOFiltersMgr.js',
            'aria/core/IO.js', 'aria/core/Sequencer.js',
            'aria/core/MultiLoader.js',

            // JSON validation
            'aria/core/JsonValidator.js', 'aria/core/JsonTypesCheck.js', 'aria/core/JsonTypes.js',
            'aria/core/BaseTypes.js', 'aria/core/CfgBeans.js',

            // application environment
            'aria/core/AppEnvironment.js', 'aria/core/environment/EnvironmentBaseCfgBeans.js',
            'aria/core/environment/EnvironmentBase.js', 'aria/core/environment/Environment.js',

            // resource manager
            'aria/core/ResMgr.js', 'aria/utils/Profiling.js',

            // Skin
            'aria/css/atskin.js'];

    for (var i = 0; coreScripts.length > i; i++) {
        loadScript(coreScripts[i]);
    }
})();
