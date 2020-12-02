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
            } else if (pass != pass_repeat) {
                valid = false;
                alert('Passwords does not match');
            }

            if (valid) {
                $.post('/userSignup', {
                    email: email,
                    username: username,
                    pass: pass,
                }, function (result) {
                    switch (result.status) {
                        case 200: {
                            window.location.href = '/';
                            break;
                        }
                        case 400: {
                            alert('case 400: ' + result.msg);
                            break;
                        }
                        case 500: {
                            alert('Error ' + result.msg);
                            break;
                        }
                    }
                });
            }
        });

        $('#userSignup_store').on('click', function () {
            var email = $('#userSignup_email').val();
            var username = $('#userSignup_username').val();
            var pass = $('#userSignup_password').val();
            var pass_repeat = $('#userSignup_password-repeat').val();
            var valid = true;
            // VALIDATION
            if (!validator.isEmail(email) || validator.isEmpty(username) || validator.isEmpty(pass) || validator.isEmpty(pass_repeat)) {
                valid = false;
                alert('There are incorrect inputs');
            } else if (pass != pass_repeat) {
                valid = false;
                alert('Passwords does not match');
            }

            if (valid) {
                $.post('/userSignup', {
                    email: email,
                    username: username,
                    pass: pass,
                }, function (result) {
                    switch (result.status) {
                        case 200: {
                            $.get('/storeSignup/' + result.userID, function (res) {
                                $('.content').html(res);
                            });
                            break;
                        }
                        case 400: {
                            alert('case 400: ' + result.msg);
                            break;
                        }
                        case 500: {
                            alert('Error ' + result.msg);
                            break;
                        }
                    }
                });
            }
        });

        $('#storeSignup_submit').on('click', function () {
            var storeName = $('#storeSignup_name').val();
            var storeDesc = $('#storeSignup_description').val();


            if (validator.isEmpty(storeName) || validator.isEmpty(storeDesc)) {
                alert('There are empty inputs');
            } else {
                $.post('/storeSignup_store', {
                    storeName: storeName,
                    storeDesc: storeDesc
                }, function (result) {
                    window.location.href = '/';
                });
            }

        });

        $('#userProf_storeCreate').on('click', function () {
            var userID = $('#userProf_userID').val();
            console.log(userID);
            $.get('/storeSignup/' + userID, function (res) {
                $('.content').html(res);
            });
        });

        $('#userProf_editOK').on('click', function () {
            var username = $('#userProf_modalUsername').val();
            var bio = $('#userProf_modalBio').val();

            // DEBUG
            console.log('username: ' + username);
            console.log('bio: ' + bio);

            $.post('/userProf_edit', {
                username: username,
                bio: bio
            }, function (result) {
                window.location.href = '/profile';
            });
        });
    });

}(jQuery));