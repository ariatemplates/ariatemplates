/**
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
 * This request filter can be used to show in the logs the XML responses received from the server. This can be
 * particularly useful when debugging or when you need to get the response as text to copy/paste it into a local XML
 * file to work 'offline'. This filter outputs information using the logger system, so you might need to adapt the level
 * like so:
 * 
 * <pre>
 * aria.core.Log.setLoggingLevel(&quot;aria.utils.filters.DisplayXmlResponse&quot;, aria.core.Log.LEVEL_INFO);
 * </pre>
 * 
 * To use this filter, do the following, like any other filter:
 * 
 * <pre>
 * aria.core.IOFiltersMgr.addFilter(&quot;aria.utils.filters.DisplayXmlResponse&quot;);
 * </pre>
 */
Aria.classDefinition({
	$classpath : "aria.utils.filters.DisplayXmlResponse",
	$extends : "aria.core.IOFilter",
	$constructor : function () {
		this.$IOFilter.constructor.call(this);
	},
	$prototype : {
		/**
		 * Called like any other filter when a response is received. This filter will serialize the XML object received
		 * and show it in the logs.
		 * @param {aria.core.CfgBeans.IOAsyncRequestCfg} res
		 */
		onResponse : function (req) {
			var res = req.res;
			if (res.responseXML) {
				var x = this._xml2str(res.responseXML);
				if (x) {
					this.$logInfo("Request to the following URL produced the following result: " + req.url);
					this.$logInfo(x);
				}
			}
		},

		/**
		 * Converts a XML object into its string representation
		 * @param {XMLElement} xmlNode The xml object to be converted
		 * @return {String|Boolean} The string, or false if the xml couldn't be converted
		 * @private
		 */
		_xml2str : function (xmlNode) {
			try {
				var XMLSerializer = Aria.$global.XMLSerializer;
				// Gecko-based browsers, Safari, Opera.
				return (new XMLSerializer()).serializeToString(xmlNode);
			} catch (e) {
				try {
					// Internet Explorer.
					return xmlNode.xml;
				} catch (e) {
					// Strange Browser ??
					this.$logWarn('Xmlserializer not supported');
				}
			}
			return false;
		}
	}
});