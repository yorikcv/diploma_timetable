API.Views.AuditoriumView = Backbone.View.extend({
    tagName: 'tr',

    auditoriumTemplate: new EJS({
        url: '/tmpl/auditoriumTrow.ejs'
    }),

    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
    },

    events: {
        "click .editAuditorium": "editAuditorium",
        "click .deleteAuditorium": "deleteAuditorium"
    },

    editAuditorium: function() {
        $('.alertError').html('');
        var auditorium = this.model.toJSON();
        $('#editName').val(auditorium.name);
        $('#editStudentCount').val(auditorium.studentCount);

        $('#editAuditoriumModal').modal('show');
        $('#editAuditoriumModal #editAuditorium').off().on("click", $.proxy(this.saveEditedAuditorium, this));
    },

    saveEditedAuditorium: function() {
        event.preventDefault();
        var auditorium = {
            name: $('#editName').val(),
            studentCount: $('#editStudentCount').val()
        };

        this.model.set(auditorium, {
            validate: true
        });

        if (this.model.validationError) return this.showErrorMassege(this.model.validationError);

        var that = this;

        this.model.save(null, {
            error: function() {
                that.showErrorMassege("Cant connect to server");
            },
            success: function() {
                $('#editAuditoriumModal').modal('hide');
            },
            wait: true
        });


    },

    deleteAuditorium: function() {
        var auditorium = this.model.toJSON();

        $('#deleteAuditoriumModal p').html(auditorium.name);

        $('#deleteAuditoriumModal').modal('show');

        $('#deleteAuditoriumModal .deleteAuditoriumConfirm').off().on("click", $.proxy(this.destroyAuditorium, this));
    },

    destroyAuditorium: function() {
        this.model.destroy({
            success: function(model, response) {
                $('#deleteAuditoriumModal').modal('hide');
            },
            wait: true
        });
    },

    showErrorMassege: function(message) {
        $('.alertError').html(message);
    },

    render: function() {
        this.$el.html(this.auditoriumTemplate.render({
            auditorium: this.model.toJSON()
        }));
        return this.el;
    }
});
