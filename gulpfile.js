var gulp = require('gulp');
var npdcGulp = require('npdc-gulp');
var config = npdcGulp.baseConfig;

// @todo FIXME Chronepic is broken...
config.deps.css = config.deps.css.concat(['node_modules/chronopic/dist/css/chronopic-ext-md.min.css',
  'node_modules/chronopic/dist/css/chronopic.min.css']);
config.COMMON_VERSION = '2';
npdcGulp.loadAppTasks(gulp, config);
