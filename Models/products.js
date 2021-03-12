const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    name : {
        type: String,
        required : true
    },
    details : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    quantity: {
        type : Number,
        required : true
    }
})
module.exports = products = mongoose.model('products' , PostSchema);