let express = require('express');
let app = express();
const pg = require('pg');
const flash = require('express-flash');
const session = require('express-session');
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars');
const WaiterAvailability = require('./waiter-app');

const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://codex:codex123@localhost:5432/waiter_app';
const pool = new Pool({
  connectionString
});
const waiterAppInstance = WaiterAvailability(pool);

app.use(session({
  secret: "<add a secret string here>",
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))

// configure handlebars
app.engine('handlebars', exphbs({ layoutsDir: './views/layouts/' }));
app.set('view engine', 'handlebars');

app.get('/', async function (req, res) {
  // let days = waiterAppInstance.getDays();

  res.render('home', {
    // day_working: days
    // working_days: await waiterAppInstance.storedDetails()
  });
})
app.get('/waiters/:username', async function (req, res) {
  let name = req.params.username;
  res.render('home', {
    username: name
  });
})

app.post('/waiters/:username', async function (req, res) {
  // TO DO : URL TO TAKE DYNAMIC NAMES
  let name = req.params.username;
  let days = req.body.day;
  console.log(name);

  let waiterDetails = await waiterAppInstance.addWaiterInfo(name, days);

  if(waiterDetails){
    req.flash('successMessage', 'Please enter your details');
  }else{
    req.flash('successMessage', 'Successfuly added on the database!');
  }

  res.render('home', {
    // TO DO : URL TO TAKE DYNAMIC NAMES
    username: name,
  })
})

app.get('/days', async function (req, res) {
  let workingWaiters = await waiterAppInstance.getName();
  // console.log(workingWaiters);
  let daysWorking = await waiterAppInstance.getDays()

  res.render('shifts', {
    waiter_name: workingWaiters,
    day_working: daysWorking
  })
})

let PORT = process.env.PORT || 3032;

app.listen(PORT, function () {
  console.log('APP STARTED ON PORT', PORT);
})