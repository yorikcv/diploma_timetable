API.Views.TeacherView = Backbone.View.extend({
    tagName: 'tr',

    teacherTemplate: new EJS({
        url: '/tmpl/teacherTrow.ejs'
    }),

    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
    },

    events: {
        "click .editTeacher": "editTeacher",
        "click .deleteTeacher": "deleteTeacher"
    },

    editTeacher: function() {
        $('.alertError').html('');
        var teacher = this.model.toJSON().name;
        $('#editFirstName').val(teacher.first);
        $('#editLastName').val(teacher.last);
        $('#editMiddleName').val(teacher.middle);

        $('#editTeacherModal').modal('show');
        $('#editTeacherModal #editTeacher').off().on("click", $.proxy(this.saveEditedTeacher, this));
    },

    saveEditedTeacher: function() {
        event.preventDefault();
        var teacher = {
            name: {
                first: $('#editFirstName').val(),
                last: $('#editLastName').val(),
                middle: $('#editMiddleName').val()
            }
        };

        this.model.set(teacher, {
            validate: true
        });

        if (this.model.validationError) return this.showErrorMassege(this.model.validationError);

        var that = this;

        this.model.save(null, {
            error: function() {
                that.showErrorMassege("Cant connect to server");
            },
            success: function() {
                $('#editTeacherModal').modal('hide');
            },
            wait: true
        });


    },

    deleteTeacher: function() {
        var teacher = this.model.toJSON().name;
        var nameTeacher = teacher.first + ' ' + teacher.last + ' ' + teacher.middle;
        $('#deleteTeacherModal p').html(nameTeacher);

        $('#deleteTeacherModal').modal('show');

        $('#deleteTeacherModal .deleteTeacherConfirm').off().on("click", $.proxy(this.destroyTeacher, this));
    },

    destroyTeacher: function() {
        this.model.destroy({
            success: function(model, response) {
                $('#deleteTeacherModal').modal('hide');
            },
            wait: true
        });
    },

    showErrorMassege: function(message) {
        $('.alertError').html(message);
    },

    render: function() {
        this.$el.html(this.teacherTemplate.render({
            teacher: this.model.toJSON()
        }));
        return this.el;
    }
});
