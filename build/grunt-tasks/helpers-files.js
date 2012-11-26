/**
 * Shared helpers regarding files and folders manipulations.
 */
module.exports = function(grunt) {

    /**
     * Perform expansion of 'aFiles' by reading <json:..> directives
     * and expanding wildcards (*, **).
     */
    grunt.registerHelper('expandDirectivesAndWildcards', function (aFiles, srcFolder){
        aFiles = grunt.utils._.flatten(aFiles);
        aFiles = grunt.utils._.flatten(aFiles.map(function(item) {
            return grunt.task.directive(item); // expand items like <json:somefile.json>, leave the rest untouched
        }));
        aFiles = grunt.utils._.flatten(aFiles.map(function(item) {
            return grunt.file.expandFiles([srcFolder, item].join('/')); // expand wildcards like *, **
        }));
        return aFiles;
    });

    /**
     * Perform expansion of 'aFiles' by expanding wildcards (*, **).
     */
    grunt.registerHelper('expandWildcards', function(aFiles, srcFolder) {
        aFiles = grunt.utils._.flatten(aFiles.map(function(item) {
            return grunt.file.expandFiles([srcFolder, item].join('/')); // expand wildcards like *, **
        }));
        return aFiles;
    });

    /**
     * Calculate files as a difference of sets {included}\{excluded} from task config.
     * @param taskDataFiles {Object} {include: [...], exclude: [...]}
     * @param srcFolder {String} Base lookup folder. Use '.' for current folder.
     * @param logNoOfFiles {Boolean} Whether to log number of calculated included and excluded files
     * @return {Array:String} list of file paths to be processed
     */
    grunt.registerHelper('getFilesToBeProcessed', function (taskDataFiles, srcFolder, logNoOfFiles) {
        var verbose = grunt.option('verbose');
        logNoOfFiles = logNoOfFiles || verbose;
        srcFolder = srcFolder || '.';

        var includedFiles = grunt.helper('expandDirectivesAndWildcards', taskDataFiles.include, srcFolder);
        var excludedFiles = grunt.helper('expandDirectivesAndWildcards', taskDataFiles.exclude, srcFolder);
        var diff = grunt.utils._.difference(includedFiles, excludedFiles);
        if(logNoOfFiles) {
            grunt.log.writeln('Files matching:        ' + includedFiles.length.toString().yellow);
            grunt.log.writeln('Files to be processed: ' + diff.length.toString().yellow);
            grunt.log.writeln('Files filtered out:    ' + (includedFiles.length - diff.length).toString().yellow);
            if(verbose){
                console.log(excludedFiles);
            }
        }
        return diff;
    });

    /**
     * This is to make it flexible to specify / override src folder per-task / per-target.
     * By default, grunt.config('dirs.src') is taken. But this can be overriden by
     * providing 'srcFolder' or 'srcSubFolder' in task data.
     */
    grunt.registerHelper('getTaskSrcFolder', function (taskData){
        if(taskData.srcFolder){
            return taskData.srcFolder;
        }else{
            var subfolder = taskData.srcSubFolder ? ('/' + taskData.srcSubFolder) : '';
            return grunt.config('dirs.src') + subfolder;
        }
    });

    /**
     * This is to make it flexible to specify / override dest folder per-task / per-target.
     * By default, grunt.config('dirs.dest') is taken. But this can be overriden by
     * providing 'destFolder' or 'destSubFolder' in task data.
     */
    grunt.registerHelper('getTaskDestFolder', function (taskData){
        if(taskData.destFolder){
            return taskData.destFolder;
        }else{
            var subfolder = taskData.destSubFolder ? ('/' + taskData.destSubFolder) : '';
            return grunt.config('dirs.dest') + subfolder;
        }
    });

    /**
     * Set a proper processing function in case we want to minify or add a license
     */
    grunt.registerHelper('getCopyOptions', function (conf) {
        if(!conf){
            return {};
        }
        if(!conf.license && !conf.minify) {
            return {};
        }

        var copyOptions = {
            process: function(fileContent) {
                return grunt.helper('minifyAndUpdateLicense', fileContent, {
                    options : {
                        minify : conf.minify || false,
                        license: conf.license || false
                    }
                });
            },
            noProcess: ['*.html', '*.gif', '*.jpg', '*.jpeg', '*.png', '*.bmp', '*.swf']
        };
        return copyOptions;
    });

    /**
     * Log that certain files were visited by the certain target of the certain task.
     * Warns if the same file is later visited by other target of the same task.
     *
     * To be used also to verify (from within a separate task) that all the files wanted
     * were visited by exactly one target.
     * @param files {Array:String}
     * @param currTaskName {String}
     * @param currTargetName {String}
     */
    grunt.registerHelper('markFilesAsVisited', function (files, currTaskName, currTargetName) {
        if(!files || !files.length || !currTaskName){
            return;
        }
        var visitedEntryId = ['visitedFiles', currTaskName];
        var visited = grunt.config.get(visitedEntryId) || {};

        files.forEach(function (filePath){
            if(visited[filePath]) {
                grunt.warn('The file '.cyan + filePath.yellow + ' has already been visited in the task '.cyan
                    + currTaskName.yellow + ' in the target '.cyan + (visited[filePath]).yellow);
            }
            visited[filePath] = currTargetName;
        });

        grunt.config.set(visitedEntryId, visited);
    });
};
