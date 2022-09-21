const mongoose = require('mongoose')

const propertySchema = new mongoose.Schema({
    propertyCode:  String, 
    developer: String,
    propertyName:   String,
    state: String,
    area: String,
    propertyType: String,
    numberOfBedroom: String,
    quantityAvailableUnits: String,
    propertyPrice: Number,
    propertySize: String,
    propertyFeatures: String,
    status: String,
    deliveryDate: String,
    titleType: String,
    buildingPlanApproval: String,
    photos: []

})

module.exports = mongoose.model('Property', propertySchema);