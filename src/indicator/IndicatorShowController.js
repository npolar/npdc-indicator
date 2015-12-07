'use strict';

// @ngInject
let IndicatorShowController = function($log, $scope, $routeParams, $location, $controller, $filter, npdcAppConfig, Indicator, Parameter) {

  // Extend NpolarApiBaseController and inject resource
  $controller("NpolarBaseController", {
    $scope: $scope
  });
  $scope.resource = Indicator;
  
  let showAction = function() {
    
    // Fetch indicator document and its descendants (parameter children and timeseries grandchildren)
    Indicator.fetch($routeParams, function(indicator) {

      $scope.document = indicator;
      npdcAppConfig.cardTitle = $filter('title')(indicator.titles);

      $scope.parameters = [];
      let parameter_ids = [];

      if (indicator.parameters && indicator.parameters.length > 0) {
        parameter_ids = indicator.parameters.map(p => {
          return p.match(/\/([-\w]+)$/)[1];
        });

        Parameter.array({
          "filter-id": parameter_ids.join("|"),
          fields: "*",
          limit: indicator.parameters.length
        }, function(parameters) {
          $scope.parameters = parameters;

        });
      }
    });
  };


  showAction();

};
module.exports = IndicatorShowController;
