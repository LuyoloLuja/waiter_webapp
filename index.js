let express = require('express');
let app = express();
const exphbs = require('express-handlebars');

// configure handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res){
    res.render('home');
})

let PORT = process.env.PORT || 3032;

app.listen(PORT, function(){
    console.log('APP STARTED ON PORT', PORT);
})