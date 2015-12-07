'use strict';
/**
 * @ngInject
 */
let IndicatorSearchController = function($scope, $location, $controller, npdcAppConfig, NpdcAutocompleteConfigFactory, NpolarApiSecurity, NpolarTranslate, Indicator) {
  
  // Extend NpolarApiBaseController
  $controller("NpolarBaseController", {
    $scope: $scope
  });
  $scope.resource = Indicator;

  npdcAppConfig.cardTitle = 'Environmental monitoring indicators';
  
  //let options = { placeholder: 'Search indicators, parameters, and timeseries',
  //  collections: {
  //    'indicator': true,
  //    'indicator/parameter': true,
  //    'indicator/timeseries': true
  //  }, base: '/indicator'
  //};
  //$scope.options = new NpdcAutocompleteConfigFactory(options);
  
    let query = { start: 0,
      limit: 1000,
      'size-facet': 5,
      format: 'json',
      sort: '-updated',
      variant: 'atom',
      facets: 'systems,collection,species,themes,dataseries,label,warn,variable,unit,locations.placename,links.rel'
    };
    //&date-year=datetime&rangefacet-latitude=10&rangefacet-size=10&sort=datetime&filter-collection=timeseries&q=&format=json
    Indicator.feed(Object.assign(query,$location.search()), function(data) {
      $scope.feed = data.feed;
    });    
};
module.exports = IndicatorSearchController;
