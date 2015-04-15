API.Views.TeachersView = Backbone.View.extend({

    el: '#teacherPage',

    teacherTemplate: new EJS({
        url: '/tmpl/teacherTrow.ejs'
    }),

    events: {
        "click .openModalAdd": "clearFields",
        "click #addTeacher": "addTeacher",
        "click .editTeacherTable": "editTeacherTable"
    },

    initialize: function() {
        console.log("Initializing Teachers View");

        this.collection.fetchCollection();
        this.listenTo(this.collection, 'sync', this.render);

    },

    render: function() {
        this.$('tbody').html('');

        this.collection.each(function(teacherModel, key){
            teacherModel.set("count", key+1);
            this.$('tbody').append(new API.Views.TeacherView({model: teacherModel}).render());
        });
    },

    addTeacher: function(event) {
        event.preventDefault();
        var teacher = {
            name: {
                first: this.$('#inputFirstName').val(),
                last: this.$('#inputLastName').val(),
                middle: this.$('#inputMiddleName').val()
            }
        }

        var teacherModel = new API.Models.TeacherModel(teacher, {
            validate: true
        });

        if (teacherModel.validationError) return this.showErrorMassege(teacherModel.validationError);

        var that = this;

        teacherModel.save(null, {
            error: function() {
                that.showErrorMassege("Cant connect to server");
            },
            success: function() {
                that.collection.add(teacherModel);
                $('#addTeacherModal').modal('hide');
            },
            wait: true
        });
    },

    editTeacherTable: function() {

    },

    showErrorMassege: function(message) {
        this.$('.alertError').html(message);
    },

    clearFields: function() {
        this.$('.alertError').html('');
        this.$('#inputFirstName').val('');
        this.$('#inputLastName').val('');
        this.$('#inputMiddleName').val('');
    }

});
