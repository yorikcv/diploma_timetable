API.Models.SubjectModel = Backbone.Model.extend({

    urlRoot: '/api/subject',
    idAttribute: "_id",

    defaults: {
        title: '',
        codeSubject: '',
        typeOfControl: '',
        semester: '',
        teacher: '',
        speciality: ''
    },

    validate: function(attrs, options) {
        if (!attrs.title || !attrs.codeSubject || !attrs.typeOfControl || !attrs.semester || !attrs.teacher || !attrs.speciality) {
            return "All fields are required (One or more teachers must be marked)";
        }
    }

});
