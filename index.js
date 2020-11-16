let express = require('express');
let app = express();
const pg = require('pg');
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars');
const WaiterAvailability = require('./waiter-app');

const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://codex:codex123@localhost:5432/waiter_app';
const pool = new Pool({
  connectionString
});

const waiterAppInstance = WaiterAvailability(pool);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))

// configure handlebars
app.engine('handlebars', exphbs({ layoutsDir: './views/layouts/' }));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
  res.render('home');
})

app.post('/waiters/:username', async function (req, res) {
  let name = req.body.name;
  let days = req.body.day;
//  console.log(days);
//   const id =  await waiterAppInstance.getNameId(name)
//   console.log(i);
  await waiterAppInstance.addWaiterInfo(name, days);

  // let userName = await waiterAppInstance.getNameId(name);
  // let userDays = await waiterAppInstance.getDaysId(days);


  // let userDetails = await waiterAppInstance.storedDetails()

  res.render('home', {
    // waiter_name: userName,
    // days_working: userDays,
    // userDetails
  })
})

app.get('/waiters/:username', async function (req, res) {
  let userDetails = await waiterAppInstance.storedDetails();

  res.render(`/waiters'/${username}`, {
    waiter_name: userDetails,
    days_working: userDetails
  })

});

let PORT = process.env.PORT || 3032;

app.listen(PORT, function () {
  console.log('APP STARTED ON PORT', PORT);
})