var mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@ccapdev.eadlr.mongodb.net/ReviewMe?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(() => {
            console.log('storeImagesdb: OK');
        },
        err => {
            console.log('storeImagesdb: ');
            console.log(err);
        });
var db = mongoose.connection;

const storeImageSchema = new mongoose.Schema({
    imageID: {
        type: Number,
        required: true
    },
    storeID: {
        type: Number,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    imageBase64: {
        type: String,
        required: true
    }
}, {
    collection: "StoreImages"
});

const storeImagesModel = db.model('StoreImages', storeImageSchema);

module.exports = storeImagesModel;