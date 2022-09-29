const express = require('express')
const app = express()
const path = require('path')
const port = 3000
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Property = require('./model/Property')
const Sib = require('sib-api-v3-sdk')
const list = require('./routes/listing')


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
dotenv.config()
app.use(cors())

mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true} ,() => 
    console.log('connected to db'));

app.get('/', async(req,res) =>{
  const allData = await  Property.find()

  res.render("../views/pages/index", {allData} )

})

app.get('/mortgageCalculator', async(req,res) =>{
  res.render("../views/pages/mortgageCalculator")

})

app.get('/success', async(req,res) =>{
  res.render("../views/pages/success")

})

app.get('/error', async(req,res) =>{
  res.render("../views/pages/error")

})

app.get('/filter', async (req, res) => {
const {state, area, propertyType, nofBedroom:nof_Bedroom, status, minPrice:min_price, maxPrice:max_price} = req.query

  const minPrice = parseInt(min_price)
  var maxPrice = parseInt(max_price)
  var nofBedroom = parseInt(nof_Bedroom)

  console.log([state, area, propertyType, nof_Bedroom, status, min_price, max_price])



  if (!maxPrice) {
    maxPrice = 1000000000

    if (!area) {
      if (!state) {
        
        const allData = await Property.find({ 
          status: status,
          propertyType: propertyType,
          nofBedroom :  nofBedroom,
          propertyPrice  : { $gte: minPrice, $lte: 1000000000 }
           })
           
           //return res.json(allData)
           return res.render("../views/pages/viee", {allData})

          } 
          else if (state) {
            const allData = await Property.find({ 
              status: status,
          propertyType: propertyType,
              state: state,
              nofBedroom : nofBedroom,
              propertyPrice  : { $gte: minPrice, $lte: 1000000000 }
              
               })

           return res.render("../views/pages/viee", {allData})
          }
    }
  }


  const allData = await Property.find({ 
    status: status,
          propertyType: propertyType,
  area: area,
  nofBedroom :  nofBedroom,
  propertyPrice  : { $gte: minPrice, $lte: maxPrice }
   })
   
   //res.json(allData)
           return res.render("../views/pages/viee", {allData})
          // res.send(allData)

  
})


app.set('view engine', 'ejs');
app.use('/assets', express.static(path.join(__dirname, 'assets')))

app.get('/', (req, res) => {
  res.render('pages/index');
})

app.get('/show/:propertyCode', async (req, res) => {
  const rest = 0
  const uid = req.params.propertyCode
  const oneData = await Property.findOne({ propertyCode: uid });
 

  res.render("../views/pages/property", {oneData, rest} )
  
})


app.post('/sendmail' , (req,res) => {
  const name = req.body.name
  const email = req.body.email
  const phonenumber = req.body.phonenumber
  const date = req.body.date
  const time = req.body.time
  const comment = req.body.comment

  const client = Sib.ApiClient.instance
  const apiKey = client.authentications['api-key']
  apiKey.apiKey = process.env.API_KEY
  const  tranEmailApi = new Sib.TransactionalEmailsApi()
  const sender = {
  email: 'felix.akintola@ivantage.africa'
}

  const receivers  =[
  {
    email: 'property@ivantage.africa'
  }
]

  tranEmailApi.sendTransacEmail({
  sender,
  to: receivers,
  subject: 'Schedule Inspection Request', 
  textContent : `
  name : ${name}
  Email: ${email}
  Phone Number: ${phonenumber}
  date : ${date}
  time : ${time}
  comment: ${comment}
  
  `

}).then(function(data) {
  console.log(data)
 res.render("../views/pages/success")
}, function(error) {
  console.log(error)
 res.render("../views/pages/error")

  
});
})


app.post('/sendmailer' , (req,res) => {
  const name = req.body.name
  const email = req.body.email
  const phonenumber = req.body.phonenumber
  

  const client = Sib.ApiClient.instance
  const apiKey = client.authentications['api-key']
  apiKey.apiKey = process.env.API_KEY
  const  tranEmailApi = new Sib.TransactionalEmailsApi()
  const sender = {
  email: 'felix.akintola@ivantage.africa'
}

  const receivers  =[
  {
    email: 'property@ivantage.africa'
  }
]

  tranEmailApi.sendTransacEmail({
  sender,
  to: receivers,
  subject: 'Schedule Inspection Request', 
  textContent : `
  name : ${name}
  Email: ${email}
  Phone Number: ${phonenumber}
 
  
  `

}).then(function(data) {
  console.log(data)
 res.render("../views/pages/success")
}, function(error) {
  console.log(error)
 res.render("../views/pages/error")

  
});
})





app.use('/api/list', list)

app.listen(port, () => {
  console.log(`app is listening on port ${port}`)
})




