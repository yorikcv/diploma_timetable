API.Views.SubjectsView = Backbone.View.extend({

    el: '#subjectPage',

    subjectTemplate: new EJS({
        url: '/tmpl/subjectTrow.ejs'
    }),
    selectTeacherTemplate: new EJS({
        url: '/tmpl/selectTeacher.ejs'
    }),

    events: {
        "click .openModalAdd": "clearFields",
        "click #addSubject": "addSubject"
    },

    initialize: function() {
        console.log("Initializing Subjects View");

        this.collection.fetchCollection();
        this.listenTo(this.collection, 'sync', this.render);

    },

    render: function() {
        this.$('.subjectList').html('');

        if (this.collection.toJSON().length) {
            // this.$('#listIsClear').hide();

            this.collection.each(function(subjectModel, key) {
                subjectModel.set("count", key + 1);
                this.$('.subjectList').append(new API.Views.SubjectView({
                    model: subjectModel
                }).render());
            });
        } else {
            // this.$('#listIsClear').show();
        }


    },

    addSubject: function(event) {
        event.preventDefault();
        var subject = {
            name: this.$('#inputSubjectName').val(),
            studentCount: this.$('#inputStudentCount').val()
        };

        var subjectModel = new API.Models.SubjectModel(subject, {
            validate: true
        });

        if (subjectModel.validationError) return this.showErrorMassege(subjectModel.validationError);

        var that = this;

        subjectModel.save(null, {
            error: function() {
                that.showErrorMassege("Cant connect to server");
            },
            success: function() {
                that.collection.add(subjectModel);
                $('#addSubjectModal').modal('hide');
            },
            wait: true
        });
    },

    showErrorMassege: function(message) {
        this.$('.alertError').html(message);
    },

    clearFields: function() {
        this.$('.alertError').html('');
        this.$('#inputName').val('');
    }

});
