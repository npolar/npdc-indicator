'use strict';

// @ngInject
var TimeseriesSearchController = function($scope, $location, $controller, $filter, $timeout, $http,
  npdcAppConfig, NpolarLang, Timeseries, google, Sparkline) {

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
      subtitle = `${points} data points (${first.when}-${last.when})`;
    }
    subtitle += `. Updates: ${ $filter('date')(t.updated)}`;
    return subtitle;
  };

  $scope.showNext = function() {
    if (!$scope.feed) {
      return false;
    }
    return ($scope.feed.entries.length < $scope.feed.opensearch.totalResults);
  };

  $scope.next = function() {
    if (!$scope.feed.links) {
      return;
    }

    let nextLink = $scope.feed.links.find(link => { return (link.rel === "next"); });
    if (nextLink.href) {
      $http.get(nextLink.href.replace(/^https?:/, '')).success(function(response) {
        response.feed.entries = $scope.feed.entries.concat(response.feed.entries);
        $scope.feed = response.feed;
      });
    }
  };

  let query = function() {

    let defaults = {
      start: 0,
      limit: '30',
      "size-facet": 5,
      format: "json",
      variant: "atom",
      sort: "-updated",
      "filter-data.when": "0..",
      facets: "systems,collection,species,themes,warn,unit,locations.placename,links.rel",
      fields: "systems,data,labels,collection,species,titles,id,created,created_by,updated,updated_by"
    };

    // @todo
    // Limit asearch for folks with NARE-EMP read access
    // https://api.npolar.no/indicator/system/nare-emp
    let invariants = {}; //$scope.security.isAuthenticated() ? {} : { "not-draft": "yes", "not-progress": "planned", "filter-links.rel": "data" };
    if ($scope.security.isAuthorized('read', 'https://api.npolar.no/indicator/system/nare-emp')) {
      //$location.search({'filter-systems': 'NARE-EMP'}, false);
      //invariants['filter-systems'] = 'NARE-EMP';
    }

    return Object.assign({}, defaults, invariants);
  };

  let search = function() {
    $scope.search(query()).$promise.then(response => {
       $timeout(function(){
         google.setOnLoadCallback(Sparkline.drawArray(response.feed.entries));
       });
    });


  };

  $scope.findTimeseriesWithoutData = function() {



    var noDataQuery = {
      start: 0,
      limit: '50',
      "variant": "array",
      format: "json",
      "not-data.when": "0..",
      fields: "id,titles",
      sort: "-updated"

    };
    if ($scope.security.isAuthorized('read', 'https://api.npolar.no/indicator/system/nare-emp')) {
      noDataQuery['filter-systems'] = 'NARE-EMP';
    }

    $scope.noData = Timeseries.array(Object.assign(noDataQuery, $location.search()));
  };

  $scope.findTimeseriesWithoutData();
  search();

  $scope.$on('$locationChangeSuccess', (event) => {
    search();
  });
};
module.exports = TimeseriesSearchController;
