API.Models.SpecialityModel = Backbone.Model.extend({

    urlRoot: '/api/speciality',
    idAttribute: "_id",

    defaults: {
        title: '',
        codeDepartment: ''
    },

    validate: function(attrs, options) {
        if (!attrs.title || !attrs.codeDepartment) {
            return "All fields are required";
        }
    }

});
