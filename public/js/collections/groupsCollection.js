API.Collections.GroupsCollection = Backbone.Collection.extend({

    url: '/api/groups',
    model: API.Models.GroupModel,

    initialize: function() {

    },

    fetchCollection: function() {
        this.fetch();
    }

});
