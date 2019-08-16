
$('#calendar').fullCalendar({
	editable:true,
	header:{
		left:'prev,next today',
		center:'title',
		right:'month,agendaWeek,agendaDay'
	},
	events: function(start, end, timezone, callback) {
		callback(overmorrow.test(start, end).map((schedule) =>{
			return {
				...schedule,
				start: schedule.date_start,
				end: schedule.date_stop
			}
		}));
	},
});