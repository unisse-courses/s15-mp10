var mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@ccapdev.eadlr.mongodb.net/ReviewMe?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => { console.log('imagesdb: OK'); },
        err => {
            console.log('imagesdb: ');
            console.log(err);
        });
var db = mongoose.connection;

const imageSchema = new mongoose.Schema({
    imageID: {type: Number, required: true},
    storeID: {type: Number, required: true},
    image: {type: Buffer, required: true}
}, { collection: "Images" });

imageSchema.methods.recordImage = async function() {
    var result = imagesModel.create(this);
    console.log(JSON.stringify(result));
    return result;
};

const imagesModel = db.model('Images', imageSchema);

module.exports = imagesModel;