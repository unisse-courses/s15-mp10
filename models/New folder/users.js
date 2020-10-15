var mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@ccapdev.eadlr.mongodb.net/<dbname>?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => { console.log('users'); },
        err => {
            console.log('theres problems');
        });

var db = mongoose.connection;


const userSchema = new mongoose.Schema({
    userID: {type: Number, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    bio: {type: String, required: true},
    isStoreOwner: {type: Boolean, required: true},
}, { collection: "Users" });

userSchema.methods.recordUser = async function() {
    var result = usersModel.create(this);
    console.log(JSON.stringify(result));
    return result;
};

const usersModel = db.model('Users', userSchema);

module.exports = usersModel;