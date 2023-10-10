
var clockEl = $('#currentDay');
var container = $('#container');
var currentTime = dayjs();

var timeEvents;

$(function () {
  
  //if no timeEvents in local storage provide empty object otherwise get timeEvents from local
  if (localStorage.getItem('timeEvents') !== null && localStorage.getItem('timeEvents') !== '') {
    timeEvents = JSON.parse(localStorage.getItem('timeEvents'));
  } else {
    timeEvents = {};
  }
  //loop for 9-5 time block
  for (var i = 0; i < 9; i++) {
    var offset = i+9;
    var hour = dayjs().set('hour', offset).format('hA');
    
    //append full code block of timeblock 
    container.append($(`
    <div id="hour-${offset}" class="row time-block">
      <div class="col-2 col-md-1 hour text-center py-3">${hour}</div>
      <textarea class="col-8 col-md-10 description" rows="3"> </textarea>
      <button class="btn saveBtn col-2 col-md-1" aria-label="save">
        <i class="fas fa-save" aria-hidden="true"></i>
      </button>
    </div>`
    ));
    
    //dress timeblocks based on current hour
    if (offset < currentTime.hour()) {
      container.children().eq(i).addClass('past');
    } else if (offset == currentTime.hour()) {
      container.children().eq(i).addClass('present');
    } else {
      container.children().eq(i).addClass('future');
    }

    //on page reload, fill timeblocks from local if any
    $(`#hour-${offset}`).children('textarea').text(timeEvents[`hour-${offset}`]);
  }

  //localStorage.setItem('timeEvents', JSON.stringify(timeEvents));

  //on click listener event
  function saveEvent(event) {
    var btnEvent = $(event.target).parents('.time-block'); //bubble up parents filtering to time block class
    var objTimeProp = btnEvent.attr('id'); // get id (hour-#)
    var objEventValue = btnEvent.children('textarea').val(); // get textarea value

    //store object time block data
    timeEvents[objTimeProp] = objEventValue;
    localStorage.setItem('timeEvents', JSON.stringify(timeEvents));
  }
  $(this).on('click', '.saveBtn', saveEvent);

  //display current day and update dynamically
  displayCurrentDay();
  setInterval(displayCurrentDay, 1000);
});



function displayCurrentDay() {
  var today = dayjs();
  clockEl.text(today.format('dddd, MMMM DD YYYY [at] hh:mm:ss A'));
  
  //updates timeblock css everyhour if webpage is left open by user
  if (!(today.$h == currentTime.$h)) { //compare live hour to hour onload 
    container.children().eq(currentTime.$h).removeClass('present');
    container.children().eq(currentTime.$h).addClass('past');
    container.children().eq(today.$h).removeClass('future');
    container.children().eq(today.$h).addClass('present');
    currentTime = dayjs(); //load present time 
  }
}

