var mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@ccapdev.eadlr.mongodb.net/ReviewMe?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
            console.log('reviewsdb: OK');
        },
        err => {
            console.log('reviewsdb: ');
            console.log(err);
        });
var db = mongoose.connection;

const reviewSchema = new mongoose.Schema({
    reviewID: {
        type: Number,
        required: true
    },
    userID: {
        type: Number,
        required: true
    },
    storeID: {
        type: Number,
        required: true
    },
    postDate: {
        type: Date,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    storeRating: {
        type: Number,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    edited: {
        type: Boolean,
        required: true
    },
    deleted: {
        type: Boolean,
        required: true
    }
}, {
    collection: "Reviews"
});

reviewSchema.methods.recordReview = async function () {
    var result = reviewsModel.create(this);
    console.log(JSON.stringify(result));
    return result;
};

const reviewsModel = db.model('Reviews', reviewSchema);

module.exports = reviewsModel;