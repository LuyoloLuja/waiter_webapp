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

  describe('The getNameId() function', async function () {
    it('Should return 1 as Luyolos id', async function () {
      assert.equal(await waiterApp.getNameId('Luyolo'), 1);
    })
    it('Should return 2 as Simthes id', async function () {
      assert.equal(await waiterApp.getNameId('Simthe'), 2);
    })
    it('Should return 3 as Lilitha id', async function () {
      assert.equal(await waiterApp.getNameId('Lilitha'), 3);
    })
    it('Should return 4 as Salizo id', async function () {
      assert.equal(await waiterApp.getNameId('Salizo'), 4);
    })
  })

  describe('The getDaysId() function', async function () {
    it('Should return 1 as Mondays id', async function () {
      assert.equal(await waiterApp.getDaysId('Monday'), 1);
    })
    it('Should return 2 as Tuesday id', async function () {
      assert.equal(await waiterApp.getDaysId('Tuesday'), 2);
    })
    it('Should return 3 as Wednesday id', async function () {
      assert.equal(await waiterApp.getDaysId('Wednesday'), 3);
    })
    it('Should return 4 as Thursday id', async function () {
      assert.equal(await waiterApp.getDaysId('Thursday'), 4);
    })
    it('Should return 5 as Friday id', async function () {
      assert.equal(await waiterApp.getDaysId('Friday'), 5);
    })
    it('Should return 6 as Saturday id', async function () {
      assert.equal(await waiterApp.getDaysId('Saturday'), 6);
    })
    it('Should return 7 as Sunday id', async function () {
      assert.equal(await waiterApp.getDaysId('Sunday'), 7);
    })
  })

  describe('The addWaiterInfo() and groupWaitersByDay() functions', async function () {
    it('Should return the names and days that were set', async function () {
      await waiterApp.addWaiterInfo('Luyolo', ['Monday']);
      await waiterApp.addWaiterInfo('Simthe', ['Tuesday', 'Friday']);
      await waiterApp.addWaiterInfo('Lilitha', ['Wednesday']);

      assert.deepStrictEqual(await waiterApp.groupWaitersByDay(), [
        {shift: "yellow", waiter: ["Luyolo"], work_day: "Monday"},
        {"shift": "yellow", waiter: ["Simthe"], work_day: "Tuesday"},
        {"shift": "yellow", waiter: ["Lilitha"], work_day: "Wednesday"},
        {waiter: [], work_day: "Thursday"},
        {"shift": "yellow", waiter: ["Simthe"], work_day: "Friday"},
        {waiter: [], work_day: "Saturday"},
        {waiter: [], work_day: "Sunday"}
      ]);
    })

    it('Should return red if day has more than 3 waiters available', async function(){
      await waiterApp.addWaiterInfo('Luyolo', ['Monday']);
      await waiterApp.addWaiterInfo('Simthe', ['Monday']);
      await waiterApp.addWaiterInfo('Lilitha', ['Monday']);
      await waiterApp.addWaiterInfo('Lumanyano', ['Monday']);

      assert.deepStrictEqual(await waiterApp.groupWaitersByDay(), [
        {shift: "red", waiter: ["Luyolo", "Simthe", "Lilitha", "Lumanyano"], work_day: "Monday"},
        {waiter: [], work_day: "Tuesday"},
        {waiter: [], work_day: "Wednesday"},
        {waiter: [], work_day: "Thursday"},
        {waiter: [], work_day: "Friday"},
        {waiter: [], work_day: "Saturday"},
        {waiter: [], work_day: "Sunday"}
      ])
    })

    it('Should return green if day has 3 waiters available', async function(){
      await waiterApp.addWaiterInfo('Luyolo', ['Monday']);
      await waiterApp.addWaiterInfo('Simthe', ['Monday']);
      await waiterApp.addWaiterInfo('Lilitha', ['Monday']);

      assert.deepStrictEqual(await waiterApp.groupWaitersByDay(), [
        {shift: "green", waiter: ["Luyolo", "Simthe", "Lilitha"], work_day: "Monday"},
        {waiter: [], work_day: "Tuesday"},
        {waiter: [], work_day: "Wednesday"},
        {waiter: [], work_day: "Thursday"},
        {waiter: [], work_day: "Friday"},
        {waiter: [], work_day: "Saturday"},
        {waiter: [], work_day: "Sunday"}
      ])
    })
    it('Should return yellow if day has less than 3 waiters available', async function(){
      await waiterApp.addWaiterInfo('Luyolo', ['Monday']);
      await waiterApp.addWaiterInfo('Simthe', ['Monday']);

      assert.deepStrictEqual(await waiterApp.groupWaitersByDay(), [
        {shift: "yellow", waiter: ["Luyolo", "Simthe"], work_day: "Monday"},
        {waiter: [], work_day: "Tuesday"},
        {waiter: [], work_day: "Wednesday"},
        {waiter: [], work_day: "Thursday"},
        {waiter: [], work_day: "Friday"},
        {waiter: [], work_day: "Saturday"},
        {waiter: [], work_day: "Sunday"}
      ])
    })
  })
})