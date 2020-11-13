module.exports = function WaiterApp(pool) {

    async function addWaiterInfo(name) {

        if (name) {
            let nameEntered = await pool.query('SELECT waiter_name FROM working_days WHERE waiter_name = $1', [name]);

            // TO DO : get both name id and days id
            // TO DO : if name id and days id --- then insert
            let namesId = await pool.query('SELECT id FROM waiter_name');
            let daysId = await pool.query('SELECT id FROM days_working');

            if (nameEntered.rowCount === 0 && namesId && daysId) {
                await pool.query('INSERT INTO working_days waiter_name, days_working VALUES ($1, $2)', [name]);
            } else {
                await pool.query('UPDATE working_days waiter_name SET days_working = days_working + 1 WHERE waiter_name = $1', [name])
            }
        }
    }

    async function displayInfo() {
        let waiterInfo = await pool.query('SELECT waiter_name, days_working FROM working_days');
        return waiterInfo.rows;
    }

    return {
        addWaiterInfo,
        displayInfo
    }
}