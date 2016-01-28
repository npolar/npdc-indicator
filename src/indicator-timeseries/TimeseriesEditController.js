'use strict';

// @ngInject
var TimeseriesEditController = function($scope, $controller, $routeParams, $timeout, $location,
  NpolarApiSecurity, NpdcSearchService, Timeseries, Parameter, google, Sparkline) {

  const schema = '//api.npolar.no/schema/indicator-timeseries-1';

  let init = function() {
    $controller("NpolarEditController", {
      $scope: $scope
    });
    $scope.resource = Timeseries;
    $scope.parameter = null;
    $scope.siblings = [];
    $scope.formula.schema = schema;
    $scope.formula.form = "indicator-timeseries/timeseries-formula.json";
    $scope.formula.templates = [{
      match(field) {
          return field.id === "locations_object";
        },
        template: '<npdc:formula-placename></npdc:formula-placename>'
    },
    {
      match(field) {
          return field.id === "data";
        },
        template: '<npdc:formula-tabdata></npdc:formula-tabdata>'
    }
    ];

  };
  init();
  //NpdcSearchService.injectAutocompleteFacetSources(['species', 'unit.symbol'], Timeseries);

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
      Parameter.array({
        "filter-timeseries": uri,
        fields: "*",
        limit: 1
      }, parameters => {
        if (parameters.length > 0) {
          $scope.parameter = parameters[0];
          $scope.siblings = $scope.parameter.timeseries.filter(uri => {
            let id = uri.split('/').slice(-1)[0];
            return (id !== timeseries.id);
          });
        }


      });


    });
  }

};
module.exports = TimeseriesEditController;
