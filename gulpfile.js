var gulp = require('gulp');
var npdcGulp = require('npdc-gulp');
var config = npdcGulp.baseConfig;
config.COMMON_VERSION = '4.8.3';
npdcGulp.loadAppTasks(gulp, config);
