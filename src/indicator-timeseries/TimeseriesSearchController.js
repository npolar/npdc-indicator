'use strict';

// @ngInject
var TimeseriesSearchController = function($scope, $location, $controller, $filter, $timeout, npdcAppConfig, NpolarLang, Timeseries, Sparkline) {

  // Extend NpolarApiBaseController
  $controller("NpolarBaseController", {
    $scope: $scope
  });
  $scope.resource = Timeseries;

  $scope.avatar = function(t) {
    return t.systems.join(',');
  };

  $scope.subtitle = function(t) {
    let points = 0;
    let subtitle = '';
    if (t.data && t.data.length > 0) {
      points = t.data.length;
      let first = t.data[0];
      let last = t.data[t.data.length-1];
      subtitle = `${points} data points (${first.when||first.year}-${last.when||last.year})`;
    }
    subtitle += `. Updates: ${ $filter('date')(t.updated)}`;
    return subtitle;
  };

  let query = function() {

    let defaults = {
      start: 0,
      limit: 'all',
      "size-facet": 5,
      format: "json",
      variant: "atom",
      sort: "-updated",
      "filter-data.year": "0..",
      facets: "systems,collection,species,themes,warn,unit,locations.placename,links.rel",
      fields: "systems,data,labels,collection,species,titles,id,created,created_by,updated,updated_by"
    };

    let invariants = {}; //$scope.security.isAuthenticated() ? {} : { "not-draft": "yes", "not-progress": "planned", "filter-links.rel": "data" };
    return Object.assign({}, defaults, invariants);
  };

  let search = function() {
    $scope.search(query()).$promise.then(response => {
      // $timeout(function(){
      //   Sparkline.drawArray(response.feed.entries);
      // });
    });


  };

  $scope.findTimeseriesWithoutData = function() {
    var noDataQuery = {
      start: 0,
      limit: 'all',
      "variant": "array",
      format: "json",
      "not-data.year": "0..",
      fields: "id,titles",
      sort: "-updated"

    };
    Timeseries.array(Object.assign(noDataQuery, $location.search()), function(array) {
      $scope.noData = array;
    });
  };

  $scope.findTimeseriesWithoutData();
  search();

  $scope.$on('$locationChangeSuccess', (event) => {
    search();
  });
};
module.exports = TimeseriesSearchController;
