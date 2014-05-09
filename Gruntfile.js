module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            html: "html"
        },
        markdown: {
            all: {
                files: [
                    {
                        expand: true,
                        src: '*.md',
                        dest: 'html/',
                        ext: '.html'
                    }
                ],
                options: {
                    markdownOptions: {
                        gfm: true,
                        tables: true,
                        breaks: true
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-markdown');

    grunt.registerTask('default', ['markdown']);

};
