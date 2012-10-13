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
 * Test case for aria.modules.environment.IUrlService
 */
Aria.classDefinition({
	$classpath : 'test.aria.modules.urlService.environment.UrlService',
	$extends : 'aria.jsunit.TestCase',
	$dependencies : ["aria.modules.urlService.environment.UrlService"],
	$constructor : function () {
		this.$TestCase.constructor.call(this);
	},
	$prototype : {
		testGetSetUrlService : function () {
			aria.core.AppEnvironment.setEnvironment({
				"urlService" : {
					implementation : "MyCustomImplementation",
					args : []
				}
			});

			var settings = aria.modules.urlService.environment.UrlService.getUrlServiceCfg();// user defined settings
			this.assertTrue(settings.implementation === "MyCustomImplementation");
			this.assertTrue(settings.args.length === 0);

			aria.core.AppEnvironment.setEnvironment({});

			settings = aria.modules.urlService.environment.UrlService.getUrlServiceCfg();// default bean definition
			this.assertTrue(settings.implementation === "aria.modules.urlService.PatternURLCreationImpl");
			this.assertTrue(settings.args.length === 2);
		}
	}
});