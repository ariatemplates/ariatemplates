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
 * Frame factory, which provides a method to create a frame.
 * @class aria.widgets.frames.FrameFactory
 */
Aria.classDefinition({
	$classpath : 'aria.widgets.frames.FrameFactory',
	$singleton : true,
	$dependencies : ["aria.widgets.AriaSkinInterface", "aria.widgets.frames.CfgBeans", "aria.widgets.frames.OldFrame",
			"aria.widgets.frames.SimpleFrame", "aria.widgets.frames.TableFrame",
			"aria.widgets.frames.FixedHeightFrame", "aria.widgets.frames.SimpleHTMLFrame"],
	$constructor : function () {
		/* The keys in the following map are associated with the STATIC sprite types */
		this._frameTypeBuilders = {
			0 : aria.widgets.frames.OldFrame,
			1 : aria.widgets.frames.OldFrame,
			2 : aria.widgets.frames.OldFrame,
			3 : aria.widgets.frames.TableFrame,
			4 : aria.widgets.frames.FixedHeightFrame,
			5 : aria.widgets.frames.SimpleHTMLFrame,
			6 : aria.widgets.frames.SimpleFrame
		};
	},
	$statics : {
		/**
		 * The different values for the sprType property in skin properties.
		 */
		SPRTYPE_OLD_STD : 0,
		SPRTYPE_OLD_BGREPEAT : 1,
		SPRTYPE_OLD_FIXED_HEIGHT : 2,
		SPRTYPE_TABLE : 3,
		SPRTYPE_FIXED_HEIGHT : 4,
		SPRTYPE_NO_FRAME : 5,
		SPRTYPE_SIMPLE_FRAME : 6,
		
		// ERROR MESSAGES:
		FRAME_INVALID_SPRTYPE : "Invalid sprite type: %1.",
		FRAME_INVALID_CONFIG : "Invalid frame configuration."
	},
	$prototype : {

		/**
		 * Normalize a frame configuration (also filling the skinObject property, if not already done).
		 * @param {aria.widgets.frames.CfgBeans.FrameCfg} cfg Frame configuration
		 * @return {aria.widgets.frames.CfgBeans.FrameCfg} The normalized frame configuration, or null if an error
		 * occured (in this case, the error is already logged)
		 */
		normalizeFrameCfg : function (cfg) {
			var normalizeCfg = {
				json : cfg,
				beanName : "aria.widgets.frames.CfgBeans.FrameCfg"
			};
			if (aria.core.JsonValidator.normalize(normalizeCfg)) {
				cfg = normalizeCfg.json;
				var skinObject = cfg.skinObject;
				if (skinObject == null) {
					skinObject = aria.widgets.AriaSkinInterface.getSkinObject(cfg.skinnableClass, cfg.sclass);
					cfg.skinObject = skinObject;
				}
				return cfg;
			} else {
				this.$logError(this.FRAME_INVALID_CONFIG);
				return null;
			}
		},

		/**
		 * Create a new frame according to the given configuration object. The type of frame returned (either OldFrame,
		 * TableFrame or FixedHeightFrame) depends on the sprType property of the skin class.
		 * @param {aria.widgets.frames.CfgBeans.FrameCfg} cfg Frame configuration
		 * @return {aria.widgets.frames.Frame} A frame object, or null if an error occured (in this case, the error is
		 * logged).
		 */
		createFrame : function (cfg) {
			cfg = this.normalizeFrameCfg(cfg); // normalizeFrameCfg also report the error if the cfg is not correct
			if (cfg) {
				var sprType = cfg.skinObject.sprType; // skinObject is set by normalizeFrameCfg
				var frameType = this._frameTypeBuilders[sprType];
				if (frameType) {
					return new frameType(cfg);
				} else {
					this.$logError(this.FRAME_INVALID_SPRTYPE, [sprType]);
				}
			}
		}
	}
});
