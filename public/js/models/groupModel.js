API.Models.GroupModel = Backbone.Model.extend({

    urlRoot: '/api/group',
    idAttribute: "_id",

    defaults: {
        title: '',
        yearEntered: '',
        yearEnded: '',
        memberStudent: ''
    },

    validate: function(attrs, options) {
        if (!attrs.title || !attrs.yearEntered || !attrs.memberStudent) {
            return "All fields are required";
        }
    }

});
