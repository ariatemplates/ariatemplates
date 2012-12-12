/**
 * Custom wrapper to 'lint' task to exclude some file we don't want to be linted.
 */
module.exports = function(grunt) {

    grunt.registerMultiTask('atlint', 'Calculates files for and runs the lint task.', function() {
        grunt.log.writeln('Starting JSHint...'.cyan);
        var toBeLinted = grunt.helper('getFilesToBeProcessed', this.data, '.', true);

        // we set the src for the corresponding target for the `lint` task
        // to be able to use the natively handled per-task JSHint config
        grunt.config.set(['lint', this.target, 'src'], toBeLinted);
        grunt.task.run('lint:' + this.target);

        // Fail task if errors were logged.
        if (this.errorCount) { return false; }
    });
};
