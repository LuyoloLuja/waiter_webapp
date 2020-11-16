module.exports = function WaiterApp(pool) {

    async function addWaiterInfo(name, days) {

        if (name && days) {
            // let nameEntered = await pool.query('SELECT waiter_name FROM working_days WHERE waiter_name = $1', [name]);
            // let daysWorking = await pool.query('SELECT days_working FROM working_days WHERE days_working = $1', [days]);
            let namesId = await getNameId(name);

            for (const eachDay of days) {
                console.log(eachDay);
                let daysId = await getDaysId(eachDay);
                console.log(daysId);
                await pool.query('INSERT INTO working_days (waiter_name, days_working) VALUES ($1, $2)', [namesId, daysId]);

                // return eachDay;
            }

            // let daysId = await getDaysId(days);

            // if (namesId.rowCount === 0 && daysId.rowCount === 0) {
            // } else {
            // await pool.query('UPDATE working_days waiter_name SET days_working = days_working + 1 WHERE waiter_name = $1', [name, daysWorking]);
            // }
        }
    }

    async function getNameId(name) {

        let nameEntered = await pool.query('SELECT waiter_name FROM waiter_names WHERE waiter_name = $1', [name]);

        if (nameEntered.rowCount === 0) {
            await pool.query('INSERT INTO waiter_names (waiter_name) VALUES ($1)', [name]);
        }
        var namesId = await pool.query('SELECT id FROM waiter_names WHERE waiter_name = $1', [name]);
        return namesId.rows[0].id;
    }

    async function getDaysId(days) {
        try {
            let daysId = await pool.query('SELECT id FROM days_of_work WHERE day_working = $1', [days]);
            // console.log(daysId.rows[0].id);
            return daysId.rows[0].id;
        } catch (error) {
            console.log(error);
        }
    }

    async function storedDetails() {
        let waiterInfo = await pool.query('SELECT * FROM working_days');
        return waiterInfo.rows;
    }

    return {
        addWaiterInfo,
        storedDetails,
        getDaysId,
        getNameId
    }
}