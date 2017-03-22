/**
 * Created by keqinli on 3/20/17.
 */

module.exports = function(grunt){

    //Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mochaTest: {
            local: {
                option: {
                    reporter:'spec',
                    quiet: false,
                    clearRequireCache:false,
                    ui: 'tdd'
                },
                src: ['test/**/*.js']
            }
        }

    });

    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('test', ['mochaTest:local']);

};