'use strict';

let TimeseriesShowController = function($scope, $controller, $timeout,
  NpolarApiSecurity, NpolarTranslate,
  npdcAppConfig,
  Timeseries, TimeseriesModel, TimeseriesCitation, Parameter, google, Sparkline) {

  'ngInject';

  let ctrl = this;

  ctrl.authors = (t) => {
    return t.authors.map(a => {
      return { name: a['@id']};
    });
  };


  $controller("NpolarBaseController", {$scope: $scope});
  $scope.resource = Timeseries;

  let chartElement = Sparkline.getElement();
  if (chartElement) {
    chartElement.innerHTML = '';
  }

  $scope.show().$promise.then(timeseries => {

    $scope.data = timeseries.data;

    $scope.data_not_null = timeseries.data.filter(t => t.value !== undefined);

    $scope.keywords = TimeseriesModel.keywords(timeseries);

    $scope.metadata = TimeseriesModel.metadata(timeseries, $scope.resource, timeseries.uri[0]);

    $scope.citation = (t) => {
      return TimeseriesCitation.citation(timeseries);
    };

    if ($scope.data && $scope.data.length > 0) {
      $timeout(function(){
        $scope.sparkline = true;
        let sparkline = timeseries.data.map(d => [d.value]);
        google.setOnLoadCallback(Sparkline.draw(sparkline));
      });
    }

    if ($scope.keywords && $scope.keywords.en) {

      let k1 = $scope.keywords.en.join(',');
      let k2 = $scope.keywords.no.join(',');

      Timeseries.array({"filter-keywords.@value": k1, limit: "all"}).$promise.then(t => {
        $scope.siblings_en = t.length;
      });

      Timeseries.array({"filter-keywords.@value": k2, limit: "all"}).$promise.then(t => {
        $scope.siblings_no = t.length;
      });


    }





    Timeseries.array({"filter-parameter": timeseries.parameter, limit: "all"}).$promise.then(t => {
      console.log("Siblings via common parameter URI:", t.length);
    });

    let uri = NpolarApiSecurity.canonicalUri(`/indicator/timeseries/${timeseries.id}`, 'http');
    Parameter.array({ "filter-timeseries": uri, fields: "*", limit: 1 }, parameters => {
      if (parameters && parameters.length > 0) {
        $scope.parameter = parameters[0];

        $scope.siblings = $scope.parameter.timeseries;
        console.log("Siblings via Parameter API (IDs linked)", $scope.siblings.length);
      }
    });





  });
};
module.exports = TimeseriesShowController;
