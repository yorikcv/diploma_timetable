API.Views.GroupsView = Backbone.View.extend({

    el: '#groupPage',

    groupTemplate: new EJS({
        url: '/tmpl/groupTrow.ejs'
    }),

    specialitySelectTemplate: new EJS({
        url: 'tmpl/specialitySelect.ejs'
    }),

    SpecialityCollection: new API.Collections.SpecialitiesCollection(),

    events: {
        "click .openModalAdd": "clearFields",
        "click #addGroup": "addGroup"
    },

    propertyGroup: null,

    initialize: function() {
        console.log("Initializing Groups View");
        $('#addGroupModal .datepickerInput').datepicker({
            startView: 2,
            minViewMode: 2,
            todayBtn: "linked",
            orientation: "top auto",
            keyboardNavigation: false,
            daysOfWeekDisabled: "5,6",
            autoclose: true,
            todayHighlight: true,
            toggleActive: true
        }).on("hide", function(e) {
            var timeEntered = moment("2000-09-01").set('year', moment(e.date).get('year')),
                timeEnded = moment().set('month', 5).set('date', 30).set('year', moment(e.date).get('year') + 5);
            $('#addGroupModal #inputYearEntered').datepicker('setDate', new Date(timeEntered.toString()));
            $('#addGroupModal #inputYearEnded').datepicker('setDate', new Date(timeEnded.toString()));

        });

        this.collection.fetchCollection();
        this.listenTo(this.collection, 'sync', this.render);

    },

    render: function() {
        this.$('tbody').html('');

        if (this.collection.toJSON().length) {
            this.$('#listIsClear').hide();

            this.collection.each(function(groupModel, key) {
                groupModel.set("count", key + 1);
                this.$('tbody').append(new API.Views.GroupView({
                    model: groupModel
                }).render());
            });
        } else {
            this.$('#listIsClear').show();
        }


    },

    addGroup: function(event) {
        event.preventDefault();
        var property = this.$('.property input:checked').attr('val');
        if (!property) {
            property = null;
        }
        var specialityCid = this.$('#selectSpeciality').val(),
            group = {
                title: this.$('#inputGroupTitle').val(),
                memberStudent: this.$('#inputStudentCount').val(),
                specialityId: this.SpecialityCollection.get(specialityCid).id,
                yearEntered: this.$('#inputYearEntered').val(),
                yearEnded: this.$('#inputYearEnded').val()
            };

        console.log(group);

        var groupModel = new API.Models.GroupModel(group, {
            validate: true
        });

        console.log(groupModel);

        if (groupModel.validationError) return this.showErrorMassege(groupModel.validationError);

        var that = this;

        groupModel.save(null, {
            error: function(model, err) {
                that.showErrorMassege("Cant connect to server");
                console.log(err);
            },
            success: function() {
                that.collection.add(groupModel);
                $('#addGroupModal').modal('hide');
            },
            wait: true
        });
    },

    loadSpecialityToSelect: function() {
        var selectTemplate = this.specialitySelectTemplate,
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

    showErrorMassege: function(message) {
        this.$('.alertError').html(message);
    },

    clearFields: function() {
        this.$('#selectSpeciality').html('');
        this.$('.alertError').html('');
        this.$('input').val('');

        this.loadSpecialityToSelect();
    }

});
