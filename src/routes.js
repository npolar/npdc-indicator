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
    templateUrl: 'indicator-timeseries/timeseries-search.html',
    controller: 'TimeseriesSearchController',
    reloadOnSearch: false
  })

  // parameter
  .when('/parameter/:id/show', {
    redirectTo: '/parameter/:id'
  })

  .when('/parameter', {
    templateUrl: 'indicator-parameter/parameter-search.html',
    controller: 'ParameterSearchController',
    reloadOnSearch: false
  })
  .when('/parameter/:id', {
    //redirectTo: '/parameter/:id/edit'
    templateUrl: 'indicator-parameter/parameter-show.html', controller: 'ParameterShowController'
  })
  .when('/parameter/:id/edit', {
    templateUrl: 'indicator-parameter/parameter-edit.html', controller: 'ParameterEditController'
  })

    
    
    //.when('/', {
    //  redirectTo: '/timeseries'
    //})
    
    ;
    
    
    

    

};
module.exports = routes;
