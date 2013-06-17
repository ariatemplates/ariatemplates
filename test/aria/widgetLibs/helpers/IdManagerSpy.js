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
 * Utility class to spy on the id manager.
 */
Aria.classDefinition({
    $classpath : 'test.aria.widgetLibs.helpers.IdManagerSpy',
    $dependencies : ['aria.utils.IdManager'],
    /**
     * Create an instance of the IdManagerSpy class to spy on the id manager. Until the instance is disposed, all calls
     * to the id manager will be caught and the idsCreated and idsReleased properties will be updated accordingly.
     * @param {aria.jsunit.Assert} testCase testCase used to call asserts.
     */
    $constructor : function (testCase) {
        var oSelf = this;
        this.testCase = testCase;
        /**
         * Array of ids created by the id manager.
         * @type Array
         */
        this.idsCreated = [];
        /**
         * Array of ids released by the id manager.
         * @type Array
         */
        this.idsReleased = [];

        // spy on the id manager:

        var originalGetId = aria.utils.IdManager.prototype.getId;
        var originalReleaseId = aria.utils.IdManager.prototype.releaseId;
        aria.utils.IdManager.prototype.getId = function () {
            var res = originalGetId.call(this);
            oSelf.idsCreated.push(res);
            return res;
        };
        aria.utils.IdManager.prototype.releaseId = function (id) {
            oSelf.idsReleased.push(id);
            originalReleaseId.call(this, id);
        };

        this._dispose = function () {
            aria.utils.IdManager.prototype.getId = originalGetId;
            aria.utils.IdManager.prototype.releaseId = originalReleaseId;
            oSelf = null;
            originalGetId = null;
            originalReleaseId = null;
            delete this._dispose;
        };

    },
    $destructor : function () {
        this.testCase = null;
        this.idsCreated = null;
        this.idsReleased = null;
        this._dispose();
    },
    $prototype : {
        /**
         * Assert that that the given id is in the idsReleased array and remove it from there.
         * @param {String} id id which must be in the idsReleased array
         * @param {String} description description of the error (displayed in case the assert fails)
         */
        assertIdReleased : function (id, description) {
            var res = aria.utils.Array.remove(this.idsReleased, id);
            this.testCase.assertTrue(res, description);
        },

        /**
         * Assert that that the given id is in the idsCreated array and remove it from there.
         * @param {String} id id which must be in the idsCreated array
         * @param {String} description description of the error (displayed in case the assert fails)
         */
        assertIdCreated : function (id, description) {
            var res = aria.utils.Array.remove(this.idsCreated, id);
            this.testCase.assertTrue(res, description);
        },

        /**
         * Assert that that the given id is not in the idsReleased array.
         * @param {String} id id which must not be in the idsReleased array
         * @param {String} description description of the error (displayed in case the assert fails)
         */
        assertIdNotReleased : function (id, description) {
            var res = aria.utils.Array.contains(this.idsReleased, id);
            this.testCase.assertFalse(res, description);
        },

        /**
         * Assert that that the given id is not in the idsCreated array.
         * @param {String} id id which must not be in the idsCreated array
         * @param {String} description description of the error (displayed in case the assert fails)
         */
        assertIdNotCreated : function (id, description) {
            var res = aria.utils.Array.contains(this.idsCreated, id);
            this.testCase.assertFalse(res, description);
        },

        /**
         * Assert that the idsCreated array is empty.
         * @param {String} description description of the error (displayed in case the assert fails)
         */
        assertEmptyIdsCreated : function (description) {
            this.testCase.assertEquals(this.idsCreated.length, 0, description);
        },

        /**
         * Assert that the idsReleased array is empty.
         * @param {String} description description of the error (displayed in case the assert fails)
         */
        assertEmptyIdsReleased : function (description) {
            this.testCase.assertEquals(this.idsReleased.length, 0, description);
        },

        /**
         * Assert that both the idsCreated and the idsReleased array are empty.
         * @param {String} description description of the error (displayed in case the assert fails)
         */
        assertEmptyArrays : function (description) {
            this.assertEmptyIdsCreated(description);
            this.assertEmptyIdsReleased(description);
        },

        _dispose : function () {
            // empty method (the non-empty one will be created in the constructor)
        }
    }
});
