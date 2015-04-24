API.Collections.SpecialitiesCollection = Backbone.Collection.extend({

    url: '/api/specialities',
    model: API.Models.SpecialityModel,

    initialize: function() {

    },

    fetchCollection: function() {
        this.fetch();
    }

});
