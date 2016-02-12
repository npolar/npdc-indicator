'use strict';

// @ngInject
let Sparkline = function(google, $timeout) {

  // todo fx let options
  const DEFAULTS = {
    width: '100%', height: '100%', showAxisLines: true,  showValueLabels: true, labelPosition: 'left'
  };

  this.getElement = function(i=0, prefix='sparkline-') {
    return document.getElementById(`${prefix}${i}`);
  };

  this.draw = function(dataRows, opt = DEFAULTS, chartElmt=this.getElement()) {
    let data = google.visualization.arrayToDataTable(dataRows, true); // true means that the first row contains data (not labels)
    let chart = new google.visualization.ImageSparkLine(chartElmt);
    chart.draw(data, opt);

  };

  this.drawArray = function(arr=[], opt = null) {
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
