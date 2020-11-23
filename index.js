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
  res.render('home');
})

app.get('/waiters/:username', async function (req, res) {
  let name = req.params.username;
  name = name.toUpperCase().charAt(0) + name.slice(1);
  let days = req.body.day

  await waiterAppInstance.getDays();
  let waiterDetails = await waiterAppInstance.addWaiterInfo(name, days);

  res.render('home', {
    username: name,
    day_working: days,
    waiterDetails
  });
})

app.post('/waiters/:username', async function (req, res) {
  let name = req.params.username;
  name = name.toUpperCase().charAt(0) + name.slice(1);
  let days = req.body.day;

  // await waiterAppInstance.getDays();

  if (!name && !days) {
    req.flash('successMessage', 'Please enter your details');
  } else {
    req.flash('successMessage', 'Successfuly added on the database!');
    // waiterDetails
    var waiterDetails = await waiterAppInstance.addWaiterInfo(name, days);
  }

  res.render('home', {
    username: name,
    days_working: days,
    waiterDetails
  })
})

app.get('/days', async function (req, res) {
  const data =  await waiterAppInstance.groupWaitersByDay();
  
  res.render('shifts', {
    data
  })
})

let PORT = process.env.PORT || 3032;

app.listen(PORT, function () {
  console.log('APP STARTED ON PORT', PORT);
})