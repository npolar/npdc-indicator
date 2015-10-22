'use strict';
// [indicatorApp](https://github.com/npolar/npdc-indicator)

require('angular-npolar');
require('angular-route');
require('angular-xeditable');
require('formula');

let angular = require('angular');
let npdcCommon = require('npdc-common');
let AutoConfig = npdcCommon.AutoConfig;

// Create "vesselApp" (angular module) and declare its dependencies
let app = angular.module('indicatorApp', [
  'ngRoute',
  'formula',
  "npolarApi",
  'npolarUi',
  'npdcUi',
  "xeditable",
  "templates"
]);

app.service('NpolarLang', require('./../node_modules/angular-npolar/src/api/i18n/LangService'));
app.service('NpolarTranslate', require('./../node_modules/angular-npolar/src/api/i18n/TranslateService'));

app.controller('IndicatorSearchController', require('./indicator/IndicatorSearchController.js'));
app.controller('IndicatorEditController', require('./indicator/IndicatorEditController.js'));
app.controller('IndicatorShowController', require('./indicator/IndicatorShowController.js'));

app.controller('ParameterSearchController', require('./parameter/ParameterSearchController.js'));
app.controller('ParameterEditController', require('./parameter/ParameterEditController.js'));
app.controller('ParameterShowController', require('./parameter/ParameterShowController.js'));

app.controller('TimeseriesSearchController', require('./timeseries/TimeseriesSearchController'));
app.controller('TimeseriesEditController', require('./timeseries/TimeseriesEditController'));

app.directive('jsonText', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attr, ngModel) {            
          function into(input) {
            return JSON.parse(input);
          }
          function out(data) {

            return JSON.stringify(data);
          }
          ngModel.$parsers.push(into);
          ngModel.$formatters.push(out);

        }
    };
});

var services = [
  {"path": "/indicator",  "resource": "Indicator", schema: "/indicator/edit/indicator-schema.json"},
  {"path": "/indicator/parameter",  "resource": "Parameter"},
  {"path": "/indicator/timeseries", "resource": "Timeseries" },
  {"path": "/placename", "base": "//api.npolar.no", "resource": "Placename", fields: "*" },
  {"path": "/editlog", "resource": "Editlog" },
  {"path": "", "resource": "Config", base: "config" }
];

services.forEach(function (service) {
  // Expressive DI syntax is needed here
  app.factory(service.resource, ['NpolarApiResource', function (NpolarApiResource) {
    return NpolarApiResource.resource(service);
  }]);
});

//app..config(['$compileProvider', function ($compileProvider) {
//  $compileProvider.debugInfoEnabled(true);
//}]);
  
// Routing
app.config(require('./routes'));
  
// Inject auth interceptor
app.config(function($httpProvider) {
  $httpProvider.interceptors.push("npolarApiInterceptor");
});

// Inject npolarApiConfig and run
app.run(function(npolarApiConfig, Config, npdcAppConfig, NpolarLang, NpolarTranslate) {
  
  NpolarLang.lang = 'nb';
  
  let environment = "production"; // development | test | production

  Object.assign(npolarApiConfig, new AutoConfig(environment));
  
  npdcAppConfig.cardTitle = 'Environmental monitoring';
  npdcAppConfig.toolbarTitle = 'Indicators';
    
  console.debug("npolarApiConfig", npolarApiConfig);
  console.debug("npdcAppConfig", npdcAppConfig);
  
});
