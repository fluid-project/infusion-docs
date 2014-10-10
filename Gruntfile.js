/*
Copyright 2014 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var pagesSrcDir = "docs";
var imagesSrcDir = "docs/images";
var pagesDestDir = "src/pages-copy";
var imagesDestParent = "src/images-copy";
var imagesDestDir = imagesDestParent + "/images";

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: {
            pages: pagesDestDir,
            images: imagesDestParent
        },
        copy: {
            pages: {
                files: [{
                    expand: true,
                    cwd: pagesSrcDir,
                    src: "**/*.md",
                    dest: pagesDestDir
                }]
            },
            images: {
                files: [{
                    expand: true,
                    cwd: imagesSrcDir,
                    src: "**",
                    dest: imagesDestDir
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['copy']);
};
