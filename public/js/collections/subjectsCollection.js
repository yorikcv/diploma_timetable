API.Collections.SubjectsCollection = Backbone.Collection.extend({

    url: '/api/subjects',
    model: API.Models.SubjectModel,

    initialize: function() {

    },

    fetchCollection: function() {
        this.fetch();
    }

});
