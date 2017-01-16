'use strict';

/**
 * @ngdoc function
 * @name juniperApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the juniperApp
 */
angular.module('juniperApp')
  .controller('MainCtrl', function ($scope, $rootScope) {

    angular.element(document).ready(function () {
      angular.element('#bar-btn').triggerHandler('click');
    });

      var self = this;

      //get yesterday
      Date.prototype.prevDay = function(){
        var currentDate = this.getDate();
        return new Date(this.setDate(currentDate - 1));
      };

      // date and time picker
      self.picker1 = {
          date: new Date().prevDay()
      };

      self.picker2 = {
          date: new Date()
      };

      self.openCalendar = function(e, picker) {
          self[picker].open = true;
      };

      //generate random integer in a range
      function generateRandom(max, min){
        return parseInt((Math.random() * (max-min) + min));
      }

      // generate random decimal in a range
      function generateDecimalRandom(max, min){
        return parseFloat((Math.random() * (max-min) + min)).toFixed(2);
      }

      // variable that holds the self.dataset to be plotted
      self.dataSet = [];

      // mock the response using jquery mockjax
      $.mockjax({
        url: /^\/server_stat\/([\d]+)\/from\/([\d]+)\/to\/([\d]+)$/,
       // url: '/server_stat/',
        urlParams: ['serverID', 'startTime', 'endTime'],
        responseTime: 750,
        response:function(settings) {
          this.responseText =
            { 'status': 'success',
              header : 
              { target_name: 'server'+settings.urlParams.serverID, 
                id:settings.urlParams.serverID,
                time_range: {
                  start: new Date(parseInt(settings.urlParams.startTime)).toISOString(),
                  end: new Date(parseInt(settings.urlParams.endTime)).toISOString(),
                },
                recordCount: 12
              },
              data : self.dataSet
            };
        }
      });

      function updateDataSet(fromTime, toTime){ 
        //clear self.dataset on each request  
        self.dataSet = [];
        let increment = (toTime - fromTime)/12;
        let incrementer = fromTime;

        //divide the range into 12 almost equal parts
        while(incrementer <= toTime){
          incrementer += increment; 
          self.dataSet.push({
            timestamp : new Date(incrementer).toISOString(),
            memory_usage: generateRandom(0, 50),
            memory_available: generateRandom(0, 200),
            cpu_usage: generateDecimalRandom(0, 1.1),
            network_throughput: {in: 1, out:2},
            network_packet: {in: 4, out:6},
            errors: {system: generateRandom(0,10), sensor: generateRandom(0,10), component: generateRandom(0,3)}
          });
        }
      }

      //simulate random response
      self.getRandomResponse = function(){
        $('#alert').hide();
        let fromTime = self.picker1.date.getTime();
        let toTime = self.picker2.date.getTime();
        let id = parseInt(Math.random() * 100);

        if(fromTime > toTime){
          $('#alert').show();
          $('#chart-container').hide();
        }
        else{
          $('#alert').hide();
          $('#chart-container').show();
        }
        updateDataSet(fromTime, toTime);
        self.asyncCall(id, fromTime, toTime);
        $rootScope.$emit('datachange');
      };

      self.asyncCall = function(id, fromTime, toTime) {
          $.getJSON('/server_stat/' + id + '/from/' + fromTime + '/to/' + toTime, function(response) {
          if ( response.status === 'success') {
            // onsuccess cofigure values for the chart component
            self.barinfomemusg = {
              barData: response.data, 
              y: 'memory_usage', 
              dimensions: 'in KBs', 
              elemId:'memoryUsageChart',
              color: '#72C4F0'
            };
            self.lineinfomemusg = {
              lineData: response.data, 
              y: 'memory_usage', 
              dimensions: 'in KBs', 
              elemId:'memoryUsageLineChart',
              color: '#72C4F0'
            };

            self.barinfomemavl = {
              barData: response.data, 
              y: 'memory_available', 
              dimensions: 'in KBs', 
              elemId:'memoryAvailableChart',
              color: '#72C4F0'
            };

            self.lineinfomemavl = {
              lineData: response.data, 
              y: 'memory_available', 
              dimensions: 'in KBs', 
              elemId:'memoryAvailableLineChart',
              color: '#72C4F0'
            };
            self.barinfocpu = {
              barData: response.data, 
              y: 'cpu_usage', 
              dimensions: 'CPU %', 
              elemId:'cpuUsageChart',
              color: '#72C4F0'
            };
            self.lineinfocpu = {
              lineData: response.data, 
              y: 'cpu_usage', 
              dimensions: 'CPU %', 
              elemId:'cpuUsageLineChart',
              color: '#72C4F0'
            };
            self.stackedbarinfoerr = { 
              barData   : response.data, 
              y         : 'errors', 
              dimensions: 'errors', 
              elemId    : 'errorsChart', 
              itemArr   : ['system', 'sensor', 'component'],
              colors    : ['#3B58A6', '#72C4F0', '#72AFDE' ] 
            };
            $scope.$digest();
          } else {
            $('#alert').show();
          }
        });
      };
    $('#alert').hide();
    angular.element(document).ready(self.getRandomResponse);
    setInterval(function(){
      self.getRandomResponse();
    }, 10000);
});
