const express = require('express')
const cors = require('cors')
const {connect} = require('mongoose')
require('dotenv').config()
const upload = require('express-fileupload')


const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')
const {notFound,errorHandler} = require('./middleware/errorMiddleware')




const app = express();
var allowCrossDomain = function(req, res, next) { 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
    }
app.use(express.json({extended: true}))
app.use(express.urlencoded({extended: true}))
app.use(allowCrossDomain);
app.use(upload())
app.use('/uploads',express.static(__dirname + '/uploads'))



app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)

app.use(notFound)
app.use(errorHandler)


connect(process.env.MONGO_URI).then(console.log('Server running'))
.catch(error => {console.log(error)})

module.exports = app;