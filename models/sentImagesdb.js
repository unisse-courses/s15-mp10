var mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@ccapdev.eadlr.mongodb.net/ReviewMe?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
            console.log('sentImagesdb: OK');
        },
        err => {
            console.log('sentImagesdb: ');
            console.log(err);
        });
var db = mongoose.connection;

const sentImageSchema = new mongoose.Schema({
    imageID: {
        type: Number,
        required: true
    },
    storeID: {
        type: Number,
        required: true
    },
    userID: {
        type: Number,
        required: true
    },
    img: {
        data: Buffer,
        contentType: String
    }
}, {
    collection: "SentImages"
});

const sentImagesModel = db.model('SentImages', sentImageSchema);

module.exports = sentImagesModel;