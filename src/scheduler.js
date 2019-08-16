import Moment from 'moment';

/**
 * @param {*} schedules the list of all schedules
 * @param {*} date_start start date of calendar view
 * @param {*} date_end end date of calendar view
 */
export const scheduler = function(schedules, date_start, date_end)
{
    let collection = [];

    schedules.forEach(schedule => {
        if(schedule.schedulable_type    == "App\\Models\\Maintenance"
        && !schedule.completed_state
        && schedule.frequency != null)
        {
            // Add original copy of schedule
            collection.push({
                title: '⚙️  ' + schedule.asset,
                allDay: schedule.whole_day == 1 ? true : false,
                start: new Date(schedule.date_start),
                end: new Date(schedule.date_start),
                color: '#77d46f',
                link:  'maintenance/' + schedule.schedulable_id,
                data: schedule,
                type: 'm'   
            });

            // Equation variables
            let z       = schedule.frequency;
            let y       = schedule.frequency_unit;
            let x       = {
                            start:  new Date(schedule.date_start),
                            end:    new Date(schedule.date_end)
                        };

            // Computation A
            // Difference of schedule.date_start and calendar start
            // This will determine the unit to be added to the calendar start
            let a = since(date_start, schedule.date_start, y);

            // Computation B
            // This is where the recurring count is set.
            let b = z;
            while(b < a) b = b + z;

            // let b = parseInt(z/a) * z;
            // if(b < a) b += z;

            let new_start_date  = new Date(Moment(x.start, 'YYYY-MM-DD').add(b,y));
            let new_end_date    = new Date(Moment(x.end, 'YYYY-MM-DD').add(b,y));


            // Setting the initial record
            let phantom_schedule = {
                title:  '⚙️  ' + schedule.asset,
                allDay: schedule.whole_day == 1 ? true : false,
                start:  new_start_date,
                end:    new_start_date == new_end_date ? new_end_date : new Date(Moment(new_end_date).add(1, 'day')),
                realEnd: new_end_date,
                color: '#cecece',
                link:  'maintenance/' + schedule.schedulable_id,
                data:   schedule,
                type: 'm'
            }

            // Repeat recursively until the calendar end is hit
            while(phantom_schedule.start < new Date(date_end))
            {
                collection.push(Object.assign({}, phantom_schedule));
                phantom_schedule.start      = new Date(Moment(phantom_schedule.start, 'YYYY-MM-DD').add(z,y));
                phantom_schedule.end        = new Date(Moment(phantom_schedule.end, 'YYYY-MM-DD').add(z,y));
                phantom_schedule.realEnd    = new Date(Moment(phantom_schedule.realEnd, 'YYYY-MM-DD').add(z,y));
            }
        }
        
        // Completed state has a different color
        else if(schedule.schedulable_type   == "App\\Models\\Maintenance"
                && schedule.completed_state)
        {
            collection.push({
                title:  '✔️ ' + schedule.asset,
                allDay: schedule.whole_day == 1 ? true : false,
                start:  schedule.date_start,
                end:    schedule.date_start == schedule.date_end ? schedule.date_end : new Date(Moment(schedule.date_end).add(1,'day')),
                realEnd: schedule.date_end,
                color: '#A250E5',
                link:  'maintenance/' + schedule.schedulable_id,
                data:   schedule,
                type: 'm'
            });
        }

        else if(schedule.schedulable_type == "App\\Models\\Maintenance"
                && !schedule.completed_state
                && schedule.frequency == null)
        {
            collection.push({
                title:  '⚙️ ' + schedule.asset,
                allDay: schedule.whole_day == 1 ? true : false,
                start:  schedule.date_start,
                end:    schedule.date_start == schedule.date_end ? schedule.date_end : new Date(Moment(schedule.date_end).add(1,'day')),
                realEnd: schedule.date_end,
                color: '#77d46f',
                link:  'maintenance/' + schedule.schedulable_id,
                data:   schedule,
                type: 'm'
            });
        }
                
        // Adding operation to the collection list
        else
        {
            collection.push({
                title:  '⚓  ' + schedule.asset,
                allDay: schedule.whole_day == 1 ? true : false,
                start:  schedule.date_start,
                end:    schedule.date_start == schedule.date_end ? schedule.date_end : new Date(Moment(schedule.date_end).add(1,'day')),
                realEnd: schedule.date_end,
                color: '#51c1ff',
                link:  'operation/' + schedule.schedulable_id,
                data:   schedule,
                type: 'o'
            });
        }
    });
    return collection;
}

function since(x, y, interval)
{
    let start       = new Date(x);
    let end         = new Date(y);
    let timeDiff    = (new Date(start)) - (new Date(end));

    switch (interval) {
        case 'Day':
            return timeDiff / (1000 * 60 * 60 * 24);

        case 'Week':
            return timeDiff / (1000 * 60 * 60 * 24 * 7);

        case 'Month':
            return Moment(start).diff(Moment(end), 'months', true)

        case 'Year':
            var diff = timeDiff / 1000;
            diff /= (60 * 60 * 24);
            return Math.abs(Math.round(diff/365.25));
    }
}