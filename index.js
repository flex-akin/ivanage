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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
dotenv.config();
app.use(cors());

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () =>
  console.log("connected to db")
);

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
  const pages = await Property.paginate({}, {limit : 21}, {sort: { id: 'asc'}})
  shuffle(pages.docs)
  res.send(pages)
//res.render("../views/pages/newIndex", {pages})
});

app.get("/mortgageCalculator", async (req, res) => {
  res.render("../views/pages/mortgageCalculator");
});

app.get("/adminportal", async (req, res) => {
  res.render("../views/pages/newpages/newAdminPost");
});

app.get("/success", async (req, res) => {
  res.render("../views/pages/success");
});

app.get("/error", async (req, res) => {
  res.render("../views/pages/error");
});

app.get("/filter", async (req, res) => {
  var {
    state,
    area,
    propertyType,
    nofBedroom: nof_Bedroom,
    status,
    minPrice: min_price,
    maxPrice: max_price,
  } = req.query;

  const minPrice = Number((min_price).replace(/\,/g, ''));
  var maxPrice = Number((max_price).replace(/\,/g, ''));
  var nofBedroom = Number(nof_Bedroom);

  if (status) {
    status = [status]
  }else{
    status = ["Off Plan", "Completed"]
  }

  if (propertyType) {
    propertyType =[propertyType]
  }else{
    propertyType = ["Apartment", "Studio", "Terrace", "Semi Detached", "Penthouse", "Town House", "Maisonette" ]
  }

  if (nofBedroom <= 0) {
    nofBedroom =[0,1,2,3,4,5,6,7,8,9]
  }else {
    nofBedroom =[nofBedroom]
  }



  console.log([
    state,
    area,
    propertyType,
    nofBedroom,
    status,
    min_price,
    max_price,
  ]);

  if (!maxPrice) {
    maxPrice = 1000000000;

    if (!area) {
      if (!state) {
        const allData = await Property.find({
          status: status,
          propertyType: { $in: propertyType } ,
          numberOfBedroom: { $in: nofBedroom},
          propertyPrice: { $gte: minPrice, $lte: 1000000000 },
        });

        //return res.json(allData)
        return res.render("../views/pages/vie#", { allData });
      } else if (state) {
        const allData = await Property.find({
          status: { $in: status },
          propertyType:  { $in: propertyType },
          state: state,
          numberOfBedroom: { $in: nofBedroom},
          propertyPrice: { $gte: minPrice, $lte: 1000000000 },
        });

        return res.render("../views/pages/viee", { allData });
      }
    }
  }
  
  const allData = await Property.find({
    status:  { $in: status },
    propertyType: { $in: propertyType },
    area: area,
    numberOfBedroom: { $in: nofBedroom},
    propertyPrice: { $gte: minPrice, $lte: maxPrice },
  });

  //res.json(allData)
  return res.render("../views/pages/viee", { allData });
  // res.send(allData)
});

// filters for only admin page

app.get("/adminfilters", async (req, res) => {
  var {
    state,
    area,
    propertyType,
    nofBedroom: nof_Bedroom,
    status,
    minPrice: min_price,
    maxPrice: max_price,
  } = req.query;

  const minPrice = Number((min_price).replace(/\,/g, ''));
  var maxPrice = Number((max_price).replace(/\,/g, ''));
  var nofBedroom = Number(nof_Bedroom);

  if (status) {
    status = [status]
  }else{
    status = ["Off Plan", "Completed"]
  }

  if (propertyType) {
    propertyType =[propertyType]
  }else{
    propertyType = ["Apartment", "Studio", "Terrace", "Semi Detached", "Penthouse", "Town House", "Maisonette" ]
  }

  if (nofBedroom <= 0) {
    nofBedroom =[0,1,2,3,4,5,6,7,8,9]
  }else {
    nofBedroom =[nofBedroom]
  }



  console.log([
    state,
    area,
    propertyType,
    nofBedroom,
    status,
    min_price,
    max_price,
  ]);

  if (!maxPrice) {
    maxPrice = 1000000000;

    if (!area) {
      if (!state) {
        const allData = await Property.find({
          status: status,
          propertyType: { $in: propertyType } ,
          numberOfBedroom: { $in: nofBedroom},
          propertyPrice: { $gte: minPrice, $lte: 1000000000 },
        });

        //return res.json(allData)
        return res.render("../views/pages/index", { allData });
      } else if (state) {
        const allData = await Property.find({
          status: { $in: status },
          propertyType:  { $in: propertyType },
          state: state,
          numberOfBedroom: { $in: nofBedroom},
          propertyPrice: { $gte: minPrice, $lte: 1000000000 },
        });

        return res.render("../views/pages/index", { allData });
      }
    }
  }
  
  const allData = await Property.find({
    status:  { $in: status },
    propertyType: { $in: propertyType },
    area: area,
    numberOfBedroom: { $in: nofBedroom},
    propertyPrice: { $gte: minPrice, $lte: maxPrice },
  });

  //res.json(allData)
  return res.render("../views/pages/index", { allData });
  // res.send(allData)
});


//filters ends here





app.set("view engine", "ejs");
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/", (req, res) => {
  res.render("pages/index");
});



app.get("/show/:propertyCode", async (req, res) => {
  const rest = 0;
  const uid = req.params.propertyCode;
  const oneData = await Property.findOne({ propertyCode: uid });

  res.render("../views/pages/property", { oneData, rest });
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
    email: "felix.akintola@ivantage.africa",
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
    email: "felix.akintola@ivantage.africa",
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

app.get('/adminfilter', async (req,res) =>{
  const allData = await 0
  res.render('../views/pages/aminfilter', {allData})
})

app.use("/api/list", list);

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});
