/**
 * Created by keqinli on 3/20/17.
 */

module.exports = function(grunt){

    //Project Configuration
    grunt.initConfig({
        nodemon: {
            dev: {
                script: 'app.js'
            }
        },
        pkg: grunt.file.readJSON('package.json'),
        mochaTest: {
            local: {
                options: {
                    reporter:'spec',
                    quiet: false,
                    clearRequireCache:false,
                    ui: 'tdd'
                },
                src: ['test/unit/*.js']
            }
        },

        mocha_istanbul: {
            coverage: {
                src: 'test/unit/*.js', // a folder works nicely
                options: {
                    mochaOptions: ['--ui', 'tdd'] // any extra options for mocha
                }
            }
        }

    });
    // load nodemon
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.registerTask('default', ['nodemon']);
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.registerTask('coverage', ['mocha_istanbul']);
    grunt.registerTask('test', ['mochaTest:local']);

};