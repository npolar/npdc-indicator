'use strict';

// @ngInject
var TimeseriesEditController = function($scope, $controller, $routeParams, $timeout, $location,
  NpolarApiSecurity, Timeseries, Parameter, google, Sparkline) {

  const schema = '//api.npolar.no/schema/indicator-timeseries-1';
  $controller("NpolarEditController", {$scope: $scope});
  $scope.document = {};  
  $scope.resource = Timeseries;
  $scope.formula.schema = schema;
  
  if ($location.search().data) {
    let vars = parseInt($location.search().data);
    if (vars === 2) {
      // Formula simple data (when/value) editing
     $scope.formula.form = "indicator-timeseries/timeseries-data-simple-formula.json";
    } else {
      // Formula data editing
      $scope.formula.form = "indicator-timeseries/timeseries-data-formula.json";
    }
  
  } else {
    // Formula without data editing
    $scope.formula.form = "indicator-timeseries/timeseries-formula.json";
  }
  console.debug($scope.formula.form);
  
  let resource = $scope.edit();

  // For edit (and not new) we want to fetch the parent parameter
  if (resource && resource.$promise) {
    resource.$promise.then(timeseries => {
      
      $scope.data = timeseries.data;

      if ($scope.data && $scope.data.length > 0) {
        $timeout(() => {
          let sparkline = timeseries.data.map(d => [d.value]);
          google.setOnLoadCallback(Sparkline.draw(sparkline));
        });
      }

      
      let uri = NpolarApiSecurity.canonicalUri(`/indicator/timeseries/${timeseries.id}`, 'http');
      Parameter.array({ "filter-timeseries": uri, fields: "*", limit: 1 }, parameters => {
        $scope.parameter = parameters[0];
        
        
        $scope.siblings = $scope.parameter.timeseries.filter(uri => {
          let id = uri.split('/').slice(-1)[0];
          return (id !== timeseries.id);
        });
        
        
      });
      
      
    });
  }

};
module.exports = TimeseriesEditController;
