module.exports = function(app) {

    var route = {},
        checkAuth = require('../middleware/checkAuth');
    // index.html
    route.index = function(req, res, next) {

        res.render('index');

    };

    app.get('/', checkAuth, route.index);
};
