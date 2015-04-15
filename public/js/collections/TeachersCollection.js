API.Collections.TeachersCollection = Backbone.Collection.extend({

    url: '/api/teachers',

    initialize: function() {

    },

    fetchCollection: function() {
        this.fetch();
    }

});
