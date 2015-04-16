API.Routers.MainRouter = Backbone.Router.extend({

    initialize: function() {
        console.log('Initializing Main Router');
    },

    routes: {
        "login": "login",
        "teachers": "teachers",
        "auditoriums": "auditoriums"
    },

    login: function() {
        var loginView = new API.Views.LoginView();
    },

    teachers: function() {
        Teachers = new API.Views.TeachersView({
            collection: new API.Collections.TeachersCollection({
                model: new API.Models.TeacherModel()
            })
        });
    },

    auditoriums: function() {
        Auditoriums = new API.Views.AuditoriumsView({
            collection: new API.Collections.AuditoriumsCollection({
                model: new API.Models.AuditoriumModel()
            })
        });
    },
});
