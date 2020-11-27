let assert = require("assert");
let WaiterApp = require("../waiter-app");
const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:codex123@localhost:5432/waiter_app_db';

const pool = new Pool({
  connectionString
});

const waiterApp = WaiterApp(pool);

describe('The Waiter App Tests', function () {
  beforeEach(async function () {
    // clean the tables before each test run
    await pool.query("delete from working_days;");
  });

  describe('The getNameId() function', async function(){
    it('Should return 1 as Luyolos id', async function(){
      assert.equal(await waiterApp.getNameId('Luyolo'), 1);
    })
    it('Should return 2 as Simthes id', async function(){
      assert.equal(await waiterApp.getNameId('Simthe'), 2);
    })
    it('Should return 3 as Lilitha id', async function(){
      assert.equal(await waiterApp.getNameId('Lilitha'), 3);
    })
    it('Should return 4 as Salizo id', async function(){
      assert.equal(await waiterApp.getNameId('Salizo'), 4);
    })
  })

  describe('The getDaysId() function', async function(){
    it('Should return 1 as Mondays id', async function(){
      assert.equal(await waiterApp.getDaysId('Monday'), 1);
    })
    it('Should return 2 as Tuesday id', async function(){
      assert.equal(await waiterApp.getDaysId('Tuesday'), 2);
    })
    it('Should return 3 as Wednesday id', async function(){
      assert.equal(await waiterApp.getDaysId('Wednesday'), 3);
    })
    it('Should return 4 as Thursday id', async function(){
      assert.equal(await waiterApp.getDaysId('Thursday'), 4);
    })
    it('Should return 5 as Friday id', async function(){
      assert.equal(await waiterApp.getDaysId('Friday'), 5);
    })
    it('Should return 6 as Saturday id', async function(){
      assert.equal(await waiterApp.getDaysId('Saturday'), 6);
    })
    it('Should return 7 as Sunday id', async function(){
      assert.equal(await waiterApp.getDaysId('Sunday'), 7);
    })
  })

  describe('The addWaiter() and groupWaitersByDay() functions', async function(){
    it('Should return the names and days that were set', async function(){
      await waiterApp.addWaiterInfo('Luyolo', 'Monday');
      await waiterApp.addWaiterInfo('Simthe', 'Tuesday');
      await waiterApp.addWaiterInfo('Lilitha', 'Wednesday');

      assert.deepEqual(await waiterApp.groupWaitersByDay(), [{work_day: 'Monday', waiter: 'Luyolo'}, {work_day: 'Tuesday', waiter: 'Simthe'}, {work_day: 'Wednesday', waiter: 'Lilitha'}])
    })
  })
})