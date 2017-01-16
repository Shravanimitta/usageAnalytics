'use strict';

/**
 * @ngdoc directive
 * @name juniperApp.directive:stackedBarChart
 * @description
 * # stackedBarChart
 */
angular.module('juniperApp')
  .directive('stackedbarchart', function () {
    var controller = ['$scope', function ($scope) {
      function initPlotChart(){
        $('#'+ $scope.stackedbarinfo.elemId).html('');

        var barData = $scope.stackedbarinfo.barData;
        var ydirection = $scope.stackedbarinfo.y;
        var dimensions = $scope.stackedbarinfo.dimensions;
        var elemId = $scope.stackedbarinfo.elemId;
        var itemArr = $scope.stackedbarinfo.itemArr;
        var colors = $scope.stackedbarinfo.colors;

      var margin = {top: 20, right: 120, bottom: 20, left: 50};

      var width = 800 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;

      var svg = d3.select('#' + elemId)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var parse = d3.time.format('%Y-%m-%dT%H:%M:%S.%LZ').parse;


      // Transpose the data into layers
      var dataset = d3.layout.stack()(itemArr.map(function(item) {
        return barData.map(function(d) {
          return {x: parse(d.timestamp), y: +d[ydirection][item]};
        });
      }));
      // Set x, y and colors
      var x = d3.scale.ordinal().domain(dataset[0].map(function(d) { return d.x; }))
        .rangeRoundBands([10, width-10], 0.02);

      var y = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) {  return d3.max(d, function(d) { return d.y0 + d.y; });  })])
        .range([height, 0]);


      // Define and draw axes
      var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .ticks(5)
        .tickSize(5)
        .tickFormat( function(d) { return d; } );

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .tickSize(5)
        .tickFormat(d3.time.format('%-I:%M %p'));

      svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text(dimensions);

      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);


      // Create groups for each series, rects for each segment 
      var groups = svg.selectAll('g.cost')
        .data(dataset)
        .enter().append('g')
        .attr('class', 'cost')
        .style('fill', function(d, i) { return colors[i]; });

      groups.selectAll('rect')
        .data(function(d) { return d; })
        .enter()
        .append('rect')
        .attr('x', function(d) { return x(d.x); })
        .attr('y', function(d) { return y(d.y0 + d.y); })
        .attr('height', function(d) { return y(d.y0) - y(d.y0 + d.y); })
        .attr('width', x.rangeBand())
        .on('mouseover', function() { tooltip.style('display', 'block'); })
        .on('mouseout', function() { tooltip.style('display', 'none'); })
        .on('mousemove', function(d) {
          var xPosition = d3.mouse(this)[0] - 15;
          var yPosition = d3.mouse(this)[1] - 25;
          tooltip.attr('transform', 'translate(' + xPosition + ',' + yPosition + ')');
          tooltip.select('text').text(d.y);
        });


      // Draw legend
      var legend = svg.selectAll('.legend')
        .data(colors)
        .enter().append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) { return 'translate(30,' + i * 19 + ')'; });
       
      legend.append('rect')
        .attr('x', width - 18)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', function(d, i) {return colors.slice().reverse()[i];});
       
      legend.append('text')
        .attr('x', width + 5)
        .attr('y', 9)
        .attr('dy', '.35em')
        .style('text-anchor', 'start')
        .text(function(d, i) { 
          switch (i) {
            case 0: return itemArr[2];
            case 1: return itemArr[1];
            case 2: return itemArr[0];
          }
        });

      // Prep the tooltip bits, initial display is hidden
      var tooltip = svg.append('g')
        .attr('class', 'tooltip')
        .attr('x', width - 18)
        .attr('width', 50)
        .attr('height', 50)
        .style('display', 'block');
          
      tooltip.append('rect')
        .attr('width', 30)
        .attr('height', 20)
        .attr('fill', 'white')
        .style('opacity', 0.5);

      tooltip.append('text')
        .attr('x', 15)
        .attr('dy', '1.2em')
        .style('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold');

      }
      angular.element(document).ready(initPlotChart);

    }],

    template = '<svg width="900" id={{stackedbarinfo.elemId}} height="300"></svg>';
 
    return {
      scope: {
          stackedbarinfo: '=', //binding
          add: '&',
      },
      restrict: 'E',
      controller: controller,
      template: template
    };
  });
