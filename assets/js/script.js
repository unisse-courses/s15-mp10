function submitComment(reviewID){
    var comment = $('#reply'+reviewID+'_Content').val();
     if(validator.isEmpty(comment)){
        alert('Please provide a comment');
     }else{
        $.post('/submitComment', {reviewID:reviewID, comment:comment}, function(){});
     }
}

function scoreUp(reviewID) {
    $.post('/scoreUp/'+ reviewID, function () {
        location.reload();
    });
}

function scoreDown(reviewID) {
    $.post('/scoreDown/'+ reviewID, function () {
        location.reload();
    });
}

function newest() {
    $.post('/userSettings/sortReview/1', function () {
        location.reload();
    });
}

function oldest() {
    $.post('/userSettings/sortReview/2', function () {
        location.reload();
    });
}

function mostApproved() {
    $.post('/userSettings/sortReview/3', function () {
        location.reload();
    });
}

function leastApproved() {
    $.post('/userSettings/sortReview/4', function () {
        location.reload();
    });
}

function submitReview(storeID) {
    var rating = parseInt($('#myReview_NewRating').val());
    var content = $('#myReview_NewContent').val();

    if (validator.isEmpty(content)) {
        alert('Please provide a review');
    } else {
        if (rating) { //check if rating is given
            $.post('/submitReview', {
                storeID: storeID,
                rating: rating,
                content: content
            }, function (res) {
                switch (res.status) {
                    case 200:
                        location.reload();
                        break;
                    case 500:
                        alert('Something went wrong. Review not submitted.');
                        break;
                }
            });
        } else { //otherwise deny posting
            alert('Please rate the store');
        }
    }

}

function deleteReview(reviewID, storeID) {
    $.post('/deleteReview', {
        reviewID: reviewID,
        storeID: storeID
    }, function (res) {
        switch (res.status) {
            case 200:
                location.reload();
                break;
            case 500:
                alert('Something went wrong. Review not deleted.');
                break;
        }
    });
}

function editReview(reviewID, storeID) {
    var rating = parseInt($('#myReview_EditRating').val());
    var content = $('#myReview_EditContent').val();

    if (validator.isEmpty(content)) {
        alert('Please provide a review');
    } else {
        if (rating) { //check if rating is given
            $.post('/editReview', {
                reviewID: reviewID,
                storeID: storeID,
                rating: rating,
                content: content
            }, function (res) {
                switch (res.status) {
                    case 200:
                        location.reload();
                        break;
                    case 500:
                        alert('Something went wrong. Review not edited.');
                        break;
                }
            });
        } else { //otherwise deny posting
            alert('Please rate the store');
        }
    }
}
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
                            window.location = document.referrer;
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
                            window.location.href = '/storeSignup';
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
                    switch (result.status) {
                        case 200:
                            window.location.href = '/';
                            alert('Store Created');
                            break;
                        case 500:
                            window.location.href = '/';
                            alert('Something went wrong');
                            break;
                    }

                });
            }

        });

        $('#userProf_storeCreate').on('click', function () {
            var userID = $('#userProf_userID').val();
            console.log(userID);
            window.location.href = '/storeSignup';
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
                location.reload();
            });
        });
    });

}(jQuery));