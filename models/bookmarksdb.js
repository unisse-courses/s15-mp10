var mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@ccapdev.eadlr.mongodb.net/ReviewMe?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
            console.log('bookmarksdb: OK');
        },
        err => {
            console.log('bookmarksdb: ');
            console.log(err);
        });
var db = mongoose.connection;

const bookmarkSchema = new mongoose.Schema({
    storeID: {
        type: Number,
        required: true
    },
    userID: {
        type: Number,
        required: true
    },
}, {
    collection: "Bookmarks"
});

bookmarkSchema.methods.recordBookmark = async function () {
    var result = bookmarksModel.create(this);
    console.log(JSON.stringify(result));
    return result;
};

const bookmarksModel = db.model('Bookmarks', bookmarkSchema);

module.exports = bookmarksModel;