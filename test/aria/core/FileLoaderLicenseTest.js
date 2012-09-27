
/**
 * Test for the FileLoader class
 */
Aria.classDefinition({
    $classpath : 'test.aria.core.FileLoaderLicenseTest',
    $dependencies : ['test.aria.core.DownloadMgrMock'],
    $extends : 'aria.jsunit.TestCase',

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
         * Testing that a valid multipart file with license header is loaded correctly.
         */
        testAsyncMultipartOK : function () {
            var url = this.urlRoot + 'aria/core/test/MultipartLicenseFileOK.txt';
            var fl = new aria.core.FileLoader(url);
            this.registerExpectedEventsList([{
                        name : 'loadFileContent',
                        src : test.aria.core.DownloadMgrMock,
                        logicalPath : '/test/sample/number/1.txt',
                        content : 'content1',
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
                        content : 'content3',
                        hasErrors : false
                    }, {
                        name : 'fileReady',
                        src : fl,
                        logicalPaths : ['/test/sample/number/1.txt'],
                        url : url,
                        downloadFailed : false
                    }]);
            fl.$on({
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
            this.notifyTestEnd('testAsyncMultipartOK');

        },

        /**
         * Testing a Multipart file with license header for each part loaded correctly.
         */
        testAsyncMultipartEachLicenseOK : function () {
            var url = this.urlRoot + 'aria/core/test/MultipartEachLicenseFileOK.txt';
            var fl = new aria.core.FileLoader(url);
            this.registerExpectedEventsList([{
                        name : 'loadFileContent',
                        src : test.aria.core.DownloadMgrMock,
                        logicalPath : '/test/loreum/number/1.txt',
                        content : "/* Copy right */\r\ncontent\r\n",
                        hasErrors : false
                    }, {
                        name : 'fileReady',
                        src : fl,
                        logicalPaths : ['/test/loreum/number/1.txt'],
                        url : url,
                        downloadFailed : false
                    }]);
            fl.$on({
                'fileReady' : this.checkExpectedEvent,
                'complete' : this._onComplete,
                scope : this
            });
            this.fileloader = fl;
            fl.addLogicalPath('/test/loreum/number/1.txt');
            fl.loadFile();
        },
        /**
         * Testing a Simple file with license header with Multipart like syntax as content.
         */
        testAsyncSimpleFile : function () {
            var url = this.urlRoot + 'aria/core/test/SimpleFileLicenseOK.txt';
            var fl = new aria.core.FileLoader(url);
            this.registerExpectedEventsList([{
                        name : 'loadFileContent',
                        src : test.aria.core.DownloadMgrMock,
                        logicalPath : url,
                        content : "/*\r\n* Copyright.\r\n*/\r\nSome Test Content\r\n//***MULTI-PART",
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
        }

    }
});