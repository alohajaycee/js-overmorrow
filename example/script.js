
var calendar = $('#calendar').fullCalendar({
	editable:true,
	header:{
		left:'prev,next today',
		center:'title',
		right:'month,agendaWeek,agendaDay'
	},
	events: overmorrow.test().map((schedule) =>{
		return {
			...schedule,
			start: schedule.date_start,
			end: schedule.date_stop
		}
	}),
	selectable:true,
	selectHelper:true,

	editable:false,
});