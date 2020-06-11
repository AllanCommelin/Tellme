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
        user: Schema.Types.ObjectId,
        room: Schema.Types.ObjectId,
    });
//

/*
Export
*/
    const MyModel = mongoose.model('message', Message);
    module.exports = MyModel;
//