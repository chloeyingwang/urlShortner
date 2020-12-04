const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const shortUrl = require('./models/shortUrl');
app.use(bodyParser.json());
app.use(cors());
require("dotenv").config();
//connect to database
//mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/shortUrls')
//more heroku stuff

// const uri = 'mongodb+srv://ChloeWang:'+process.env.PW+'@cluster0.j0ors.mongodb.net/shortUrl?retryWrites=true&w=majority'
const uri = process.env.ATLAS_URI
mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
  });

app.use(express.static(__dirname + '/public'))


app.get('/new/:urlToShorten(*)', (req, res, next)=>{
    //ES5 var urlToShorten = req.params.urlToShorten
var { urlToShorten } = req.params;
//console.log({urlToShorten})
var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
var regex = expression;

if(regex.test(urlToShorten)===false){
    return res.json('invalid url')
}

//if(regex.test(urlToShorten)===true)
else{
    var short = Math.floor(Math.random()*100000).toString();

    var data = new shortUrl({
        originalUrl: urlToShorten,
        shorterUrl: short
    })

    data.save(err=>{
        if(err){
            return res.send('Error saving to database')
        }
    })
return res.json(data)
   //return res.json({urlToShorten})
} 
//return res.json({urlToShorten: 'Failed'})
// var data = new shortUrl({
//     originalUrl: 'urlToShorten does not match standard format',
//     shorterUrl: 'InvalidURL'
// });
// return res.json(data);
});

//Query database and forward to originalUrl
app.get('/:urlToForward', (req, res, next)=>{
    //store the value of param
    var shorterUrl = req.params.urlToForward;

    shortUrl.findOne({'shorterUrl' : shorterUrl}, (err, data)=>{
        if(err) return res.send('Error reading database');

        var re = new RegExp("^(http|https)://", "i");
        var strToCheck = data.originalUrl;
        if(re.test(strToCheck)){
            res.redirect(301, data.originalUrl);
        }
        else {
            res.redirect(301, 'http://' + data.originalUrl);
        }
    })
})








app.listen(process.env.PORT ||3000, ()=>{
    console.log('Everything is working')
})
