API.Models.SubjectModel = Backbone.Model.extend({

    urlRoot: '/api/subject',
    idAttribute: "_id",

    defaults: {
        name: '',
        teachers: []
    },

    validate: function(attrs, options) {
        if (!attrs.name || !attrs.teachers.length) {
            return "All fields are required (One or more teachers must be marked)";
        }
    }

});
