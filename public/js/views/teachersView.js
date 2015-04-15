API.Views.TeachersView = Backbone.View.extend({

    el: '#teacherPage',

    teacherTemplate: new EJS({
        url: '/tmpl/teacherTrow.ejs'
    }),

    initialize: function() {
        console.log("Initializing Teachers View");

        this.collection.fetchCollection();
        this.listenTo(this.collection, 'sync', this.render);


        this.$('.openModalAdd').on('click', $.proxy(this.clearFields, this));
        this.$('#addTeacher').on('click', $.proxy(this.addTeacher, this));

    },

    render: function() {

        console.log(this.collection.models);
        var listHtml = this.teacherTemplate.render({
            teachers: this.collection.toJSON()
        });

        this.$('tbody').html(listHtml);
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
                $('.modal').modal('hide');
            },
            wait: true
        });
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
