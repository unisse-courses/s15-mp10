var mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@ccapdev.eadlr.mongodb.net/ReviewMe?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
            console.log('commentsdb: OK');
        },
        err => {
            console.log('commentsdb: ');
            console.log(err);
        });
var db = mongoose.connection;


const commentSchema = new mongoose.Schema({
    commentID: {
        type: Number,
        required: true
    },
    userID: {
        type: Number,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    reviewID:{
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, {
    collection: "Comments"
});

commentSchema.methods.recordComment = async function () {
    var result = commentsModel.create(this);
    console.log(JSON.stringify(result));
    return result;
};

const commentsModel = db.model('Comments', commentSchema);

module.exports = commentsModel;