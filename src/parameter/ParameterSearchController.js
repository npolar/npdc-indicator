'use strict';

var angular = require('angular');

// @ngInject
var ParameterFeedController = function($scope, $location, $controller, npdcAppConfig, Parameter) {

  // Extend NpolarApiBaseController
  $controller("NpolarBaseController", {
    $scope: $scope
  });
  $scope.resource = Parameter;
  npdcAppConfig.cardTitle = 'Environmental monitoring parameters';

  var query = {
    start: 0,
    limit: 1000,
    "size-facet": 5,
    format: "json",
    variant: "atom",
    facets: "systems,collection,species,themes,dataseries,label,warn,variable,unit,locations.placename,links.rel"
  };
  //&date-year=datetime&rangefacet-latitude=10&rangefacet-size=10&sort=datetime&filter-collection=timeseries&q=&format=json
  Parameter.feed(angular.extend(query, $location.search()), function(data) {
    $scope.feed = data.feed;
  });

  $scope.lang = query.lang || "nb";

  $scope.orderProp = 'updated';
};

module.exports = ParameterFeedController;
