/*
Import
*/
    const mongoose = require('mongoose');
    const { Schema } = mongoose;
//


/*
Definition
*/
    const User = new Schema({
        pseudo: String,
        email: String,
        password: String
    });
//

/*
Export
*/
    const MyModel = mongoose.model('user', User);
    module.exports = MyModel;
//