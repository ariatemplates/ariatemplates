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
 * Test for the FileLoader class
 */
Aria.classDefinition({
    $classpath : "test.aria.core.FileLoaderTest",
    $dependencies : ["test.aria.core.DownloadMgrMock"],
    $extends : "aria.jsunit.TestCase",
    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this.urlRoot = Aria.rootFolderPath + 'test/';
    },
    $prototype : {
        setUp : function () {
            this.overrideClass('aria.core.DownloadMgr', test.aria.core.DownloadMgrMock);
            test.aria.core.DownloadMgrMock.$on({
                'loadFileContent' : this.checkExpectedEvent,
                scope : this
            });
        },
        tearDown : function () {
            test.aria.core.DownloadMgrMock.$unregisterListeners(this);
            this.resetClassOverrides();
        },
        /**
         * Testing that a valid multipart file is loaded correctly.
         */
        testAsyncMultipartOK : function () {
            var url = this.urlRoot + 'aria/core/test/MultipartTestFileOK.txt';
            var fl = new aria.core.FileLoader(url);
            this.registerExpectedEventsList([{
                        name : 'loadFileContent',
                        src : test.aria.core.DownloadMgrMock,
                        logicalPath : '/test/sample/number/1.txt',
                        content : 'part1',
                        hasErrors : false
                    }, {
                        name : 'loadFileContent',
                        src : test.aria.core.DownloadMgrMock,
                        logicalPath : '/test/sample/emptyfile.txt',
                        content : '',
                        hasErrors : false
                    }, {
                        name : 'loadFileContent',
                        src : test.aria.core.DownloadMgrMock,
                        logicalPath : '/test/sample/number/3.txt',
                        content : 'part3',
                        hasErrors : false
                    }, {
                        name : 'fileReady',
                        src : fl,
                        logicalPaths : ['/test/sample/number/1.txt'],
                        url : url,
                        downloadFailed : false
                    }]);
            fl.$on({
                '*' : this.checkEvent,
                'fileReady' : this.checkExpectedEvent,
                'complete' : this._onComplete,
                scope : this
            });
            this.fileloader = fl;
            fl.addLogicalPath('/test/sample/number/1.txt');
            fl.loadFile();
        },
        _onComplete : function (evt) {
            evt.src.$dispose();
            this.notifyTestEnd('testAsyncMultipart');

        },
        /**
         * Testing that an error is correctly reported when trying to download a multipart which does not contain the
         * logical path we expected
         */
        testAsyncMultipartMissingLP : function () {
            var url = this.urlRoot + 'aria/core/test/MultipartTestFileOK.txt';
            var fl = new aria.core.FileLoader(url);
            this.registerExpectedEventsList([{
                        name : 'loadFileContent',
                        src : test.aria.core.DownloadMgrMock,
                        logicalPath : '/test/sample/number/1.txt',
                        content : 'part1',
                        hasErrors : false
                    }, {
                        name : 'loadFileContent',
                        src : test.aria.core.DownloadMgrMock,
                        logicalPath : '/test/sample/emptyfile.txt',
                        content : '',
                        hasErrors : false
                    }, {
                        name : 'loadFileContent',
                        src : test.aria.core.DownloadMgrMock,
                        logicalPath : '/test/sample/number/3.txt',
                        content : 'part3',
                        hasErrors : false
                    }, {
                        name : 'loadFileContent',
                        src : test.aria.core.DownloadMgrMock,
                        logicalPath : '/test/nonexistent.txt',
                        hasErrors : true
                    }, {
                        name : 'fileReady',
                        src : fl,
                        logicalPaths : ['/test/nonexistent.txt'],
                        url : url,
                        downloadFailed : true
                    }]);
            fl.$on({
                'fileReady' : this._onFileReadyMissingLP,
                'complete' : this._onComplete,
                scope : this
            });
            this.fileloader = fl;
            fl.addLogicalPath('/test/nonexistent.txt');
            fl.loadFile();
        },
        _onFileReadyMissingLP : function (evt) {
            try {
                this.assertErrorInLogs(aria.core.FileLoader.LPNOTFOUND_MULTIPART);
            } catch (ex) {}
            this.checkExpectedEvent(evt);
        },
        /**
         * Testing that an invalid multipart, with missing logical-paths info in some sections still loads correctly
         * other parts
         */
        testAsyncMultipartInvalid : function () {
            var url = this.urlRoot + 'aria/core/test/MultipartTestFileKO.txt';
            var fl = new aria.core.FileLoader(url);
            this.registerExpectedEventsList([{
                        name : 'loadFileContent',
                        src : test.aria.core.DownloadMgrMock,
                        logicalPath : '/test/stillloaded.txt',
                        content : 'OK',
                        hasErrors : false
                    }, {
                        name : 'fileReady',
                        src : fl,
                        logicalPaths : ['/test/stillloaded.txt'],
                        url : url,
                        downloadFailed : false
                    }]);
            fl.$on({
                'fileReady' : this._onFileReadyInvalid,
                'complete' : this._onComplete,
                scope : this
            });
            this.fileloader = fl;
            fl.addLogicalPath('/test/stillloaded.txt');
            fl.loadFile();
        },
        _onFileReadyInvalid : function (evt) {
            try {
                this.assertErrorInLogs(aria.core.FileLoader.INVALID_MULTIPART);
            } catch (ex) {
                this.handleAsyncTestError(ex);
            }
            this.checkExpectedEvent(evt);
        },
        /**
         * Testing that an error is correctly reported when trying to download multiple logical paths from a URL which
         * is not multipart
         */
        testAsyncExpectingMultipart : function () {
            var url = this.urlRoot + 'aria/core/test/TestFile.txt';
            var fl = new aria.core.FileLoader(url);
            this.registerExpectedEventsList([{
                        name : 'loadFileContent',
                        src : test.aria.core.DownloadMgrMock,
                        logicalPath : '/test/file1.txt',
                        hasErrors : true
                    }, {
                        name : 'loadFileContent',
                        src : test.aria.core.DownloadMgrMock,
                        logicalPath : '/test/file2.txt',
                        hasErrors : true
                    }, {
                        name : 'fileReady',
                        src : fl,
                        logicalPaths : ['/test/file1.txt', '/test/file2.txt'],
                        url : url,
                        downloadFailed : true
                    }]);
            fl.$on({
                'fileReady' : this._onFileReadyExpectingMultipart,
                'complete' : this._onComplete,
                scope : this
            });
            this.fileloader = fl;
            fl.addLogicalPath('/test/file1.txt');
            fl.addLogicalPath('/test/file2.txt');
            fl.loadFile();
        },
        _onFileReadyExpectingMultipart : function (evt) {
            try {
                this.assertErrorInLogs(aria.core.FileLoader.EXPECTED_MULTIPART);
            } catch (ex) {}
            this.checkExpectedEvent(evt);
        },
        /**
         * Testing that a simple file is correctly loaded.
         */
        testAsyncSimpleFile : function () {
            var url = this.urlRoot + 'aria/core/test/TestFile.txt';
            var fl = new aria.core.FileLoader(url);
            this.registerExpectedEventsList([{
                        name : 'loadFileContent',
                        src : test.aria.core.DownloadMgrMock,
                        logicalPath : url,
                        content : '[Some Test Content]',
                        hasErrors : false
                    }, {
                        name : 'fileReady',
                        src : fl,
                        logicalPaths : [url],
                        url : url,
                        downloadFailed : false
                    }]);
            fl.$on({
                'fileReady' : this.checkExpectedEvent,
                'complete' : this._onComplete,
                scope : this
            });
            this.fileloader = fl;
            fl.addLogicalPath(url);
            // test when logical path is added multiple times (same file request multiple times)
            fl.addLogicalPath(url);
            fl.loadFile();
        },
        /**
         * Testing that an error in download is correctly reported.
         */
        testAsyncInexistentFile : function () {
            var url = this.urlRoot + 'aria/core/test/InexistentFile.txt';
            var fl = new aria.core.FileLoader(url);
            this.registerExpectedEventsList([{
                        name : 'loadFileContent',
                        src : test.aria.core.DownloadMgrMock,
                        logicalPath : url,
                        hasErrors : true
                    }, {
                        name : 'fileReady',
                        src : fl,
                        logicalPaths : [url],
                        url : url,
                        downloadFailed : true
                    }]);
            fl.$on({
                'fileReady' : this.checkExpectedEvent,
                'complete' : this._onComplete,
                scope : this
            });
            this.fileloader = fl;
            fl.addLogicalPath(url);
            fl.loadFile();
        }
    }
});
