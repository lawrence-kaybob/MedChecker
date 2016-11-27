// Initialize Firebase
var config = {
	apiKey: "AIzaSyAB_UzKpCnO9eaSUx43Fhr7ph98iRJD1mU",
	authDomain: "medchecker-6669b.firebaseapp.com",
	databaseURL: "https://medchecker-6669b.firebaseio.com",
	storageBucket: "medchecker-6669b.appspot.com",
	messagingSenderId: "890593433485"
};
firebase.initializeApp(config);

var app = angular.module("appModule");

// Individual service for firebase authentication
// Should be included
app.service('$auth', function($route, $calendar) {
	// 최소한의 정보만 담을 객체
	// firebase 객체를 사용하지 않도록 하기 위함임!
	var currentUser= {
		greetingMessage: "로그인 해주세요",
		displayName: null,
		photoURL: "images/profile_placeholder.png",
		email: null,
		uid: null,
		patientsNo : null,
		pillsInfo : null,
		age : null,
		birthday : null,
	};
	var pillsData;

	this.getCurrentUser = function (){
		return currentUser;
	};

	// Initailzation Function
	// Called in $scope controller
	this.init = function () {
		firebase.auth().getRedirectResult().then(function (result) {
			var user = result.user;
		}).catch(function (error) { //로그인 실패 시나리오
			var errorCode = error.code;
			var errorMessage = error.message;
			var email = error.email;
			var credential = error.credential;

			alert("비정상적인 접근입니다.\n다시 로그인해주세요.");
			console.error(error);

		});
	};

	this.setScopeOnAuthStateChange = function ($scope) {
		firebase.auth().onAuthStateChanged(function (user) {
			if (user) {
				console.log('State Change Checked');

				currentUser = {
	  		  		greetingMessage : '반갑습니다 ' + user.displayName + '님',
	  		  		displayName : user.displayName,
	  		  		email : user.email,
	  		  		photoURL : user.photoURL,
	  		  		patientsNo : null,
	  		  		pillsInfo : null,
	  		  		age : null,
	  		  		birthday : null,

				}

				// Firebase Database is a bit slow
				// So $route.reload() and angular module allocation is better
				// to done after fetching from database is complete

		  		firebase.database().ref(
		       	 'user_info/' + firebase.auth().currentUser.uid + '/').once('value')
		  		  .then(function(snapshot) {
			        userInfo = snapshot.val();

	  		  		currentUser.patientsNo = userInfo.patientsNo;
			  		currentUser.pillsInfo = userInfo.pillsInfo;
	  		  		currentUser.age = userInfo.age;
		  		  	currentUser.birthday = userInfo.birthday;

		  		  	$scope.currentUser = currentUser;
		  		  	$route.reload();
	  		  	});

    			$calendar.createCalendar();
				$scope.nextState = "로그아웃";
			}
			else {
				console.log('State Change Checked');
				$scope.currentUser = {
					greetingMessage: "로그인 해주세요",
					displayName: null,
					photoURL: "images/profile_placeholder.png",
					email: null,
					uid: null,
					patientsNo : null,
					pillsInfo : null,
					age : null,
					birthday : null,
				}
				$scope.nextState = "로그인";

				$route.reload();
			}

		});

	console.log("Firebase Loaded");
	};
});