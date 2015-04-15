API.Collections.TeachersCollection = Backbone.Collection.extend({

    url: '/api/teachers',
    model: API.Models.TeacherModel,

    initialize: function() {

    },

    fetchCollection: function() {
        this.fetch();
    }

});
