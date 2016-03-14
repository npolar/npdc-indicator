'use strict';

let ParameterEditController = function($scope, $controller, formula, formulaAutoCompleteService,
  npolarApiConfig, npdcAppConfig, Parameter, Timeseries) {
  'ngInject';

  const schema = '//api.npolar.no/schema/indicator-parameter-1';

  function init() {
    $controller("NpolarEditController", {
      $scope: $scope
    });
    $scope.resource = Parameter;

    $scope.siblings = [];
    $scope.formula = formula.getInstance({
      schema,
      form: "indicator-parameter/parameter-formula.json",
      templates: npdcAppConfig.formula.templates.concat([{
        match(field) {
          return field.id === "locations_item";
        },
        template: '<npdc:formula-placename></npdc:formula-placename>'
      }, {
        match(field) {
          return field.id === "data";
        },
        template: '<npdc:formula-tabdata></npdc:formula-tabdata>'
      }])
    });

    formulaAutoCompleteService.autocompleteFacets(['species', 'unit.symbol'], Timeseries, $scope.formula);
  }
  init();

  // Add new timeseries to current parameter
  $scope.addTimeseries = function(parameter) {
    let duplicate = Object.create(parameter);
    let timeseries = new Timeseries({
      titles: duplicate.titles, //map(t => { t.title += ` [${duplicate.timeseries.length+1}]`; return t; }
      species: duplicate.species,
      collection: 'timeseries',
      workspace: 'indicator',
      systems: duplicate.systems,
      locations: duplicate.locations,
      schema: 'http://api.npolar.no/schema/indicator-timeseries-1'
    });

    timeseries.$save(function(timeseries) {
      let timeseries_uri = "http:" + npolarApiConfig.base + "/indicator/timeseries/" + timeseries.id;
      parameter.timeseries.push(timeseries_uri);
      $scope.update(parameter);
    });
  };

  $scope.edit();

};
module.exports = ParameterEditController;
