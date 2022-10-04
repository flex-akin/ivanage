const router = require('express').Router();
const path = require('path')
const Property = require('../model/Property')



router.post('/', async(req, res) =>{


    const property = new Property({

    propertyCode:  req.body.propertyCode, // req.body. is shorthand for {type: req.body.}
    developer: req.body.developer,
    propertyName:   req.body.propertyName,
    state: req.body.state,
    area: req.body.area,
    propertyType: req.body.propertyType,
    numberOfBedroom: req.body.numberOfBedroom,
    numberOfWashroom: req.body.numberofWashroom,
    quantityAvailableUnits: req.body.quantityAvailableUnits,
    propertyPrice: req.body.propertyPrice,
    propertySize: req.body.propertySize,
    propertyFeatures: req.body.propertyFeatures,
    status: req.body.status,
    deliveryDate: req.body.deliveryDate,
    titleType: req.body.titleType,
    buildingPlanApproval: req.body.buildingPlanApproval,
    photos: req.body.photos

    })

    const savedUser = await property.save();
    res.send("success");

})


// router.post('/', async(req, res) =>{

//     const photo = req.body.photos
//     console.log("api",photo)
    
//     res.send(photo)

// })

router.get("/admin", (req, res) => {
    res.render("../views/pages/admin_login", ans = {answer: ""});
  });

router.post('/login', (req, res) => {
    const password = req.body.password

    if (password == "admin") {
    return res.render("../views/pages/admin_portal", ans ={ answer: ""})
    
    }
    if (password != "admin") {
    return  res.render("../views/pages/admin_login", ans = {answer: "wrong password"});
    }
} )

router.get('/xyuegdghfhsjska-dj', (req, res) => {
    res.render("../views/pages/admin_portal")
})
router.get('/grehdsjhskjefi-io', async (req, res) => {
  const allData = await Property.find();

    res.render("../views/pages/admin_data", {allData})
})

router.get("/delete/:id", async (req, res) => {

    const uid = req.params.id;
    const result = await Property.deleteOne({propertyCode: uid});
    


    const allData = await Property.find();

  
    res.render("../views/pages/admin_data", { allData});
  });
module.exports = router;

