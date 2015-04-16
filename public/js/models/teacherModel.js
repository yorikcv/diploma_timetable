API.Models.TeacherModel = Backbone.Model.extend({

    urlRoot: '/api/teacher',
    idAttribute: "_id",

    defaults: {
        name: {
            first: '',
            last: '',
            middle: ''
        }
    },

    validate: function(attrs, options) {
        if (!attrs.name.first || !attrs.name.last || !attrs.name.middle) {
            return "All fields are required";
        }
    }

});
