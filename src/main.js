const overmorrow = {
    
    test: (start =  "07-28-2019", end = "09-07-2019") => {
        let schedules = [
            {
                "title": "Every 1 day",
                "date_start": moment(),
                "date_stop":  moment(),
                "frequency_unit": "days",
                "frequency": 1
            },
            {
                "title": "Every 2 weeks",
                "date_start": moment(),
                "date_stop":  moment(),
                "frequency_unit": "weeks",
                "frequency": 2
            },
            {
                "title": "Every 3 months",
                "date_start": moment(),
                "date_stop":  moment(),
                "frequency_unit": "months",
                "frequency": 3
            },
            {
                "title": "Every 4 years",
                "date_start": moment(),
                "date_stop":  moment(),
                "frequency_unit": "years",
                "frequency": 4
            },
        ];
        
        let collection = overmorrow.abyss(schedules, start, end);

        return collection;
    },

    abyss: (schedules, date_start, date_stop) => {

        let _date_start     = moment(new Date(date_start));
        let _date_stop      = moment(new Date(date_stop));
        let collection      = new Array();
        
        schedules.forEach(schedule => {
            
            let schedule_date_start = new Date(schedule.date_start);
            let schedule_date_stop = new Date(schedule.date_stop);

            // Frequency of the recurring event. i.e: days, weeks, months, years
            let frequency       = schedule.frequency;

            // Unit of frequency of recurring event. i.e. 4 days, 3 weeks, 2 months, 1 year
            let frequency_unit  = schedule.frequency_unit;

            let _schedule       = {
                start:  moment(schedule_date_start),
                stop:   moment(schedule_date_stop)
            };

            let _ago = moment(_date_start).diff(schedule_date_start, frequency_unit, true)

            let recurred = frequency;
          
            while(recurred < _ago) recurred = recurred + frequency;
            
            // this schedule doesn't really exist but can be seen in the future possible occurence
            let phantom_schedule = {
                ...schedule,
                date_start: moment(_schedule.start),
                date_stop: moment(_schedule.stop)
            }
            
            while(moment(phantom_schedule.date_start).isSameOrBefore(_date_stop))
            {
                collection.push(Object.assign({},phantom_schedule));

                phantom_schedule.date_start  = moment(phantom_schedule.date_start).add(frequency, frequency_unit);

                phantom_schedule.date_stop   = moment(phantom_schedule.date_stop).add(frequency, frequency_unit);
            }
        });

        return collection;
    }
}