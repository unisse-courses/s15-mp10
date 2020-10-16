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
                            alert('Success');
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

    });

}(jQuery));