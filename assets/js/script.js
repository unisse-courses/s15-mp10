(function ($) {

    $(function () {
        // DESIGN
        //hide navbar
        $(".navscroll").hide();
        //fade in navbar
        $(function () {
            $(window).on('scroll', function () {
                if ($(this).scrollTop() > 100) {
                    $('.navscroll').fadeIn();
                    $('.jumbo').prop("disabled", true);
                } else {
                    $('.navscroll').fadeOut();
                    $('.jumbo').prop("disabled", false);
                }
            });
        });
        //hide navbar
        $(".bioscroll").hide();
        //fade in navbar
        $(function () {
            $(window).on('scroll', function () {
                if ($(this).scrollTop() > 300) {
                    $('.bioscroll').fadeIn();
                    $('.jumbo').prop("disabled", true);
                } else {
                    $('.bioscroll').fadeOut();
                    $('.jumbo').prop("disabled", false);
                }
            });
        });

        $('form').on('submit', function (e) {
            e.preventDefault();
        });
        // FEATURES
        $('#login_submit').on('click', function () {
            var email = $('#login_email').val();
            var pass = $('#login_password').val();
            var valid = true;
            // VALIDATION
            if (!validator.isEmail(email) || validator.isEmpty(pass)) {
                valid = false;
                alert('The email or password does not match any account');
            }
            // POST
            if (valid) {
                $.post('/login', {
                    email: email,
                    pass: pass
                }, function (result) {
                    switch (result.status) {
                        case 200: {
                            window.location.href = '/';
                            break;
                        }
                        case 400: {
                            alert('Error 400: ' + result.msg);
                            break;
                        }
                        case 500: {
                            alert('Error 500: ' + result.msg);
                            break;
                        }
                    }
                });
            }
        });

        $('#userSignup_submit').on('click', function () {
            var email = $('#userSignup_email').val();
            var username = $('#userSignup_username').val();
            var pass = $('#userSignup_password').val();
            var pass_repeat = $('#userSignup_password-repeat').val();
            var valid = true;
            // VALIDATION
            if (!validator.isEmail(email) || validator.isEmpty(username) || validator.isEmpty(pass) || validator.isEmpty(pass_repeat)) {
                valid = false;
                alert('There are incorrect inputs');
            } else if(pass != pass_repeat){
                valid = false;
                alert('Passwords does not match');
            }

            if (valid) {
                $.post('/signup', {
                    email: email,
                    username: username,
                    pass: pass,
                }, function (result) {});
            }
        });
    });

}(jQuery));