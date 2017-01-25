'use strict';

var TimeseriesEditController = function($scope, $controller, $timeout,
  NpolarApiSecurity, formulaAutoCompleteService, Timeseries, Parameter, npdcAppConfig, formula, google, Sparkline) {
    'ngInject';

  //@todo Autocomplete @id for authors
  // Duplicate
  // Consider again having multiple timeseries in one => avoids keywords...
  //const schema = '//api.npolar.no/schema/indicator-timeseries-1';
  const schema = 'indicator-timeseries/indicator-timeseries-1.json';

  let init = function() {
    $controller("NpolarEditController", {
      $scope: $scope
    });
    let chartElement = Sparkline.getElement();
    if (chartElement) {
      chartElement.innerHTML = '';
    }
    $scope.resource = Timeseries;
    $scope.parameter = null;
    $scope.siblings = [];
    $scope.formula = formula.getInstance({
      schema,
      form: "indicator-timeseries/timeseries-formula.json",
      templates: npdcAppConfig.formula.templates.concat([{
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
      ])
    });

    $scope.$watch('formula.getModel().keywords', function(keywords, was) {
      console.log('watch keywords', keywords, was);
    });


    formulaAutoCompleteService.autocompleteFacets(['title.en', 'title.nb', 'systems', 'keywords.@value', 'species', 'unit.symbol', 'authors.@id'], Timeseries, $scope.formula);
  };
  init();


  let resource = $scope.edit();

  // For edit (and not new) we want to fetch the parent parameter
  if (resource && resource.$promise) {
    resource.$promise.then(timeseries => {

      $scope.data = timeseries.data;




      if ($scope.data && $scope.data.length > 0) {
        $timeout(() => {
          let sparkline = timeseries.data.map(d => [d.value]);
          google.setOnLoadCallback(Sparkline.draw(sparkline));
        },20);
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
