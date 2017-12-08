let express = require('express');

class BaseRouter {
    constructor(app, baseUrl){
        this.app = app;
        this.router = express.Router();
        this.baseUrl  = baseUrl;
        this.services = [];
    }

    initRouter() {
        let _this = this;
        _this.services.forEach((service)=>{
            if(!service.handler){return false;}

            let url = service.url;
            switch (service.type.toLowerCase()) {
                case 'get': {
                    _this.router.get(url, service.handler);
                    break;
                }
                case 'post': {
                    _this.router.post(url, service.handler);
                    break;
                }
                case 'put': {
                    _this.router.put(url, service.handler);
                    break;
                }
                case 'del': {
                    _this.router.del(url, service.handler);
                    break;
                }
                default: {
                    //nothing
                }
            }
        });
        _this.app.use(`/${_this.baseUrl === 'index' ? '' : _this.baseUrl}`, _this.router);
    }
}

module.exports = BaseRouter;