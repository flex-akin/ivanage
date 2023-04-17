const router = require('express').Router();
const path = require('path')
const Property = require('../model/Property')
const axios = require("axios")




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
  const pageNumber = req.params.pageNumber
      //  shuffle(pages.docs)
      const config = {
        method: 'get',
        url: `https://propertyapi.ivantage.africa/api/ivantage/properties?size=21&page=${pageNumber}`,
        headers: { 'token': 'adebam' },
     
    }
      try{
        const page =  await axios(config)
        const pages = page.data
        res.render("../views/pages/pagination", {pages})    
        // res.send(pages.data.data.propertyData)
      }
      catch(error){
        console.log(error.message)
      }


  });

  router.get('/listed', async(req, res) => {
  
    const pages = await Property.paginate({}, {limit : 21})
     //res.json(pages);
   res.render("../views/pages/newIndex", {pages})

});


module.exports = router;

