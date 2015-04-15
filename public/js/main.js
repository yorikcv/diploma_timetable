/*global BackboneExample, $*/

window.API = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    init: function() {
        'use strict';

        var mainRouter = new this.Routers.MainRouter();

        Backbone.history.start({pushState: true});

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
