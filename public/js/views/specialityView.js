API.Views.SpecialityView = Backbone.View.extend({
    tagName: 'tr',

    specialityTemplate: new EJS({
        url: '/tmpl/specialityTrow.ejs'
    }),

    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
    },

    events: {
        "click .editSpeciality": "editSpeciality",
        "click .deleteSpeciality": "deleteSpeciality"
    },

    editSpeciality: function() {
        $('.alertError').html('');
        var speciality = this.model.toJSON();
        $('#editName').val(speciality.name);
        $('#editStudentCount').val(speciality.studentCount);

        $('#editSpecialityModal').modal('show');
        $('#editSpecialityModal #editSpeciality').off().on("click", $.proxy(this.saveEditedSpeciality, this));
    },

    saveEditedSpeciality: function() {
        event.preventDefault();
        var speciality = {
            name: $('#editName').val(),
            studentCount: $('#editStudentCount').val()
        };

        this.model.set(speciality, {
            validate: true
        });

        if (this.model.validationError) return this.showErrorMassege(this.model.validationError);

        var that = this;

        this.model.save(null, {
            error: function() {
                that.showErrorMassege("Cant connect to server");
            },
            success: function() {
                $('#editSpecialityModal').modal('hide');
            },
            wait: true
        });


    },

    deleteSpeciality: function() {
        var speciality = this.model.toJSON();

        $('#deleteSpecialityModal p').html(speciality.title);

        $('#deleteSpecialityModal').modal('show');

        $('#deleteSpecialityModal .deleteSpecialityConfirm').off().on("click", $.proxy(this.destroySpeciality, this));
    },

    destroySpeciality: function() {
        this.model.destroy({
            success: function(model, response) {
                $('#deleteSpecialityModal').modal('hide');
            },
            wait: true
        });
    },

    showErrorMassege: function(message) {
        $('.alertError').html(message);
    },

    render: function() {
        this.$el.html(this.specialityTemplate.render({
            speciality: this.model.toJSON()
        }));
        return this.el;
    }
});
