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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
dotenv.config()

mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true} ,() => 
    console.log('connected to db'));

app.get('/', async(req,res) =>{
  const allData = await  Property.find()
  res.render("../views/pages/index", {allData} )

})

app.post('/filter', async (req, res) => {
  const state = req.body.state
  const area = req.body.area
  const minPrice = parseInt(req.body.minPrice)
  var maxPrice = parseInt(req.body.maxPrice)

  if (!maxPrice) {
    maxPrice = 1000000000

    if (!area) {
      if (!state) {
        const allData = await Property.find({ 
          propertyPrice  : { $gte: minPrice, $lte: 1000000000 }
           })
           return res.render("../views/pages/index", {allData} )
          } 
          else if (state) {
            const allData = await Property.find({ 
              state: state,
              propertyPrice  : { $gte: minPrice, $lte: 1000000000 }
              
               })
               return res.render("../views/pages/index", {allData} )

          }
    }
  }



  const allData = await Property.find({ 
  area: area,
  propertyPrice  : { $gte: minPrice, $lte: maxPrice }
   })
   res.render("../views/pages/index", {allData} )
  
})


app.use(cors())
app.set('view engine', 'ejs');
app.use('/assets', express.static(path.join(__dirname, 'assets')))

app.get('/', (req, res) => {
  res.render('pages/index');
})

app.get('/show/:propertyCode', async (req, res) => {
  const uid = req.params.propertyCode
  const oneData = await Property.findOne({ propertyCode: uid });
 

  res.render("../views/pages/property", {oneData} )
  
})


app.post('/sendmail' , (req,res) => {
  const name = req.body.name
  const email = req.body.email
  const phonenumber = req.body.phonenumber
  const date = req.body.date
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
    email: 'flexyakin1997@gmail.com'
  },
  {
    email: 'akintolafelix2121@gmail.com'
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
  comment: ${comment}
  
  `

}).then(function(data) {
  console.log(data);
}, function(error) {
  console.error(error);
});
})


const list = require('./routes/listing')
app.use('/api/list', list)

app.listen(port, () => {
  console.log(`app is listening on port ${port}`)
})