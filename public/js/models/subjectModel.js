API.Models.SubjectModel = Backbone.Model.extend({

    urlRoot: '/api/subject',
    idAttribute: "_id",

    defaults: {
        name: '',
        studentCount: ''
    },

    validate: function(attrs, options) {
        if (!attrs.name || !attrs.studentCount) {
            return "All fields are required";
        }
    }

});
