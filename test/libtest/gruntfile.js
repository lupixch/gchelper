module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mochaTest: {
            test: {
                options: {
                    reporter: 'tap',
                    captureFile: 'results.txt',
                    quiet: false,
                    clearRequireCache: false,
                    trace: true,
                },
                src: ['test/*.js']
            }
        },
        jshint: {
                src: ['test/*.js']
        }
    });
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('default', ['mochaTest']);
    grunt.registerTask('test:rest-api', 'mochaTest');
    grunt.registerTask('test:jshint', 'jshint');
};