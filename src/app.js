'use strict';
// [indicatorApp](https://github.com/npolar/npdc-indicator)

let angular = require('angular');
let npdcCommon = require('npdc-common');
let AutoConfig = npdcCommon.AutoConfig;
require('angular-xeditable');

// Create "vesselApp" (angular module) and declare its dependencies
let app = angular.module('indicatorApp', [
  'npdcCommon',
  "xeditable"
]);

//app.service('NpolarLang', require('./../node_modules/angular-npolar/src/api/i18n/LangService'));
//app.service('NpolarTranslate', require('./../node_modules/angular-npolar/src/api/i18n/TranslateService'));

// app.value('npolarTranslateDictionary', require('angular-npolar/src/ui/i18n/translateDictionary'));
//app.service('NpolarLang', require('angular-npolar/src/ui/i18n/LangService'));
//app.service('NpolarTranslate', require('angular-npolar/src/ui/i18n/TranslateService'));
//app.filter('t', require('angular-npolar/src/ui/i18n/translateFilter'));
//app.filter('title', require('angular-npolar/src/ui/i18n/titleFilter'));

app.controller('IndicatorSearchController', require('./indicator/IndicatorSearchController.js'));
app.controller('IndicatorEditController', require('./indicator/IndicatorEditController.js'));
app.controller('IndicatorShowController', require('./indicator/IndicatorShowController.js'));

app.controller('ParameterSearchController', require('./indicator-parameter/ParameterSearchController.js'));
app.controller('ParameterEditController', require('./indicator-parameter/ParameterEditController.js'));
app.controller('ParameterShowController', require('./indicator-parameter/ParameterShowController.js'));

app.controller('TimeseriesSearchController', require('./indicator-timeseries/TimeseriesSearchController'));
app.controller('TimeseriesEditController', require('./indicator-timeseries/TimeseriesEditController'));


app.directive('input', require('npdc-common/src/wrappers/chronopic')({
  css: { 'max-width': '340px' },
  format: '{date}' // display format (stored as proper RFC 3339 date or date-time)
}));

var services = [
  {"path": "/indicator",  "resource": "Indicator"},
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

// Routing
app.config(require('./routes'));

// Inject auth interceptor
app.config(function($httpProvider) {
  $httpProvider.interceptors.push("npolarApiInterceptor");
});

// Inject npolarApiConfig and run
app.run(function($http, npolarApiConfig, npdcAppConfig, NpolarLang, NpolarTranslate) {

  let environment; // development | test | production

  // i18n
  $http.get('//api.npolar.no/text/?q=&filter-bundle=npolar|npdc|npdc-indicator&format=json&variant=array&limit=all').then(response => {
    NpolarTranslate.appendToDictionary(response.data);
    NpolarLang.setLanguagesFromDictionaryUse({ min: 0.50, force: ['en', 'nb'], dictionary: response.data});
    console.debug(NpolarLang.getLanguageCounts(response.data));
  });


  Object.assign(npolarApiConfig, new AutoConfig(environment));

  npdcAppConfig.cardTitle = '';
  npdcAppConfig.toolbarTitle = NpolarTranslate.translate('npdc.app.Title');

  console.debug("npolarApiConfig", npolarApiConfig);
  console.debug("npdcAppConfig", npdcAppConfig);


});
