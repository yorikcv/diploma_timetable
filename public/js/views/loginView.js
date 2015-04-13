API.Views.LoginView = Backbone.View.extend({

    el: '#loginForm',

    initialize: function() {
        console.log('Initializing Login View');
        this.$('.alertError').hide();
    },

    events: {
        "click #loginButton": "login"
    },

    login: function(event) {
        event.preventDefault(); // Don't let this button submit the form
        $('.alertError').hide(); // Hide any errors on a new submit
        var url = 'login';
        console.log('Loggin in... ');
        var formValues = {
            login: $('#inputLogin').val(),
            password: $('#inputPassword').val()
        };

        $.ajax({
            url: url,
            type: 'POST',
            dataType: "json",
            data: formValues,
            statusCode: {
                200: function() {
                    window.location.replace('/');
                },
                401: function() {
                	$('.alertError').show();
                    $('.alertError').text("Login or password is faild");
                }
            }
        });


    }
});
