'use strict';

let TimeseriesEditController = function($scope, $controller, $timeout, $location,
  NpolarApiSecurity, formulaAutoCompleteService,npdcAppConfig, formula,
  TimeseriesModel, Timeseries, google, Sparkline) {

  'ngInject';

  const schema = '//api.npolar.no/schema/indicator-timeseries-1';

  let init = function() {
    $controller("NpolarEditController", {
      $scope: $scope
    });
    let chartElement = Sparkline.getElement();
    if (chartElement) {
      chartElement.innerHTML = '';
    }
    $scope.resource = Timeseries;
    $scope.siblings = [];

    $scope.formula = formula.getInstance({
      schema,
      form: "indicator-timeseries/timeseries-formula.json",
      templates: npdcAppConfig.formula.templates.concat([/*{
        match(field) {
          return field.id === "locations_item";
        },
        template: '<npdc:formula-placename></npdc:formula-placename>'
      }, */{
        match(field) {
          return field.id === "data";
        },
        template: '<npdc:formula-tabdata></npdc:formula-tabdata>'
      }])
    });

    let autocompleteFacets = ['title.en', 'title.nb', 'label.en', 'label.nb',
      'systems', 'keywords.@value', 'species', 'unit.symbol', 'authors.@id',
      'locations.placename', 'locations.country', 'locations.area',
      'links.href', 'links.rel', 'links.type', 'links.hreflang'];
    formulaAutoCompleteService.autocompleteFacets(autocompleteFacets, Timeseries, $scope.formula);

    $scope.$watch('formula.getModel().keywords', function(keywords, was) {
      if (keywords && keywords.length) {
        console.log('$watch keywords', keywords, was);
      }
    });

  };

  init();
  $scope.edit();

};
module.exports = TimeseriesEditController;
