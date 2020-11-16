module.exports = function WaiterApp(pool) {

    async function addWaiterInfo(name, days) {

        if (name && days) {
            let nameEntered = await pool.query('SELECT waiter_name FROM working_days WHERE waiter_name = $1', [name]);
            let daysWorking = await pool.query('SELECT days_working FROM working_days WHERE days_working = $1', [days]);

            let namesId = await getNameId(name);
            let daysId = await getDaysId(days);

            if (nameEntered.rowCount === 0 && daysWorking.rowCount === 0) {
                await pool.query('INSERT INTO working_days waiter_name, days_working VALUES ($1, $2)', [namesId, daysId]);
            } else {
                await pool.query('UPDATE working_days waiter_name SET days_working = days_working + 1 WHERE waiter_name = $1', [name, days]);
            }
        }
    }

    async function getNameId(name){

        let namesId = await pool.query('SELECT id FROM waiter_name WHERE waiter_name = $1', [name]);
        
        if(namesId.rowCount === 0){
            return await pool.query('INSERT INTO waiter_names waiter_name VALES ($1)', [namesId]);
        }
    }

    async function getDaysId(days){
        let daysId = await pool.query('SELECT id FROM days_working WHERE days_working = $1', [days]);
        return daysId;
    }

    async function storedDetails() {
        let waiterInfo = await pool.query('SELECT * FROM working_days');
        return waiterInfo.rows;
    }

    return {
        addWaiterInfo,
        storedDetails
    }
}