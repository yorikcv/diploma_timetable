API.Views.GroupsView = Backbone.View.extend({

    el: '#groupPage',

    groupTemplate: new EJS({
        url: '/tmpl/groupTrow.ejs'
    }),

    events: {
        "click .openModalAdd": "clearFields",
        "click #addGroup": "addGroup"
    },

    initialize: function() {
        console.log("Initializing Groups View");
        $('#addGroupModal .datepickerInput').datepicker({
            startView: 2,
            minViewMode: 1,
            todayBtn: "linked",
            orientation: "top auto",
            keyboardNavigation: false,
            daysOfWeekDisabled: "5,6",
            autoclose: true,
            todayHighlight: true,
            toggleActive: true
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
        var group = {
            title: this.$('#inputGroupTitle').val(),
            memberStudent: this.$('#inputStudentCount').val(),
            yearEntered: this.$('#inputYearEntered').val(),
            yearEnded: this.$('#inputYearEnded').val()
            
        };

        var groupModel = new API.Models.GroupModel(group, {
            validate: true
        });

        if (groupModel.validationError) return this.showErrorMassege(groupModel.validationError);

        var that = this;

        groupModel.save(null, {
            error: function(model, err) {
                that.showErrorMassege("Cant connect to server");
            },
            success: function() {
                that.collection.add(groupModel);
                $('#addGroupModal').modal('hide');
            },
            wait: true
        });
    },

    showErrorMassege: function(message) {
        this.$('.alertError').html(message);
    },

    clearFields: function() {
        this.$('.alertError').html('');
        this.$('input').val('');
    }

});
