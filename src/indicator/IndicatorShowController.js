'use strict';

// @ngInject
var IndicatorController = function($log, $scope, $routeParams, $location, $controller, NpolarTranslate, Indicator, Parameter) {
  
  $scope.T = NpolarTranslate;
  
  let showAction = function() {
    
    // Fetch indicator document and its descendants (parameter children and timeseries grandchildren)
    Indicator.fetch($routeParams, function(indicator) {
       
      $scope.document = indicator;
    
      $scope.parameters = [];
      let parameter_ids = [];
    
      if (indicator.parameters && indicator.parameters.length > 0) {
        parameter_ids = indicator.parameters.map(p => {
          return p.match(/\/([-\w]+)$/)[1];
        });

        Parameter.array({ "filter-id": parameter_ids.join("|"), fields: "*", limit: indicator.parameters.length }, function(parameters) {
          $scope.parameters = parameters;
  
        });
      }
      
      
    });
  };
  
  // Extend NpolarApiBaseController and inject resource
  $controller("NpolarBaseController", {$scope: $scope});
  $scope.resource = Indicator;
  showAction();

};
module.exports = IndicatorController;