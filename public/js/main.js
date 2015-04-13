/*global BackboneExample, $*/

window.API = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    init: function() {
        'use strict';
        Backbone.history.start();
        var loginView = new this.Views.LoginView();
        
        $('#logoutButton').click(function() {
            $.ajax({
                url: '/logout',
                type: 'POST',
                statusCode: {
                    200: function() {
                        window.location.replace('/login');
                    }
                }
            });
        });
    }
};

$(document).ready(function() {
    'use strict';
    $.material.init();
    API.init();
});
