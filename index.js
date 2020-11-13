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
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res){
    res.render('home');
})

app.get('/waiters/:username', async function(req, res){
  let user = req.params.username;
  let days = req.body.day;

  

})

let PORT = process.env.PORT || 3032;

app.listen(PORT, function(){
    console.log('APP STARTED ON PORT', PORT);
})