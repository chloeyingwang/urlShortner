//template of document for shortUrl
//require mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = new Schema({

    originalUrl: String,
    shorterUrl: Number
    //shorterUrl: String is ok too


}, {timestamps: true});

const ModelClass = mongoose.model('shortUrl', urlSchema);
//shortUrl is the collection name, mongoose is going to pluralize for us
module.exports = ModelClass;