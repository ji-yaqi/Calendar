var currentMonth = new Month(2017, 10);
document.getElementById("next_month_btn").addEventListener("click", function(event){
  currentMonth = currentMonth.nextMonth();
  updateCalendar();
  displayEvent();
}, false);

document.getElementById("prev_month_btn").addEventListener("click", function(event){
  currentMonth = currentMonth.prevMonth();
  updateCalendar();
  displayEvent();
}, false);



function displayEvent() {
  var month = currentMonth.month;
  var year = currentMonth.year;
  var dataString = "month=" + encodeURIComponent(month) + "&year=" + encodeURIComponent(year);
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", "event_list.php", true);
  xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xmlHttp.addEventListener("load", function(event){
    var jsonData = JSON.parse(event.target.responseText);
    if(jsonData.success){
      //able to get events from php
      var all_events = jsonData.all_events;
      var numOfEvents = all_events.length;
      if (numOfEvents !== 0) {
        all_events.forEach(function(new_event){
          var newEvent=new_event;
          var event_id = newEvent.event_id;
          var title = newEvent.title;
          var minute = newEvent.minute;
          var hour = newEvent.hour;
          var day = newEvent.day;
          var day_id = "day"+day;
          var tag = newEvent.tag;
          var color;
          switch (tag){
            case "B":
              color = "info";
              break;
            case "F":
              color = "primary";
              break;
            case "S":
              color = "success";
              break;
            case "N":
              color = "secondary";
              break;
            default:
              break;
          }
          var event_content = "<div class='events_display'><div class='btn-group'>";
          event_content += "<button type='button' class='btn btn-"+ color +"' id='event"+event_id+"'>"+title+"</button>";
          event_content += "<button type='button' class='btn btn-"+ color + " dropdown-toggle dropdown-toggle-split' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><span class='sr-only'>Toggle Dropdown</span></button>";
          event_content += "<div class='dropdown-menu'><a class='dropdown-item'><button id='edit"+event_id+"' onClick='edit_event("+event_id+")'>Edit</button><div class='edit_input'><input type='text' size='15' name='title' id='e_title" + event_id + "' placeholder='title' value='" + title + "' required/><input type='number' max='31' min='1' size='10' id='e_day"+ event_id + "' name='day' value='"+ day+ "' placeholder='day' required/><input type='number' max='24' min='0' size='10' name='hour' id='e_hour"+event_id+"' value='"+hour+"' placeholder='hour' required/><input type='number' max='59' min='0' size='10' name='minute' id='e_minute"+event_id+"' value='"+minute+ "' placeholder='minute' required/></div></a>";
          event_content += "<a class='dropdown-item'><button id='delete"+event_id+"' onClick='delete_event("+event_id+")'>Delete</button></a><div class='dropdown-divider'></div>";
          event_content += "<a class='dropdown-item'>Event Time "+hour+" : "+minute+" </a>";
          event_content += "</div></div></div>";
          if (document.getElementById(day_id)){
            document.getElementById(day_id).innerHTML += event_content;
          }
        });
      }
    }
  }, false);
  xmlHttp.send(dataString);
}


function updateCalendar(){
  document.getElementById("main_calendar").innerHTML = "";
  var calendar_content = "<table class='table table-bordered'><thead class='thead-inverse'><tr><th scope='col'>Monday</th><th scope='col'>Tuesday</th><th scope='col'>Wednesday</th><th scope='col'>Thursday</th><th scope='col'>Friday</th><th scope='col'>Saturday</th><th scope='col'>Sunday</th></tr></thead>";
  var month_name;
  switch (currentMonth.month){
    case 0:
      month_name = "January";
      break;
    case 1:
      month_name = "February";
      break;
    case 2:
      month_name = "March";
      break;
    case 3:
      month_name = "April";
      break;
    case 4:
      month_name = "May";
      break;
    case 5:
      month_name = "June";
      break;
    case 6:
      month_name = "July";
      break;
    case 7:
      month_name = "August";
      break;
    case 8:
      month_name = "September";
      break;
    case 9:
      month_name = "October";
      break;
    case 10:
      month_name = "November";
      break;
    case 11:
      month_name = "December";
      break;
  }
  $("#month_name").html(month_name);
  $("#year").html(currentMonth.year);
  calendar_content += "<tbody>";
  var weeks = currentMonth.getWeeks();
  for(var w in weeks){
    var days = weeks[w].getDates();
    var week = "";
    week += "<tr>";
    var day;
    for(var d in days){
      if (days[d].getMonth() == currentMonth.month){
        day = parseInt(days[d].toISOString().substring(8,10));
        week += "<td id='day"+day+"'>"+day+"</td>";
      } else {
        day = "";
        week += "<td>"+day+"</td>";
      }
    }
    week +="</tr>";
    calendar_content += week;
  }
  calendar_content += "</tbody></table>";
  $("#main_calendar").append(calendar_content);
}
