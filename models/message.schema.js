/*
Import
*/
    const mongoose = require('mongoose');
    const { Schema } = mongoose;
//


/*
Definition
*/
    const Message = new Schema({
        message: String,
        name: String
    });
//

/*
Export
*/
    const MyModel = mongoose.model('message', Message);
    module.exports = MyModel;
//