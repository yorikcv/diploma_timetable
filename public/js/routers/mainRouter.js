API.Routers.MainRouter = Backbone.Router.extend({

    initialize: function() {
        console.log('Initializing Main Router');
    },

    routes: {
        "login": "login",
        "teachers": "teachers",
        "auditoriums": "auditoriums",
        "subjects": "subjects",
        "groups": "groups"
    },

    login: function() {
        var loginView = new API.Views.LoginView();
    },

    teachers: function() {
        Teachers = new API.Views.TeachersView({
            collection: new API.Collections.TeachersCollection()
        });
    },

    auditoriums: function() {
        Auditoriums = new API.Views.AuditoriumsView({
            collection: new API.Collections.AuditoriumsCollection()
        });
    },

    subjects: function() {
        Subjects = new API.Views.SubjectsView({
            collection: new API.Collections.SubjectsCollection()
        });
    },
    groups: function() {
        Groups = new API.Views.GroupsView({
            collection: new API.Collections.GroupsCollection()
        });
    }
});
