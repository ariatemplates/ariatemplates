/**
 * Display how many bytes were saved in the unnecessary code removal process.
 */
module.exports = function (grunt) {

    grunt.registerTask('removedCodeStats', 'Outputs the stats of unnecessary code removal done in min task.', function () {
        var savedBytes = grunt.config.get('stats.uselessCodeSavedBytes');
        var savedKb = (savedBytes / 1024).toFixed(1);

        grunt.log.write('Useless code removal: saved total '.cyan + (savedKb + ' kB').yellow
                + ' in non-gzipped code. '.cyan).ok();
    });
};
