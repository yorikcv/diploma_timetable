API.Collections.AuditoriumsCollection = Backbone.Collection.extend({

    url: '/api/auditoriums',
    model: API.Models.AuditoriumModel,

    initialize: function() {

    },

    fetchCollection: function() {
        this.fetch();
    }

});
