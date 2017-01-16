'use strict';

/**
 * @ngdoc directive
 * @name juniperApp.directive:linechart
 * @description
 * # linechart
 */
angular.module('juniperApp')
  .directive('linechart', function () {
    var controller = ['$scope', '$rootScope', function ($scope, $rootScope) {
      function initPlotChart(){
        var data = $scope.lineinfo.lineData;
        var ydirection = $scope.lineinfo.y;
        var dimensions = $scope.lineinfo.dimensions;
        var elemId = $scope.lineinfo.elemId;

        var timeFormat = d3.time.format('%Y-%m-%dT%H:%M:%S.%LZ');

        var margin = {top: 20, right: 30, bottom: 20, left: 50},
            width = 800,
            height = 300;


        var WIDTH = 800,
        HEIGHT = 300,
        MARGINS = {
          top: 20,
          right: 30,
          bottom: 20,
          left: 50
        },
        xRange = d3.scale.ordinal().rangeRoundBands([0, WIDTH - 80], 0.1).domain(data.map(function (d) {
          return timeFormat.parse(d.timestamp);
        })),
        yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0,
          d3.max(data, function (d) {
            return d[ydirection];
          })
        ]);
        // Set the values
        var x = d3.time.scale().range([0, width-80]).domain(data.map(function (d) {
          return timeFormat.parse(d.timestamp);
        }));
        var y = d3.scale.linear().range([height-MARGINS.top, 20]).domain([0,
          d3.max(data, function (d) {
            return d[ydirection];
          })
        ]);

        // Define the axes
        var xAxis = d3.svg.axis().scale(xRange)
          .tickSize(5)
          .tickSubdivide(true)
          .tickFormat(d3.time.format('%-I:%M %p'));

        var yAxis = d3.svg.axis()
          .scale(yRange)
          .tickSize(5)
          .orient('left')
          .tickSubdivide(true);


        // Define the line
        var valueline = d3.svg.line()
            .x(function(d) { return x(timeFormat.parse(d.timestamp)); })
            .y(function(d) { return y(d[ydirection]); });
            
        // Adds the svg canvas
        var svg = d3.select('#' + elemId)
            .append('g')
            .attr('transform', 
                      'translate(' + margin.left + ',' + 0 + ')');

        // Get the data
          data.forEach(function(d) {
              d.timestamp = d.timestamp;
              d[ydirection] = +d[ydirection];
          });

          // Scale the range of the data
          x.domain(d3.extent(data, function(d) { return timeFormat.parse(d.timestamp); }));
          y.domain([0, d3.max(data, function(d) { return d[ydirection]; })]);

          // Add the valueline path.
          svg.append('path')
              .attr('class', 'line')
              .attr('d', valueline(data));

          // Add the X Axis
          svg.append('g')
              .attr('class', 'x axis')
              .attr('transform', 'translate(0,' + 280 + ')')
              .call(xAxis)          
              .append('text')
              .attr('y', 40)
              .attr('x', 340)
              .attr('text-anchor', 'middle')
              .text('Time');

          // Add the Y Axis
          svg.append('g')
              .attr('class', 'y axis')
              .call(yAxis)
            .append('text')
              .attr('transform', 'rotate(-90)')
              .attr('y', 6)
              .attr('dy', '.71em')
              .style('text-anchor', 'end')
              .text(dimensions);
      }

      angular.element(document).ready(initPlotChart);
    }],

    template = '<svg width="800" id={{lineinfo.elemId}} height="330"></svg>';
 
    return {
      scope: {
          lineinfo: '=', //binding
          add: '&',
      },
      restrict: 'E',
      controller: controller,
      template: template
    };
  });
