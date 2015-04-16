API.Views.SubjectView = Backbone.View.extend({

    subjectTemplate: new EJS({
        url: '/tmpl/subjectTrow.ejs'
    }),

    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
    },

    events: {
        // "click .editSubject": "editSubject",
        "click .deleteSubject": "deleteSubject"
    },

    // editSubject: function() {
    //     $('.alertError').html('');
    //     var subject = this.model.toJSON();
    //     $('#editName').val(subject.name);
    //     $('#editStudentCount').val(subject.studentCount);

    //     $('#editSubjectModal').modal('show');
    //     $('#editSubjectModal #editSubject').off().on("click", $.proxy(this.saveEditedSubject, this));
    // },

    // saveEditedSubject: function() {
    //     event.preventDefault();
    //     var subject = {
    //         name: $('#editName').val(),
    //         studentCount: $('#editStudentCount').val()
    //     };

    //     this.model.set(subject, {
    //         validate: true
    //     });

    //     if (this.model.validationError) return this.showErrorMassege(this.model.validationError);

    //     var that = this;

    //     this.model.save(null, {
    //         error: function() {
    //             that.showErrorMassege("Cant connect to server");
    //         },
    //         success: function() {
    //             $('#editSubjectModal').modal('hide');
    //         },
    //         wait: true
    //     });


    // },

    deleteSubject: function() {
        var subject = this.model.toJSON();

        $('#deleteSubjectModal p').html(subject.name);

        $('#deleteSubjectModal').modal('show');

        $('#deleteSubjectModal .deleteSubjectConfirm').off().on("click", $.proxy(this.destroySubject, this));
    },

    destroySubject: function() {
        this.model.destroy({
            success: function(model, response) {
                $('#deleteSubjectModal').modal('hide');
            },
            wait: true
        });
    },

    showErrorMassege: function(message) {
        $('.alertError').html(message);
    },

    render: function() {
        this.$el.html(this.subjectTemplate.render({
            subject: this.model.toJSON()
        }));
        return this.el;
    }
});
