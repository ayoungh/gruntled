/*!
 * Gruntled Theme Gruntfile
 * http://ayoungh.com
 * @author Anthony Young
 */

'use strict';

module.exports = function(grunt) {

    // load all grunt tasks matching the `grunt-*` pattern
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        /*
        * Next we can read in the project settings from the package.json file into the pkg property.
        * This allows us to refer to the values of properties within our package.json file, as we'll see shortly.
        */
        pkg: grunt.file.readJSON('package.json'),

        /**
         * Set project info
         */
        project: {
          src: 'src',
          app: 'app', 
          css: [
            'assets/scss/style.scss'
          ],
          js: [
            'assets/js/*.js'
          ]

        },

        /**
         * Project banner
         * Dynamically appended to CSS/JS files
         * Inherits text from package.json
         */
        tag: {
          banner: '/*!\n' +
                  ' * <%= pkg.name %>\n' +
                  ' * <%= pkg.title %>\n' +
                  ' * <%= pkg.url %>\n' +
                  ' * @author <%= pkg.author %>\n' +
                  ' * @version <%= pkg.version %>\n' +
                  ' * Copyright <%= pkg.copyright %>. <%= pkg.license %> licensed.\n' +
                  ' */\n'
        },

        /**
         * Concatenate JavaScript files
         * https://github.com/gruntjs/grunt-contrib-concat
         * Imports all .js files and appends project banner
         */
        concat: {
          dev: {
            files: {
              'js/scripts.min.js': '<%= project.js %>'
            }
          },
          options: {
            stripBanners: true,
            nonull: true,
            banner: '<%= tag.banner %>'
          }
        },  

        // compass and scss
        compass: {
            dist: {
                options: {
                    config: 'config.rb',
                    force: true
                }
            }
        },

        /**
         * Uglify (minify) JavaScript files
         * https://github.com/gruntjs/grunt-contrib-uglify
         * Compresses and minifies all JavaScript files into one
         */
        uglify: {
          options: {
            banner: "<%= tag.banner %>"
          },
          dist: {
            files: {
              'js/scripts.min.js': '<%= project.js %>'
            }
          }
        },


        watch: {
          //Run this task with the grunt imagemin command.
          images: {
            files: ['assets/images/**/*.{png,jpg,jpeg,gif,webp,svg}'],
            tasks: ['imagemin']
          },
          compass: {
              files: ['assets/scss/**/*.{scss,sass}'],
              tasks: ['compass']
          },          
          concat: {
            files: 'assets/js/{,*/}*.js',
            tasks: ['concat:dev']
          },
          livereload: {
              options: { livereload: true },
              files: ['style.css', 'js/*.js', '*.html', '*.php', 'assets/img/**/*.{png,jpg,jpeg,gif,webp,svg}']
          }    
        },

        // image optimization
        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 7,
                    progressive: true
                },
                files: [{
                    expand: true,
                    cwd: 'assets/img/',
                    src: '**/*',
                    dest: 'assets/img/'
                }]
            }
        }        



    });

    grunt.event.on('watch', function(action, filepath, target) {
      grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });

    //
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    // rename tasks
    //grunt.renameTask('rsync', 'deploy');

    /**
    * Default task
    * Run `grunt` on the command line
    */
    // register task
    grunt.registerTask('default', ['watch', 'uglify', 'imagemin']);


};