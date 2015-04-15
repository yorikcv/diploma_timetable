API.Routers.MainRouter = Backbone.Router.extend({

    initialize: function() {
        console.log('Initializing Main Router');
    },

    routes: {
        "login": "login",
        "teachers": "teachers"
    },

    login: function() {
        var loginView = new API.Views.LoginView();
    },

    teachers: function() {

        window.teacherModel = new API.Models.TeacherModel({
            name: {
                first: 'Танасюк',
                last: 'Юлія',
                middle: 'Володимирівна'
            },
            _id: '552e3169591ee0700c6bdda8'
        });



        window.teachersColection = new API.Collections.TeachersCollection({
            model: new API.Models.TeacherModel()
        });


        window.Teacher = new API.Views.TeachersView({
            collection: teachersColection
        });


    }
});
