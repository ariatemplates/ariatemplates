/**
 * Shared helpers regarding text manipulation.
 */
module.exports = function(grunt) {

    /**
     * Perform minification and license update when necessary.
     */
    grunt.registerHelper('minifyAndUpdateLicense', function (inputText, taskData){

        var bMin = taskData.options.minify;
        var lic = taskData.options.license;
        var uglifyOpts = grunt.config('uglify');
        var out = inputText;

        if (bMin) {
            out = grunt.helper('atuglify', out, uglifyOpts); // includes stripping banner
        }else if (lic === 'replace' || lic === 'remove' || lic === true) {
            out = grunt.helper('strip_banner', out);
        }
        if (lic === 'replace') {
            out = grunt.helper('getLicenseTextLazy') + out;
        }
        return out;
    });

    /**
     * Store the preprocessed license text in config
     * the first time it's loaded in order to save on IO.
     */
    grunt.registerHelper('getLicenseTextLazy', function(){
        var lic = grunt.config.get('PREPROCESSED_LICENSE');
        if(lic){
            return lic;
        }else{
            lic = grunt.helper('file_template', './templates/LICENSE');
            grunt.config.set('PREPROCESSED_LICENSE', lic);
            return lic;
        }
    });

    grunt.registerHelper('getSeparatorText', function (taskData) {
        return grunt.utils.normalizelf(taskData.options.separator || grunt.utils.linefeed);
    });
};
