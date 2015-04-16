API.Views.SubjectsView = Backbone.View.extend({

    el: '#subjectPage',

    subjectTemplate: new EJS({
        url: '/tmpl/subjectTrow.ejs'
    }),

    selectTeacherTemplate: new EJS({
        url: '/tmpl/selectTeacher.ejs'
    }),

    teachersColleaction: new API.Collections.TeachersCollection(),

    events: {
        "click .openModalAdd": "clearFields",
        "click #addSubject": "addSubject"
    },

    initialize: function() {
        console.log("Initializing Subjects View");

        this.collection.fetchCollection();
        this.teachersColleaction.fetchCollection();
        this.listenTo(this.collection, 'sync', this.render);
        this.listenTo(this.teachersColleaction, 'sync', this.loadTeachers);

    },

    render: function() {
        this.$('.subjectList').html('');

        if (this.collection.toJSON().length) {
            this.$('#listIsClear').hide();

            this.collection.each(function(subjectModel, key) {
                subjectModel.set("count", key + 1);
                this.$('.subjectList').append(new API.Views.SubjectView({
                    model: subjectModel
                }).render());
            });
        } else {
            this.$('#listIsClear').show();
        }

    },

    addSubject: function(event) {
        event.preventDefault();
        var subject = {
            name: this.$('#inputSubjectName').val(),
            teachers: []
        };

        var that = this;

        $('.listTeachers input:checked').each(function(index, input) {
            subject.teachers.push(that.teachersColleaction.get($(input).attr('model')).id);
        });

        var subjectModel = new API.Models.SubjectModel(subject, {
            validate: true
        });

        console.log(subjectModel);

        if (subjectModel.validationError) return this.showErrorMassege(subjectModel.validationError);

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
        this.$('#inputSubjectName').val('');
        this.$('.listTeachers input:checked').prop('checked', false);
    },

    loadTeachers: function() {
        var that = this;

        this.$('.listTeachers').html('');
        this.teachersColleaction.each(function(model, index) {
            var teacher = model.toJSON();
            teacher.cid = model.cid;
            that.$('.listTeachers').append(that.selectTeacherTemplate.render(teacher));
        });
    }

});
