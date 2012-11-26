var spawn = require('child_process').spawn;

module.exports = function(grunt) {

    grunt.registerMultiTask('forkgrunt', 'Runs grunt from grunt', function() {
        var options = {
            script: this.data,
            debug: grunt.option('debug'),
            verbose: grunt.option('verbose'),
            force: grunt.option('force')
        };
        var args = computeArguments(options, []);
        var target = this.target;

        grunt.log.subhead('\nInitializing gruntception ' + ('"forkgrunt:' + target + '"').cyan + ' ('+ options.script +')');
        grunt.log.writeln('--------------------------------------------------------------------------------\n'.bold);

        var done = this.async();
        var grunt_child = grunt.helper('grunt', {
            cmd: 'grunt',
            args: args
        }, function(error, code) {
            if (!error) {
                grunt.log.write('Finishing gruntception '.bold + ('"forkgrunt:' + target + '" ').cyan).ok();
                return done(true);
            } else {
                grunt.fatal('Gruntception ' + ('"forkgrunt:' + target + '"').cyan + 'failed with the code ' + code);
                done(false);
            }
        });
    });

    grunt.registerHelper('grunt', function(options, cb) {
        options.cmd = process.platform === 'win32' ? options.cmd + '.cmd' : options.cmd;
        var child = spawn(options.cmd, options.args, { stdio: 'inherit' });
        var eventName = process.version.split('.')[1] === '6' ? 'exit' : 'close';
        child.on(eventName, function(code) {
            cb(code !== 0, code);
        });

        return child;
    });

    function computeArguments(options, args) {
        if (options.verbose) {
          args.push('--verbose');
        }

        if (options.force) {
          args.push('--force');
        }

        if (options.script) {
          args.push('--config');
          args.push(options.script);
        }

        if (options.debug) {
          args.push('--debug');
        }
        return args;
    }
};
