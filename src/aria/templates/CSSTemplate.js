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
var ariaCoreDownloadMgr = require("../core/DownloadMgr");

/**
 * Even if not used in this class, the CSSMgr is needed in order to allow a CSSTemplate to be registered
 */
require("./CSSMgr");

/**
 * Base class from which all CSS templates inherit.
 * @extends aria.core.BaseTemplate
 * @dependencies ["aria.templates.CSSMgr", "aria.core.DownloadMgr", "aria.templates.ICSS"]
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.templates.CSSTemplate",
    $extends : require("./BaseTemplate"),
    $constructor : function () {
        this.$BaseTemplate.constructor.call(this);

        var baseLogicalPath = this.$classpath.replace(/\./g, "/");

        /**
         * Path of the CSS Template. It corresponds to the classpath and starts with "/". Exposed to the {CSSTemplate}
         * @type String
         */
        this.cssPath = "/" + baseLogicalPath;

        // Even if we remove the whole file name afterwards, it is important to pass the extension to resolveURL:
        var url = ariaCoreDownloadMgr.resolveURL(baseLogicalPath + ".tpl.css", true);

        /**
         * Path of the folder containing the CSS Template. It is relative to the Aria.rootFolderPath and takes into
         * account the Root Map (not the Url map). Exposed to the {CSSTemplate}
         * @type String
         */
        this.cssFolderPath = url.substring(0, url.lastIndexOf("/"));
    },
    $prototype : {
        /**
         * Prototype init method called at prototype creation time. Allows to store class-level objects that are shared
         * by all instances
         * @param {Object} p the prototype object being built
         * @param {Object} def the class definition
         */
        $init : function (p, def) {
            // The prototype should be an instance of Template, that inheriths from BaseTemplate
            p.$BaseTemplate.constructor.classDefinition.$prototype.$init(p, def);

            // copy the prototype of ICSS:
            var itf = (require("./ICSS")).prototype;
            for (var k in itf) {
                if (itf.hasOwnProperty(k) && !p.hasOwnProperty(k)) {
                    // copy methods which are not already on this object (this avoids copying $classpath and
                    // $destructor)
                    p[k] = itf[k];
                }
            }
        }
    }
});
