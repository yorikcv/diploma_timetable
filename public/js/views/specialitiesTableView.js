API.Views.SpecialitiesView = Backbone.View.extend({

    el: '#specialityPage',

    specialityTemplate: new EJS({
        url: '/tmpl/specialityTrow.ejs'
    }),

    events: {
        "click .openModalAdd": "clearFields",
        "click #addSpeciality": "addSpeciality"
    },

    initialize: function() {
        console.log("Initializing Specialities View");

        this.collection.fetchCollection();
        this.listenTo(this.collection, 'sync', this.render);

    },

    render: function() {
        this.$('tbody').html('');

        if (this.collection.toJSON().length) {
            this.$('#listIsClear').hide();

            this.collection.each(function(specialityModel, key) {
                specialityModel.set("count", key + 1);
                this.$('tbody').append(new API.Views.SpecialityView({
                    model: specialityModel
                }).render());
            });
        } else {
            this.$('#listIsClear').show();
        }


    },

    addSpeciality: function(event) {
        event.preventDefault();
        var speciality = {
            title: this.$('#inputSpecialityTitle').val(),
            codeDepartment: this.$('#inputCodeDepartment').val()
        };

        var specialityModel = new API.Models.SpecialityModel(speciality, {
            validate: true
        });

        if (specialityModel.validationError) return this.showErrorMassege(specialityModel.validationError);

        var that = this;

        specialityModel.save(null, {
            error: function(model, err) {
                that.showErrorMassege("Cant connect to server");
            },
            success: function() {
                that.collection.add(specialityModel);
                $('#addSpecialityModal').modal('hide');
            },
            wait: true
        });
    },

    showErrorMassege: function(message) {
        this.$('.alertError').html(message);
    },

    clearFields: function() {
        this.$('.alertError').html('');
        this.$('#addSpecialityModal input').val('')
    }

});
