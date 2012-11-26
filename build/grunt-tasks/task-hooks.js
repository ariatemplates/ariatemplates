module.exports = function(grunt) {

    grunt.registerTask('gruntTimeHookStart', 'Hook to be executed before the first task', function() {
        grunt.config.set('gruntStartTimestamp', Date.now());
    });

    grunt.registerTask('gruntTimeHookEnd', 'Hook to be executed after the last task', function() {
        var started = grunt.config.get('gruntStartTimestamp');
        var finished = Date.now();
        var elapsed = ((finished - started) / 1000).toFixed(2);

        grunt.log.writeln('--------------------------------------------------------------------------------'.bold.green);
        grunt.log.writeln([('All tasks finished!').bold.green,
                           (' (' + elapsed + ' seconds) ').bold.yellow,
                           (new Date().toUTCString())].join(''));
        grunt.log.writeln('--------------------------------------------------------------------------------'.bold.green);
    });
};
