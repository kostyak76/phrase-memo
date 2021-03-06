"use strict";

var log = function () {
};

var pAction = angular.module('pAction', []);

pAction.service('Logger', ['$interval', function ($interval) {
    var that = this;
    that.logs = [];
    var timeToShow = 2000;
    var clearFirstMessage = function () {
        that.logs.shift();
    };
    this.log = function (message) {
        that.logs.push(message);
        $interval(clearFirstMessage, timeToShow);
    };
}]);

pAction.factory('postman', ['$timeout', function ($timeout) {
    /*wraps $rootScope.$apply over original postman function*/
    return function (name) {
        var origResponse = postman(name);
        var origSend = origResponse.send;
        origResponse.send = function (message) {
            var origSendResponse = origSend.call(message);
            var origThenFunc = origSendResponse.then;
            origSendResponse.then = function (cb) {
                origThenFunc(function (response) {
                    cb(response);
                    $timeout(function () {
                    });
                });
            };
            return origSendResponse;
        };
        return origResponse;
    };
}]);

pAction.controller('mainController', ['postman', function (postman) {
    var that = this;
    that.isReady = false;
    postman('popShown').send().then(function () {
        that.isReady = true;
    });
}]);

pAction.controller('messageController', ['Logger', function (logger) {
    this.logs = logger.logs;
}]);
