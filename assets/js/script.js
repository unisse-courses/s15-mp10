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
            var password = $('#login_password').val();
            // VALIDATION
            // POST
            $.post('/login', {
                email: email,
                pass: password
            }, function(result) {

            $("#login_submit").validate({
                rules: {
                    email: {
                        required: true
                    },
                    password: {
                        required: true
                    }
                },
                messages: {
                    email: {
                        required: "specify email"
                    },
                    password: {
                        required: "specify password"
                    }
                }
            });

            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("Users");
                var query1 = email;
                var query2 = password;
                dbo.collection("email").find(query1).toArray(function(err, result) {
                  if (err) throw err;
                  console.log(result);
                  db.close();
                });

                dbo.collection("password").find(query2).toArray(function(err,result){
                    if(err) throw err;
                    console.log(result);
                    db.close();
                }
              );
    });

}(jQuery));