/*
Import
*/
const mongoose = require('mongoose');
const { Schema } = mongoose;
//


/*
Definition
*/
const Room = new Schema({
    name: String,
    createdAt: { type: Date, default: Date.now },
    owner: Schema.Types.ObjectId,
});
//

/*
Export
*/
const MyModel = mongoose.model('room', Room);
module.exports = MyModel;
//