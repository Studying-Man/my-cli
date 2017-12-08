
let BaseService = require('../lib/baseService');
let Service = new BaseService();

Service.testApi = function (req,res) {
    Service.resSuccess(res,'OK');
};












module.exports = Service;
