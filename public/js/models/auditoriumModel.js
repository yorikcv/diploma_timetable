API.Models.AuditoriumModel = Backbone.Model.extend({

    urlRoot: '/api/auditorium',
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
