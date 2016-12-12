var app = angular.module("appModule");

app.service('$calendar', function($route) {
	var today = new Date();
    var month = today.getMonth();
    var year = today.getFullYear();
    var userPillData;
	var	pillEmoji = '💊';

	function processData(data, query) {
		query = query.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    	query = query.replace(/^\./, '');           // strip a leading dot
    	var a = query.split('.');
    	for (var i = 0, n = a.length; i < n; ++i) {
        	var k = a[i];
        	if (k in data) {
	            data = data[k];
        	} else {
	            return;
        	}
    	}
    	return data;
	}

	//Using the Date prototype to assign our month names-->
	Date.prototype.getMonthNames = function() { return [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]; }
	//Getting the number of day in the month.-->
	Date.prototype.getDaysInMonth = function() {
		return new Date( this.getFullYear(), this.getMonth() + 1, 0 ).getDate();
	}
	
	Date.prototype.calendar = function() {
		var numberOfDays = this.getDaysInMonth();
		//This will be the starting day to our calendar-->
		var startingDay = new Date(this.getFullYear(), this.getMonth(), 1).getDay();
		//We will build the calendar_table variable then pass what we build back-->
		var calendarTable = '<table id="cal-content"><thead>';

		calendarTable += '<th><font color="#B42600">Sun</font></th>';
		calendarTable += '<th>Mon</th>';
		calendarTable += '<th>Tue</th>';
		calendarTable += '<th>Wed</th>';
		calendarTable += '<th>Thu</th>';
		calendarTable += '<th>Fri</th>';
		calendarTable += '<th>Sat</th></thead><tbody>'; 
		
		//Lets create blank boxes until we get to the day which actually starts the month-->
		for ( var i = 0; i < startingDay; i++ ) {
			calendarTable += '<td>&nbsp;</td>';
		}
		
		//border is a counter, initialize it with the "blank"-->
		//days at the start of the calendar-->
		//Now each time we add new date we will do a modulus-->
		//7 and check for 0 (remainder of border/7 = 0)
		//if it's zero then it's time to make new row-->
		var border = startingDay;

		//For each day in the month, insert it into the calendar-->
		for ( var id = '',  i = 1; i <= numberOfDays; i++ ) {
			if (( month == month ) && ( today.getDate() == i )) {
				id = 'id="current_day"';
			} 
			else {
				id = '';
			}
		
			calendarTable += '<td ' + id + '>' + i;
			if(userPillData != null){
				var time = processData(userPillData, '' + year +"." + (month+1) + "." + i);
				var timeInfo = new Date();
				timeInfo.setMilliseconds(time);
								
				if(time != null)
					calendarTable += '<p><a onClick="showDetail(' + "'" + timeInfo.toLocaleTimeString() +"'" + ')">' + pillEmoji + '</a></p>';
			}

			calendarTable += '</td>'; border++;
		
			if ((( border % 7 ) == 0 ) && ( i < numberOfDays )) { 
			
			//Time to make new row, if there are any days left.-->
			calendarTable += '<tr></tr>';
			}
		} 
		
		//All the days have been used up, so pad the empty days until the end of calendar-->
		while(( border++ % 7)!= 0) {
			calendarTable += '<td>&nbsp;</td>';
		}
		
		//Finish the table-->
		calendarTable += '</tbody></table>';

		//Return it-->
		return calendarTable;
	}

	this.createCalendar = function(uid){
		// https://www.daniweb.com/programming/web-development/code/217119/dynamic-calendar
		// Looks like it calculates the dates and day
		// So first, calculate the months and days
		// Then, when appending the days as table element, check whether patient had medicine.
		// (Information that patien<h1>준비중입니다....</h1>t took pills on that month
		// is prefetched before table creation, and stored in a speperate object.)
		firebase.database().ref('status/' + uid + '/').on('value', function(snapshot){
			userPillData = snapshot.val();
			actual_calendar.innerHTML = today.calendar();
			reloadCalendar();
		});
		actual_calendar = document.getElementById('calendar-wrapper');
	};

	this.getUserPillData = function() {
		return userPillData;
	}

	function reloadCalendar(){
		console.log("Reload Reached");
		newYear = document.getElementById("yearPicker").value;
		newMonth = document.getElementById("monthPicker").value;
		year = newYear;
		month = document.getElementById("monthPicker").selectedIndex;
		newDate = newMonth + ' 1, ' + newYear;
		month_menu = new Date(newDate);
		actual_calendar.innerHTML = month_menu.calendar();
	}


	this.reloadCalendar = function () {
		reloadCalendar();
	};

	   function set(path, value) {
    var schema = userPillData;  // a moving reference to internal objects within obj
    var pList = path.split('.');
    var len = pList.length;
    for(var i = 0; i < len-1; i++) {
        var elem = pList[i];
        if( !schema[elem] )
        	schema[elem] = {};
        schema = schema[elem];
    }

    schema[pList[len-1]] = value;
}

	this.postInfo = function (takenTime) {
		var queryIndex = '' + takenTime.getFullYear() + '.' + (takenTime.getMonth() + 1) + '.' + takenTime.getDate();
        var queryTime = '' + takenTime.getTime();
        var input = userPillData;
        var queryList = queryIndex.split('.');
        var len = queryList.length;

        console.log(userPillData);
        set(queryIndex, queryTime);

        firebase.database().ref('status/' +
            firebase.auth().currentUser.uid + '/').set(input);
        reloadCalendar();
	};

});