
let BaseRoute = require('../lib/baseRoute');
let Handerfuns = require('../service/testService');
let services = [];


services.push({
    type    : 'post',
    url     : '/testApi',
    handler : Handerfuns.testApi
});






class Router extends BaseRoute{
    constructor(app, baseUrl){
        super(app, baseUrl);
        this.services = services;
    }
}
module.exports = Router;















