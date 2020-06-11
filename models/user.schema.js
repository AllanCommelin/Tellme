/*
Import
*/
    const mongoose = require('mongoose');
    const jwt = require('jsonwebtoken'); //=> https://www.npmjs.com/package/jsonwebtoken
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
Methods
*/
User.methods.generateJwt = (user) => {

    // set expiration
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 59);

    const jwtObj = {
        _id: user._id,
        email: user.email,
        pseudo: user.pseudo,
        expireIn: '10s',
        exp: parseInt(expiry.getTime() / 100, 10)
    };

    // JWT creation 'HtKNZ24utVB1V21F67UNRxgp9RZIcO'
    return jwt.sign(jwtObj, process.env.SECRET_TOKEN )
};
//

/*
Export
*/
    const MyModel = mongoose.model('user', User);
    module.exports = MyModel;
//