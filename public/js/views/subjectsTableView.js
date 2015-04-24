API.Views.SubjectsView = Backbone.View.extend({

    el: '#subjectPage',

    subjectTemplate: new EJS({
        url: '/tmpl/subjectTrow.ejs'
    }),

    selectTeacherTemplate: new EJS({
        url: '/tmpl/teacherSelect.ejs'
    }),
    selectSpecialityTemplate: new EJS({
        url: '/tmpl/specialitySelect.ejs'
    }),

    TeachersCollection: new API.Collections.TeachersCollection(),
    SpecialityCollection: new API.Collections.SpecialitiesCollection(),

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
        var teacherCid = this.$('#selectTeacher').val(),
            specialityCid = this.$('#selectSpeciality').val(),
            subject = {
                title: this.$('#inputSubjectTitle').val(),
                codeSubject: this.$('#inputCodeSubject').val(),
                typeOfControl: this.$('#selectTypeOfControl').val(),
                semester: this.$('#selectSemester').val(),
                teacher: this.TeachersCollection.get(teacherCid).id,
                speciality: this.SpecialityCollection.get(specialityCid).id
            };

        var that = this;

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
        this.$('#addSubjectModal .selectLoaded').html('');
        this.loadSpecialityToSelect();
        this.loadTeacherToSelect();
        this.$('.alertError').html('');
        this.$('#addSubjectModal input').val('');
    },

    loadSpecialityToSelect: function() {
        var selectTemplate = this.selectSpecialityTemplate,
            selectInput = this.$('#selectSpeciality');

        this.SpecialityCollection.fetch({
            success: function(collection) {
                collection.each(function(model, index) {
                    var specialityObject = model.toJSON();
                    specialityObject.cid = model.cid;
                    selectInput.append(selectTemplate.render({
                        speciality: specialityObject
                    }));
                });
            }
        });

    },

    loadTeacherToSelect: function() {
        var selectTemplate = this.selectTeacherTemplate,
            selectInput = this.$('#selectTeacher');

        this.TeachersCollection.fetch({
            success: function(collection) {
                collection.each(function(model, index) {
                    var teacherObject = model.toJSON();
                    teacherObject.cid = model.cid;
                    selectInput.append(selectTemplate.render({
                        teacher: teacherObject
                    }));
                });
            }
        });

    },

});
