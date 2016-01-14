'use strict';
var _ = require('lodash');

// @ngInject
var ParameterShowController = function($scope, $routeParams, $location, $controller, $route, $timeout,
  npolarApiConfig, npdcAppConfig, Parameter, Timeseries, google, Sparkline) {

  let title = function (titles, lang) {
    return titles.find((title) => title.lang === lang).title;
  };
  $scope.lang = $location.search().lang || "nb";

  // Extend NpolarApiBaseController and inject resource
  $controller("NpolarBaseController", {
    $scope: $scope
  });
  $scope.resource = Parameter;

  // Fetch parameter document with parent indicator and timeseries children
  Parameter.fetch($routeParams, function(parameter) {
    
    
    
    
    
    
    
    
    let drawTrendlines = function(timeseriesArray) {
      var data = new google.visualization.DataTable();
      data.addColumn('number', 'When');
      timeseriesArray.forEach(t => {
        //data.addColumn('number', t.titles[0].title);
      });
      
      let rows = [];
      timeseriesArray.forEach(t => {
        let rows = t.data.map(d => { return [d.when||d.year, d.value]; });
        console.log(rows);
      });
      //data.addRows(rows);
      
      var options = {
        hAxis: {
          title: 'Time'
        },
        vAxis: {
          title: 'vAxis.title'
        },
        colors: ['#AB0D06', '#007329'],
        trendlines: {
          0: {type: 'exponential', color: '#333', opacity: 1},
          1: {type: 'linear', color: '#111', opacity: 0.3}
        }
      };

      //var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
      //chart.draw(data, options);
    };
    
    
   
    
    
    
    
    
    
    $scope.document = parameter;
    npdcAppConfig.cardTitle = title(parameter.titles, $scope.lang) + '(' + parameter.systems.join(',') + ')';

    var filter_timeseries_ids = _.map(parameter.timeseries, function(t) {
      return t.match(/\/([-\w]+)$/)[1];
    });

    if (filter_timeseries_ids.length > 0) {
      // Fetch timeseries children
      Timeseries.array({
        "filter-id": filter_timeseries_ids.join("|"),
        fields: "*",
        limit: filter_timeseries_ids.length
      }, function(timeseries) {
        $scope.timeseries = timeseries;
        
        let i = 0;
        
        $timeout(() => {
          //  let elmt = document.getElementById('sparkline-0');
          //  let data = timeseries[0].data.map(d => d.value).filter(v => !isNaN(parseFloat(v)) && isFinite(v));
          Sparkline.drawArray(timeseries);
          google.setOnLoadCallback(drawTrendlines(timeseries));
          
          
          
        });
        
        
      });

    }

    // Fetch indicator parent
    var parameter_uri = "http:" + npolarApiConfig.base + "/indicator/parameter/" + parameter.id;

    Indicator.array({
      "filter-parameters": parameter_uri,
      fields: "*",
      limit: 1
    }, function(indicators) {
      $scope.indicator = indicators[0];
    });


  });

};

module.exports = ParameterShowController;
