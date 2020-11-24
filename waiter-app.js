module.exports = function WaiterApp(pool) {

    async function addWaiterInfo(name, days) {
        name = name.toUpperCase().charAt(0) + name.slice(1);

        if (name && days) {
            let namesId = await getNameId(name);

            for (const eachDay of days) {

                let daysId = await getDaysId(eachDay);
                await pool.query('INSERT INTO working_days (waiter_id, days_working) VALUES ($1, $2)', [namesId, daysId]);

            }
        }
    }

    async function getNameId(name) {

        let nameEntered = await pool.query('SELECT waiter_name FROM waiter_names WHERE waiter_name = $1', [name]);

        if (nameEntered.rowCount === 0) {
            await pool.query('INSERT INTO waiter_names (waiter_name) VALUES ($1)', [name]);
        }

        var namesId = await pool.query('SELECT id FROM waiter_names WHERE waiter_name = $1', [name]);
        return namesId.rows[0]['id'];
    }

    async function getDaysId(days) {
        var daysId = await pool.query('SELECT id FROM days_of_work WHERE day_working = $1', [days]);

        return daysId.rows[0]['id'];
    }

    async function getDays() {
        let days = await pool.query('SELECT * FROM days_of_work');
        // console.log(days.rows);
        return days.rows;
    }

    async function getName() {
        let names = await pool.query('SELECT waiter_name FROM waiter_names');
        return names.rows;
    }

    async function joinTables() {
        let tableData = await pool.query(`SELECT DISTINCT waiter_names.id AS waiter_id, waiter_name, working_days.id AS 
                                            day_id, day_working FROM working_days JOIN waiter_names ON 
                                            working_days.waiter_id = waiter_names.id JOIN days_of_work ON 
                                            working_days.days_working = days_of_work.id`);
        return tableData.rows;
    }

    async function groupWaitersByDay() {
        let waiterDays = await joinTables();
        let dayOfTheWeek = await getDays();

        let daysList = [];

        for (let i = 0; i < dayOfTheWeek.length; i++) {
            const eachDay = dayOfTheWeek[i];
            let waiterInfo = {
                shift: eachDay.day_working,
                waiter: []
            }
            daysList.push(waiterInfo);
        }

        for (const list of daysList) {
            for (const data of waiterDays) {

                if (list.shift === data.day_working) {
                    list.waiter.push(data.waiter_name);
                }
            }
        }
        return daysList;
    }

    // work on colors
    async function colors(day) {
        if (day.length < 3) {
            return 'makeBooking';
        } else if (day.length > 3) {
            return 'fullyBooked'
        }
    }

    return {
        addWaiterInfo,
        getDaysId,
        getNameId,
        getDays,
        getName,
        joinTables,
        groupWaitersByDay
    }
}