'use strict';

// @ngInject
let Sparkline = function(google) {
  
  this.getElement = function(i, prefix='sparkline-') {
    return document.getElementById(`${prefix}${i++}`);
  };
  
  this.draw = function(chartElmt, dataRows, opt={width: 120, height: 40, showAxisLines: false,  showValueLabels: false, labelPosition: 'left'}) {
    let data = google.visualization.arrayToDataTable(dataRows, true); // true means that the first row contains data (not labels)
    let chart = new google.visualization.ImageSparkLine(chartElmt);
    chart.draw(data, opt);
  };
  
  this.drawArray = function(arr, opt) {
    let i = 0;
    arr.map(t => {
      let data = t.data.map(d => [d.value]);
      this.draw(this.getElement(i++), data, opt);
    });
  };
  return this;
};

module.exports = Sparkline;