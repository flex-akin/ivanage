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
    numberOfWashroom: req.body.numberOfWashroom,
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
    res.render("../views/pages/newreg")

})



// router.post('/', async(req, res) =>{

//     const photo = req.body.photos
//     console.log("api",photo)
    
//     res.send(photo)

// })
router.get("/admin", (req, res) => {
    res.render("../views/pages/adminLogin", ans = {answer: ""});
  });

router.post('/login', (req, res) => {
    const password = req.body.password

    if (password == "admin") {
    return res.render("../views/pages/adminPortal", ans ={ answer: ""})
    
    }
    if (password != "admin") {
    return  res.render("../views/pages/adminLogin", ans = {answer: "wrong password"});
    }
} )

router.get('/xyuegdghfhsjska-dj', (req, res) => {
    res.render("../views/pages/adminPortal")
})
router.get('/grehdsjhskjefi-io', async (req, res) => {
  const allData = await Property.find();

    res.render("../views/pages/adminData", {allData})
})

router.get("/delete/:id", async (req, res) => {

    const uid = req.params.id;
    const result = await Property.deleteOne({propertyCode: uid});
    


    const allData = await Property.find();

  
    res.render("../views/pages/adminData", { allData});
  });


router.get('/poste', async(req, res) => {

const csvFilePath='./assets/img/ivantagest.csv'
const csv=require('csvtojson')
const jsonArray = await csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{

    const convert = (string) => {

        const new_string = string.replace("https://drive.google.com/file/d/", "")
        const another = new_string.replace("/view?usp=share","")
        return another
        }

    for (let i = 0; i < jsonObj.length; i++) {
        
    const property = new Property({

        propertyCode:  jsonObj[i].propertyCode, //  is shorthand for {type: }
        developer: jsonObj[i].developer,
        propertyName:   jsonObj[i].propertyName,
        state: jsonObj[i].state,
        area: jsonObj[i].area,
        propertyType: jsonObj[i].propertyType,
        numberOfBedroom: jsonObj[i].numberOfBedroom,
        numberOfWashroom: jsonObj[i].numberOfWashroom,
        quantityAvailableUnits: jsonObj[i].quantityAvailableUnits,
        propertyPrice: jsonObj[i].propertyPrice,
        propertySize: jsonObj[i].propertySize,
        propertyFeatures: jsonObj[i].propertyFeatures,
        status: jsonObj[i].status,
        deliveryDate: jsonObj[i].deliveryDate,
        titleType: jsonObj[i].titleType,
        buildingPlanApproval: jsonObj[i].buildingPlanApproval,
        photos: [ convert(jsonObj[i].photo1), convert(jsonObj[i].photo2), convert(jsonObj[i].photo3), convert(jsonObj[i].photo4),
        convert(jsonObj[i].photo5) ]
    
        })

    const savedUser = property.save();
}
   
})
res.send("success")
  });


  router.get('/lists/:pageNumber', async(req, res) => {
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
  
        const pages = await Property.paginate({}, {limit : 21,  page: req.params.pageNumber}, {sort: { id: 'asc'}})
       shuffle(pages.docs)

        res.render("../views/pages/pagination", {pages})

  });

  router.get('/listed', async(req, res) => {
  
    const pages = await Property.paginate({}, {limit : 21})
     //res.json(pages);
   res.render("../views/pages/newIndex", {pages})

});


const multer = require('multer');
// const upload = multer({dest:'./assets/img/', filename:"test.csv"});



  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './assets/img')
    },
    filename: function (req, file, cb) {
      
      cb(null, "test.csv")
    }
  })
  
  const upload = multer({ storage: storage })

  router.post('/profile', upload.single('avatar'), (req, res) => {
    res.send("succesful")
  })


module.exports = router;

