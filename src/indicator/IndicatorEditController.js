'use strict';

// @ngInject
var IndicatorEditController = function($scope, $routeParams, $controller, $location, Indicator, Parameter) {

  const schema = "//api.npolar.no/schema/indicator-1";

  // Extend NpolarEditController and inject resource
  $controller("NpolarEditController", {
    $scope: $scope
  });
  $scope.lang = $location.search().lang || "nb";



  //$http.get(schema).then(response => {
  //let schema = response.data;
  //console.log(schema);
  $scope.resource = Indicator;

  $scope.formula.schema = schema;
  $scope.formula.template = 'material';
  $scope.formula.form = "indicator/indicator-formula.json";


  let newAction = function() {
    $scope.document = new Indicator({
      titles: [{
        lang: "nb",
        title: "Indikator"
      }, {
        lang: "en",
        title: "Indicator"
      }],
      systems: ["mosj.no"],
      schema,
      workspace: "indicator",
      collection: "indicator"
    });
    $scope.newAction();
  };

  let updateAction = function() {

    // Fetch indicator document and its descendants (parameter children and timeseries grandchildren)
    Indicator.fetch($routeParams, function(indicator) {

      $scope.document = indicator;
      $scope.formula.model = indicator;

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


  if ($routeParams.id === "__new") {
    newAction();
  } else {
    updateAction();
  }

};

module.exports = IndicatorEditController;
