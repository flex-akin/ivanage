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

router.post


module.exports = router;

