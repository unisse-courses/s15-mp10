var mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@ccapdev.eadlr.mongodb.net/ReviewMe?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
            console.log('usersdb: OK');
        },
        err => {
            console.log('usersdb: ');
            console.log(err);
        });
var db = mongoose.connection;

const userSchema = new mongoose.Schema({
    userID: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
    },
    isStoreOwner: {
        type: Boolean,
        required: true
    },
}, {
    collection: "Users"
});

userSchema.methods.recordNewUser = async function () {
    var result = usersModel.create(this);
    return result;
};

const usersModel = db.model('Users', userSchema);

module.exports = usersModel;