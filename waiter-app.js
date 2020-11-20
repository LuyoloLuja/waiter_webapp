module.exports = function WaiterApp(pool) {

    async function addWaiterInfo(name, days) {

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
        let days = await pool.query('SELECT day_working FROM days_of_work');
        console.log(days.rows);
        // return days.rows;
    }

    async function getName(){
        let names = await pool.query('SELECT waiter_name FROM waiter_names');
        console.log(names.rows);
        // return names.rows;
    }
    // async function storedDetails() {
    //     let waiterInfo = await pool.query('SELECT * FROM working_days');
    //     return waiterInfo.rows;
    // }

    // async function joinTables(){
    //     await pool.query(`SELECT waiter_name FROM waiter_names JOIN days_of_work ON waiter_names.id = days_of_work.id JOIN 
    //                         working_days ON working_days = days_of_work.id`)
    // }

    return {
        addWaiterInfo,
        // storedDetails,
        getDaysId,
        getNameId,
        getDays,
        getName
    }
}