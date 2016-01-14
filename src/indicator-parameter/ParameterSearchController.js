'use strict';

// @ngInject
var ParameterSearchController = function($scope, $location, $controller, npdcAppConfig, Parameter) {
  // Extend NpolarApiBaseController
  $controller("NpolarBaseController", {
    $scope: $scope
  });
  $scope.resource = Parameter;

  npdcAppConfig.cardTitle = 'Environmental monitoring parameters';
  
  let query = function() {
    let defaults = {
      start: 0,
      limit: 50,
      "size-facet": 5,
      format: "json",
      variant: "atom",
      facets: "systems,collection,species,themes,dataseries,label,warn,variable,unit,locations.placename,links.rel"
    };
    return Object.assign({}, defaults, $location.search());
  };

  $scope.search(query());

  $scope.$on('$locationChangeSuccess', (event, data) => {
    $scope.search(query());
  });
  
  
  
};

module.exports = ParameterSearchController;