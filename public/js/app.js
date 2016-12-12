/*
* Javascirpt for MedChecker Service
*/


var app = angular.module("appModule", ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: 'main.html'
        })
        .when("/status", {
            templateUrl: function() {
                if(firebase.auth().currentUser)
                    return 'status.html';
                else
                    return '401.html';
            },
            controller: 'calController'
        })
        .when("/admin", {
            templateUrl: 'admin.html',
            controller: 'adminController'
        })
        .when("/help", {
            templateUrl: 'help.html'
        })
        .when("/401", {
            templateUrl: '401.html'
        })
});

app.controller('AppController', function ($scope, $auth, $route) {
	$scope.toggleAuth = function() {
        if (!firebase.auth().currentUser) {
            // Firebase FB Login Provider로 시작
            // 팝업창 없이 현화면에서 redirect
            var provider = new firebase.auth.FacebookAuthProvider();
            firebase.auth().signInWithRedirect(provider).then(function () {
              
            });
        }
        else {// 로그아웃
        	alert("로그아웃 되었습니다!");
            firebase.auth().signOut();
        }
	};


	$auth.init($scope);
	console.log("app.js Loaded");
	$auth.setScopeOnAuthStateChange($scope);
});

app.controller('calController', function($scope, $auth, $route, $calendar) {
    $scope.currentUser = $auth.getCurrentUser();
    $scope.showDetail = function(year, month, day) {
        $scope.detailYear = year;
        $scope.detailMonth = month;
        $scope.detailDay = day;
        console.log($calendar.userPillData);
    };

    $scope.postInfo = function() {
        $calendar.postInfo($scope.takenTime);
    };

    $scope.reloadCalendar = $calendar.reloadCalendar;
    $scope.takenTime = new Date();

    document.getElementById("yearPicker").value = $scope.takenTime.getFullYear();
    document.getElementById("monthPicker").selectedIndex = $scope.takenTime.getMonth();

    if(firebase.auth().currentUser)
        $calendar.createCalendar(firebase.auth().currentUser.uid);
});

app.controller('adminController', function($scope, $calendar, $route) {
    $scope.patients = [
        {displayName : "로딩중..."}
    ];
    function getPatients() {

    }

    $scope.registerPatient = function() {

    };

    $scope.viewPatient = function() {
        var index = document.getElementById("patient-picker").selectedIndex;
        $calendar.createCalendar($scope.patients[index].uid);
    };

    firebase.database().ref('user_info').on('value', function(snapshot) {
        // console.log(snapshot.val());
        console.log("Callback Reached");
        $scope.patients = snapshot.val();
        $scope.patients = $.map($scope.patients, function(value, index){
            return [value];
        });
        console.log($scope.patients);
        angular.element('#admin-content').css({visibility : 'visible'});
    });

    firebase.database().ref('admin').on('value', function(){
        angular.element('#admin-loader').fadeOut(100);
        var today = new Date();
        document.getElementById("yearPicker").value = today.getFullYear();
        document.getElementById("monthPicker").selectedIndex = today.getMonth();
        $scope.viewPatient();
    });
});