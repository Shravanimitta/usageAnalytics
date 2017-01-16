'use strict';

/**
 * @ngdoc directive
 * @name juniperApp.directive:barChart
 * @description
 * # barChart
 */
angular.module('juniperApp')
  .directive('barchart', function () {
    var controller = ['$scope', '$rootScope', function ($scope, $rootScope) {
      $rootScope.$on('datachange', function(){
        initPlotChart();
      });
      function initPlotChart(){
        var barData = $scope.barinfo.barData;
        barData.sort(function(a,b) { return (new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()); });
        var y = $scope.barinfo.y;
        var dimensions = $scope.barinfo.dimensions;
        var elemId = $scope.barinfo.elemId;
        var color = $scope.barinfo.color;

        var timeFormat = d3.time.format('%Y-%m-%dT%H:%M:%S.%LZ');

        var vis = d3.select('#' + elemId),
        WIDTH = 800,
        HEIGHT = 300,
        MARGINS = {
          top: 20,
          right: 30,
          bottom: 20,
          left: 50
        },
        xRange = d3.scale.ordinal().rangeRoundBands([MARGINS.left, WIDTH - MARGINS.right], 0.1).domain(barData.map(function (d) {
          return timeFormat.parse(d.timestamp);
        })),


        yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0,
          d3.max(barData, function (d) {
            return d[y];
          })
        ]),

        xAxis = d3.svg.axis()
          .scale(xRange)
          .tickSize(5)
          .tickSubdivide(true)
          .tickFormat(d3.time.format('%-I:%M %p')),

        yAxis = d3.svg.axis()
          .scale(yRange)
          .tickSize(5)
          .orient('left')
          .tickSubdivide(true);

        vis.selectAll('.axis').remove();
        vis.selectAll('.tooltip').remove();

        vis.append('svg:g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
          .call(xAxis)
          .append('text')
          .attr('y', 40)
          .attr('x', 380)
          .attr('text-anchor', 'middle')
          .text('Time');

        vis.append('svg:g')
          .attr('class', 'y axis')
          .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
          .call(yAxis)
          .append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 6)
          .attr('dy', '.71em')
          .style('text-anchor', 'end')
          .text(dimensions);  

        vis.selectAll('rect').remove();

        vis.selectAll('rect')
          .data(barData)
          .enter()
          .append('rect')
          .attr('class', 'rect')
          .attr('x', function (d) {
            return xRange(timeFormat.parse(d.timestamp));
          })
          .attr('y', function (d) {
            return yRange(d[y]);
          })
          .attr('width', xRange.rangeBand())
          .attr('height', function (d) {
            return ((HEIGHT - MARGINS.bottom) - yRange(d[y]));
          })
          .on('mouseover', function() { tooltip.style('display', 'block'); })
          .on('mouseout', function() { tooltip.style('display', 'none'); })
          .on('mousemove', function(d) {
            var xPosition = d3.mouse(this)[0] - 15;
            var yPosition = d3.mouse(this)[1] - 25;
            tooltip.attr('transform', 'translate(' + xPosition + ',' + yPosition + ')');
            tooltip.select('text').text(d[y]);
          })
          .transition().duration(300)
          .attr('fill', color);
          

        // Prep the tooltip bits, initial display is hidden
        var tooltip = vis.append('svg:g')
          .attr('class', 'tooltip')
          .attr('x', WIDTH - 18)
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

    template = '<svg width="800" id={{barinfo.elemId}} height="330"></svg>';
 
    return {
      scope: {
          barinfo: '=', //binding
          add: '&',
      },
      restrict: 'E',
      controller: controller,
      template: template
    };
  });
