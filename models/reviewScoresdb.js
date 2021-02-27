var mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@ccapdev.eadlr.mongodb.net/ReviewMe?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
            console.log('reviewScoresdb: OK');
        },
        err => {
            console.log('reviewScoresdb: ');
            console.log(err);
        });
var db = mongoose.connection;

const reviewScoresSchema = new mongoose.Schema({
    reviewID: {
        type: Number,
        required: true
    },
    userID: {
        type: Number,
        required: true
    },
    score: {
        type: Number,
        required: true
    }
}, {
    collection: "ReviewScores"
});

reviewScoresSchema.methods.recordScore = async function () {
    var result = reviewScoresModel.create(this);
    console.log(JSON.stringify(result));
    return result;
};

const reviewScoresModel = db.model('ReviewScores', reviewScoresSchema);

module.exports = reviewScoresModel;