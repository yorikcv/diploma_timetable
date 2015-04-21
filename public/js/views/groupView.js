API.Views.GroupView = Backbone.View.extend({
    tagName: 'tr',

    groupTemplate: new EJS({
        url: '/tmpl/groupTrow.ejs'
    }),

    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
    },

    events: {
        "click .editGroup": "editGroup",
        "click .deleteGroup": "deleteGroup"
    },

    editGroup: function() {
        $('.alertError').html('');
        var group = this.model.toJSON();
        $('#editName').val(group.name);
        $('#editStudentCount').val(group.studentCount);

        $('#editGroupModal').modal('show');
        $('#editGroupModal #editGroup').off().on("click", $.proxy(this.saveEditedGroup, this));
    },

    saveEditedGroup: function() {
        event.preventDefault();
        var group = {
            name: $('#editName').val(),
            studentCount: $('#editStudentCount').val()
        };

        this.model.set(group, {
            validate: true
        });

        if (this.model.validationError) return this.showErrorMassege(this.model.validationError);

        var that = this;

        this.model.save(null, {
            error: function() {
                that.showErrorMassege("Cant save. Error on the server");
            },
            success: function() {
                $('#editGroupModal').modal('hide');
            },
            wait: true
        });


    },

    deleteGroup: function() {
        var group = this.model.toJSON();

        $('#deleteGroupModal p').html(group.title);

        $('#deleteGroupModal').modal('show');

        $('#deleteGroupModal .deleteGroupConfirm').off().on("click", $.proxy(this.destroyGroup, this));
    },

    destroyGroup: function() {
        this.model.destroy({
            success: function(model, response) {
                $('#deleteGroupModal').modal('hide');
            },
            wait: true
        });
    },

    showErrorMassege: function(message) {
        $('.alertError').html(message);
    },

    render: function() {
        this.$el.html(this.groupTemplate.render({
            group: this.model.toJSON()
        }));
        return this.el;
    }
});
