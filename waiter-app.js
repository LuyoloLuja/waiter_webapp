module.exports = function WaiterApp(pool){

    async function waiterName(name){
        
        if(name){
            let nameEntered = await pool.query('SELECT waiter_name FROM waiter_names WHERE waiter_name = $1', [name]);

            if(nameEntered.rowCount === 0){
                await pool.query('INSERT INTO waiter_names (waiter_name) VALUES ($1)', [name])
            }
        }
    }

    return {
        waiterName
    }
}