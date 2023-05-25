const express = require("express");
const app = express();
const path = require("path");``
const port = 3000;
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Property = require("./model/Property");
const Sib = require("sib-api-v3-sdk");
const list = require("./routes/listing");
const axios = require("axios")

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
dotenv.config();
app.use(cors());

app.get("/", async (req, res) => {

  function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  //const pages = await Property.paginate({}, {limit : 21}, {sort: { id: 'asc'}})
  const config = {
    method: 'get',
    url: 'https://propertyapi.ivantage.africa/api/ivantage/properties?size=21',
    headers: { 'token': 'adebam' },
 
}
  try{
    const page =  await axios(config)
    const pages = page.data
    res.render("../views/pages/newIndex", {pages} )

    // res.send(pages.data.data.propertyData)
  }
  catch(error){
    console.log(error.message)
  }
  //shuffle(pages.propertData)
  //res.send(pages)
});   

app.get("/mortgageCalculator", async (req, res) => {
  res.render("../views/pages/mortgageCalculator");
});

app.get("/success", async (req, res) => {
  res.render("../views/pages/success");
});

app.get("/error", async (req, res) => {
  res.render("../views/pages/error");
});

app.get("/filter", async (req, res) => {
  const state = req.query.state
  var minPrice = req.query.minPrice
  minPrice = minPrice.replaceAll(',', '')
  var maxPrice = req.query.maxPrice
  maxPrice = maxPrice.replaceAll(',', '')
  const propertyType = req.query.propertyType
  const status = req.query.status
  const numberOfBedrooms = req.query.numberOfBedrooms


  const config = {
    method: 'get',
    url: `https://propertyapi.ivantage.africa/api/ivantage/findproperties?state=${state}&minPrice=${minPrice}&maxPrice=${maxPrice}&propertyType=${propertyType}&numberOfBedrooms=${numberOfBedrooms}&status=${status}
  `,
    headers: { 
      'token': 'adebam'

  },
 
}
  try{
    const page =  await axios(config)
    const pages = page.data
    console.log(pages)
  res.render("../views/pages/pagination", { pages });

    // res.send(pages.data.data.propertyData)
  }
  catch(error){
    var pages = error.response
    pages.data.nextPage = null
    pages.data.previousPage = null
    pages.data.pageDataCount = 0
    console.log(pages)


  res.render("../views/pages/pagination", { pages });
   
  }
  //res.json(allData)
  // res.send(allData)
});


app.set("view engine", "ejs");
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/", (req, res) => {
  res.render("pages/index");
});



app.get("/show/:id", async (req, res) => {
  const rest = 0;
  const uid = req.params.id;

  const config = {
    method: 'get',
    url: `https://propertyapi.ivantage.africa/api/ivantage/property/${uid}`,
    headers: { 'token': 'adebam' },
 
}
  try{
    const page =  await axios(config)
    const oneData = page.data
  res.render("../views/pages/property", { oneData, rest });


    // res.send(pages.data.data.propertyData)
  }
  catch(error){
    console.log(error.message)
  }

});

app.post("/sendmail", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const phonenumber = req.body.phonenumber;
  const date = req.body.date;
  const time = req.body.time;
  const comment = req.body.comment;

  const client = Sib.ApiClient.instance;
  const apiKey = client.authentications["api-key"];
  apiKey.apiKey = process.env.API_KEY;
  const tranEmailApi = new Sib.TransactionalEmailsApi();
  const sender = {
    email: email,
  };

  const receivers = [
    {
      email: "property@ivantage.africa",
    },
  ];

  tranEmailApi
    .sendTransacEmail({
      sender,
      to: receivers,
      subject: "Schedule Inspection Request",
      textContent: `
  name : ${name}
  Email: ${email}
  Phone Number: ${phonenumber}
  date : ${date}
  time : ${time}
  comment: ${comment}
  
  `,
    })
    .then(
      function (data) {
        console.log(data);
        res.render("../views/pages/success");
      },
      function (error) {
        console.log(error);
        res.render("../views/pages/error");
      }
    );
});

app.post("/sendmailer", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const phonenumber = req.body.phonenumber;

  const client = Sib.ApiClient.instance;
  const apiKey = client.authentications["api-key"];
  apiKey.apiKey = process.env.API_KEY;
  const tranEmailApi = new Sib.TransactionalEmailsApi();
  const sender = {
    email: email,
  };

  
  const receivers = [
    {
      email: "property@ivantage.africa",
    },
  ];

  tranEmailApi
    .sendTransacEmail({
      sender,
      to: receivers,
      subject: "Schedule Inspection Request",
      textContent: `
  name : ${name}
  Email: ${email}
  Phone Number: ${phonenumber}
 
  
  `,
    })
    .then(
      function (data) {
        console.log(data);
        res.render("../views/pages/success");
      },
      function (error) {
        console.log(error);
        res.render("../views/pages/error");
      }
    );
});

app.use("/api/list", list);

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});
