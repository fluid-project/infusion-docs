/*
Copyright 2014 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

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
                        src: ['*.md', 'tutorial-gettingStartedWithInfusion/*.md'],
                        dest: 'html/',
                        ext: '.html'
                    }
                ],
                options: {
                    markdownOptions: {
                        gfm: true,
                        tables: true,
                        breaks: false
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-markdown');

    grunt.registerTask('default', ['markdown']);

};
