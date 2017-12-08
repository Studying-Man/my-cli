
let mongoose = require('bluebird').promisifyAll(require('mongoose'));

let idCardSchema = new mongoose.Schema({
    cardName: String,
    level: Number,

    updateAt: {type: Number ,default: Number(Date.now())},
    createAt: {type: Number ,default: Number(Date.now())}

},{versionKey: false});


idCardSchema.pre('save',function (next) {
    if(this.isNew){
        this.createAt = this.updateAt = Number(Date.now());
    }else{
        this.updateAt = Number(Date.now())
    }
    next();
});

module.exports = mongoose.model('IdCard',idCardSchema);
