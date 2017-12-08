let express = require('express');
let app = express();
let logger = require('morgan');
let fs= require('fs');
let path = require('path');

// let accessLogStream = fs.createWriteStream(path.join(__dirname, '/logs/access.log'), {flags: 'a'});
// app.use(logger('default',{stream: accessLogStream}));
app.use(logger('default'));

app.use(require('body-parser')());
app.set('port',process.env.PORT || 3000);
app.set('x-powered-by', false);

//数据库连接
let mongoose = require('mongoose');
let options={
    keepAlive:1,
    useMongoClient: true
};
mongoose.Promise = require('bluebird');
// mongoose.connect('mongodb://superadmin:lkk123@localhost:27017/admin',options);
// mongoose.connect('mongodb://lkk:lkk123@localhost:27017/mongoose',options);
// mongoose.connect('mongodb://localhost:27017/mongoose',options);


let importer = require('./lib/importer')();
let manyRouter = importer('./routes');
for(let akey in manyRouter){
    let nowRouter = manyRouter[akey];
    new nowRouter(app,'').initRouter();
}



app.listen(app.get('port'),function () {
    console.log('Express Started on http://localhost:'+app.get('port')+'; press Ctrl + C to terminate');
});

