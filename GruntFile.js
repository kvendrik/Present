module.exports = function (grunt){

     grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        paths: {
            public: 'public',
            dev: 'dev'
        },

		connect: {
			server: {
				options: {
					livereload: true,
					hostname: '0.0.0.0',
					port: 9000,
					base: '<%= paths.public %>/'
				}
			}
		},

		watch: {
			options: {
			    livereload: true,
			},
		  	ejs: {
				files: ['<%= paths.dev %>/ejs/**/*.ejs'],
                tasks: ['ejs']
		  	},
		  	js: {
		  		files: ['<%= paths.dev %>/js/**/*.js'],
		  		tasks: ['concat']
		  	},
		  	sass: {
		  		files: ['<%= paths.dev %>/sass/**/*.scss'],
		  		tasks: ['build:scss']
		  	}
		},

        ejs: {
            all: {
                src: ['index.ejs'],
                cwd: '<%= paths.dev %>/ejs/',
                dest: '<%= paths.public %>/',
                expand: true,
                ext: '.html',
                options: {}
            }
        },

		sass: {
            options: {
                style: 'compressed',
                sourcemap: 'none'
            },
			dist: {
			  files: {
			    '<%= paths.public %>/css/main.css': '<%= paths.dev %>/sass/main.scss'
			  }
			}
		},

        autoprefixer: {
            options: {
                expand: true,
                flatten: true,
                browsers: ['last 20 versions', 'ie 8', 'ie 9'],
            },
            all: {
                src: '<%= paths.public %>/css/main.css',
                dest: '<%= paths.public %>/css/main.css'
            }
        },

		concat: {
			options: {
			  separator: '\n\n',
			},
			js: {
			  src: ['<%= paths.dev %>/js/_present/vendor/**/*.js', '<%= paths.dev %>/js/_present/app.js', '<%= paths.dev %>/js/**/*.js'],
			  dest: '<%= paths.public %>/js/main.js'
			}
		},

		uglify: {
			js: {
			  files: {
			    '<%= paths.public %>/js/main.min.js': ['<%= paths.dev %>/js/_present/vendor/**/*.js', '<%= paths.dev %>/js/_present/app.js', '<%= paths.dev %>/js/**/*.js']
			  }
			}
		}

     });

     require('load-grunt-tasks')(grunt);

     grunt.registerTask('default', ['connect', 'watch']);

     grunt.registerTask('build:scss', ['sass', 'autoprefixer']);
     grunt.registerTask('build:dev', ['ejs', 'build:scss', 'concat']);
     grunt.registerTask('build', ['ejs', 'build:scss', 'uglify']);
}
