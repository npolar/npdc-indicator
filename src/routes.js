'use strict';

/**
 * @ngInject */
var routes = function($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true).hashPrefix('!');

  $routeProvider
  // timeseries
  .when('/timeseries/:id/edit', {
    templateUrl: 'indicator-timeseries/timeseries-edit.html', controller: 'TimeseriesEditController'
  })
  .when('/timeseries/:id', {
    redirectTo: '/timeseries/:id/edit'
  })
  .when('/timeseries', {
    templateUrl: 'indicator-timeseries/timeseries-search.html', controller: 'TimeseriesSearchController'
  })
  
  // parameter
  .when('/parameter/:id/show', {
    redirectTo: '/parameter/:id'
  })  
  //.when('/parameter', {
  //  redirectTo: '/parameter/search'
  //})  
  .when('/parameter', {
    templateUrl: 'parameter/parameter-search.html', controller: 'ParameterSearchController'
  })    
  .when('/parameter/:id', {
    //redirectTo: '/parameter/:id/edit'
    templateUrl: 'parameter/parameter-show.html', controller: 'ParameterShowController'
  })
  .when('/parameter/:id/edit', {
    templateUrl: 'parameter/parameter-edit.html', controller: 'ParameterEditController'
  })
  
  // (indicator)
  //.when('/', {
  //  redirectTo: '/search'
  //})
  
  //.when('/__new/edit', {
  //  templateUrl: 'indicator/indicator-edit.html', controller: 'IndicatorEditController'
  //})
  
  .when('/', {
      templateUrl: 'indicator/indicator-search.html',
      controller: 'IndicatorSearchController'
    })
    .when('/:id/show', {
      redirectTo: '/:id'
    })
    .when('/:id', {
      templateUrl: 'indicator/indicator-show.html',
      controller: 'IndicatorShowController'
    })
    .when('/:id/edit', {
      templateUrl: 'indicator/indicator-edit.html',
      controller: 'IndicatorEditController'
    });

};
module.exports = routes;
