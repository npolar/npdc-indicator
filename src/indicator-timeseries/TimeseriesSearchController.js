'use strict';
var angular = require('angular');
var _ = require('lodash');

// @ngInject
var TimeseriesFeedController = function($scope, $location, $controller,NpolarTranslate, npdcAppConfig, Timeseries) {
    
  // Extend NpolarApiBaseController
  $controller("NpolarBaseController", {$scope: $scope});
  $scope.resource = Timeseries;
  $scope.T = NpolarTranslate;
  npdcAppConfig.cardTitle = 'Environmental monitoring';
    
    //Nav.array(function(data) {
    //  var nav = _.reject(data, function(li) {
    //    if (angular.isDefined(li.access)) {
    //      return true;
    //    } else {
    //      return false;
    //    }
    //  });
    //   $scope.nav = nav;
    //});
    
    var query = { start: 0, limit: 1000, "size-facet": 5, format: "json",  variant: "atom", sort: "-updated",
      "filter-data.year": "0..",
      facets: "systems,collection,species,themes,warn,unit,locations.placename,links.rel",
      fields: "systems,collection,species,titles,id,created,created_by,updated,updated_by"
    };
    //&date-year=datetime&rangefacet-latitude=10&rangefacet-size=10&sort=datetime&filter-collection=timeseries&q=&format=json
    Timeseries.feed(angular.extend(query, $location.search()), function(data) {
      $scope.feed = data.feed;
    });
    
    $scope.lang = query.lang || "nb";
    
    $scope.orderProp = 'updated';
    
    // Switch language
    //$scope.setLang = function(lang) {
    //  $scope.lang = lang;
    //  $scope.title = $scope.getTitle(lang);
    //  
    //};
    
    $scope.getTitle = function(lang) {
      return _.where($scope.timeseries.titles,
        { lang: lang }
      )[0].title || $scope.timeseries.title[0].title; 
    };
    
  $scope.setNoData = function() {
    var noDataQuery = { start: 0, limit: 1000, "variant": "array", format: "json", "not-data.year": "0..", fields: "id,titles", sort: "-updated" };
    Timeseries.array(angular.extend(noDataQuery, $location.search()), function(array) { $scope.noData = array; });
  };
  
  $scope.setNoData();
    
    
};
module.exports = TimeseriesFeedController;