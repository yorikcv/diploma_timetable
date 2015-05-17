API.Views.AuditoriumsView = Backbone.View.extend({

    el: '#auditoriumPage',

    auditoriumTemplate: new EJS({
        url: '/tmpl/auditoriumTrow.ejs'
    }),

    events: {
        "click .openModalAdd": "clearFields",
        "click #addAuditorium": "addAuditorium"
    },

    initialize: function() {
        console.log("Initializing Auditoriums View");

        this.collection.fetchCollection();
        this.listenTo(this.collection, 'sync', this.render);

    },

    render: function() {
        this.$('tbody').html('');

        this.collection.sortBy(function() {
            return name;
        });

        if (this.collection.toJSON().length) {
            this.$('#listIsClear').hide();

            this.collection.each(function(auditoriumModel, key) {
                auditoriumModel.set("count", key + 1);
                this.$('tbody').append(new API.Views.AuditoriumView({
                    model: auditoriumModel
                }).render());
            });
        } else {
            this.$('#listIsClear').show();
        }


    },

    addAuditorium: function(event) {
        event.preventDefault();
        var auditorium = {
            name: this.$('#inputAuditoriumName').val(),
            studentCount: this.$('#inputStudentCount').val()
        };

        var auditoriumModel = new API.Models.AuditoriumModel(auditorium, {
            validate: true
        });

        if (auditoriumModel.validationError) return this.showErrorMassege(auditoriumModel.validationError);

        var that = this;

        auditoriumModel.save(null, {
            error: function(model, err) {
                that.showErrorMassege("Cant connect to server");
            },
            success: function() {
                that.collection.add(auditoriumModel);
                $('#addAuditoriumModal').modal('hide');
            },
            wait: true
        });
    },

    showErrorMassege: function(message) {
        this.$('.alertError').html(message);
    },

    clearFields: function() {
        this.$('.alertError').html('');
        this.$('#inputAuditoriumName').val('');
        this.$('#inputStudentCount').val('');
    }

});
