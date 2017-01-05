  'use strict';
// [NPDC timeseries](https://github.com/npolar/npdc-indicator)

let angular = require('angular');
let npdcCommon = require('npdc-common');
let AutoConfig = npdcCommon.AutoConfig;
//require('angular-xeditable');

let app = angular.module('indicatorApp', [
  'npdcCommon'
  //xeditable
]);

app.controller('ParameterSearchController', require('./indicator-parameter/ParameterSearchController.js'));
app.controller('ParameterEditController', require('./indicator-parameter/ParameterEditController.js'));
app.controller('ParameterShowController', require('./indicator-parameter/ParameterShowController.js'));

app.controller('TimeseriesSearchController', require('./indicator-timeseries/TimeseriesSearchController'));
app.controller('TimeseriesShowController', require('./indicator-timeseries/TimeseriesShowController'));
app.controller('TimeseriesEditController', require('./indicator-timeseries/TimeseriesEditController'));


app.factory('Google', function() {
  return window.google; // assumes google has already been loaded on the page
});

app.factory('google', function() {
  return window.google; // assumes google has already been loaded on the page
});

app.service('Sparkline', require('./google/Sparkline'));

var services = [
  {"path": "/indicator/parameter",  "resource": "Parameter"},
  {"path": "/indicator/timeseries", "resource": "Timeseries" },
  {"path": "/placename", "base": "//api.npolar.no", "resource": "Placename", fields: "*" },
  {"path": "/editlog", "resource": "Editlog" }
];

services.forEach(function (service) {
  // Expressive DI syntax is needed here
  app.factory(service.resource, ['NpolarApiResource', function (NpolarApiResource) {
    return NpolarApiResource.resource(service);
  }]);
});

// Routing
app.config(require('./routes'));

// Inject auth interceptor
app.config(function($httpProvider, npolarApiConfig) {
  let environment = "production"; // development | test | production
  Object.assign(npolarApiConfig, new AutoConfig(environment));
  $httpProvider.interceptors.push("npolarApiInterceptor");

  // i18n
  $http.get('//api.npolar.no/text/?q=&filter-bundle=npolar|npdc|npdc-indicator&format=json&variant=array&limit=all').then(response => {
    NpolarTranslate.appendToDictionary(response.data);
    NpolarLang.setLanguagesFromDictionaryUse({ min: 0.50, force: ['en', 'nb'], dictionary: response.data});
    console.debug(NpolarLang.getLanguageCounts(response.data));
  });

  //$http.get('//api.npolar.no/service/_all?fields=path,created&format=json&format=json&variant=array&limit=all').then(response => {
  //  console.debug(response);
  //});

  console.debug("npolarApiConfig", npolarApiConfig);
  console.debug("npdcAppConfig", npdcAppConfig);
});

// Inject npolarApiConfig and run
app.run(function(npdcAppConfig, NpolarTranslate) {
  npdcAppConfig.toolbarTitle = "Indicator";
  NpolarTranslate.loadBundles('npdc-indicator');
});
