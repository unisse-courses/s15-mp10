var mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@ccapdev.eadlr.mongodb.net/ReviewMe?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
            console.log('storesdb: OK');
        },
        err => {
            console.log('storesdb: ');
            console.log(err);
        });
var db = mongoose.connection;

const storeSchema = new mongoose.Schema({
    storeID: {
        type: Number,
        required: true
    },
    userID: {
        type: Number,
        required: true
    },
    storeName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    stars:{
        type: Number,
        required: true
    }
}, {
    collection: "Stores"
});

storeSchema.methods.recordStore = async function () {
    var result = storesModel.create(this);
    console.log(JSON.stringify(result));
    return result;
};

const storesModel = db.model('Stores', storeSchema);

module.exports = storesModel;