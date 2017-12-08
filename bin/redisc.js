let redis = require('redis'),
    RDS_PORT = 6379,
    RDS_HOST = 'localhost',
    RDS_OPTS = {auth_pass: 'lkkchen'},
    redisClient = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);

redisClient.on('connect',function(){
    redisClient.set('author','Wilson',redis.print);
    redisClient.get('author',redis.print);
    console.log('connect');
});

redisClient.on('ready',function (err) {
    console.log('redis ok');
});

module.exports = redisClient;
