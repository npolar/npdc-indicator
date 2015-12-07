var gulp = require('gulp');
var npdcGulp = require('npdc-gulp');
npdcGulp.loadAppTasks(gulp, {
  'deps': {
    'css': ['node_modules/chronopic/dist/css/chronopic-ext-md.min.css',
            'node_modules/chronopic/dist/css/chronopic.min.css'].concat(npdcGulp.baseConfig.deps.css)
  }
});
