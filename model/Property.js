const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');


const propertySchema = new mongoose.Schema({
    propertyCode:  String, 
    developer: String,
    propertyName:   String,
    state: String,
    area: String,
    propertyType: String,
    numberOfBedroom: String,
    numberOfWashroom: String,
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
propertySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Property', propertySchema);