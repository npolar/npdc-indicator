var gulp = require('gulp');
var npdcGulp = require('npdc-gulp');
var config = npdcGulp.baseConfig;

config.COMMON_VERSION = 'master-latest';
npdcGulp.loadAppTasks(gulp, config);
