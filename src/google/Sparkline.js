'use strict';

// @ngInject
let Sparkline = function(google, $timeout) {
  
  // todo fx let options
  
  this.getElement = function(i=0, prefix='sparkline-') {
    return document.getElementById(`${prefix}${i}`);
  };
  
  this.draw = function(dataRows, opt={width: 120, height: 40, showAxisLines: true,  showValueLabels: true, labelPosition: 'left'}, chartElmt=this.getElement()) {
    let data = google.visualization.arrayToDataTable(dataRows, true); // true means that the first row contains data (not labels)
    let chart = new google.visualization.ImageSparkLine(chartElmt);
    chart.draw(data, opt);

  };
  
  this.drawArray = function(arr=[], opt=null) {
    let i = 0;
    arr.map(t => {
      if (t.data && t.data.length > 0) {
        let data = t.data.map(d => [d.value||null]);
        this.draw(data, opt, this.getElement(i));
      }
      i++;

    });
  };
  return this;
};

module.exports = Sparkline;