$(document).ready(function() {

    function addStoreDiv(item, parentDiv) {
    var rowDiv = document.createElement('div');
    var imgCol = document.createElement('div');
    var nameCol = document.createElement('div');

    var img = document.createElement('img');
    var nameHeading = document.createElement('h4');
    var idn = document.createElement('p');

    $(rowDiv).addClass("row student");
    $(imgCol).addClass("col-sm-2 center");
    $(nameCol).addClass("col-sm-10");

    $(img).attr("src", item.img);
    $(nameHeading).text(item.name);
    $(id).text(item.id);

    imgCol.append(img);

    nameCol.append(nameHeading);
    nameCol.append(id);

    rowDiv.append(imgCol);
    rowDiv.append(nameCol);

    parentDiv.append(rowDiv);
  }
    // POST called
    $('#addUser').click(function() {
      // Get the data from the form
      var username = $('#username').val();
      var id = $('#id').val();
      var pw = $('#pw').val();
  
      var newUser = {
        username: username,
        id: idnum,
        pw: pw
      };
  
      $.post('addUser', newUser, function(data, status) {
        console.log(data);
  
        if (data.success) {
          $('#msg').text(data.message);
          $('#msg').removeClass('fail');
          $('#msg').addClass('success');
  
          $('#username').val('');
          $('#idnum').val('');
          $('#pw').val('');
        } else {
          $('#msg').text(data.message);
          $('#msg').removeClass('success');
          $('#msg').addClass('fail');
        }
  
      });
    });
    
    $('#addStore').click(function() {
      // Get the data from the form
      var storeName = $('#name').val();
      var rating = $('#rating').val();
  
      var newUser = {
        name: name,
        rating: rating,
      };
  
      $.post('addStore', newStore, function(data, status) {
        console.log(data);
  
        if (data.success) {
          $('#msg').text(data.message);
          $('#msg').removeClass('fail');
          $('#msg').addClass('success');
  
          $('#name').val('');
          $('#rating').val('');
        } else {
          $('#msg').text(data.message);
          $('#msg').removeClass('success');
          $('#msg').addClass('fail');
        }
  
      });
    });
    $('#addReview').click(function() {
      // Get the data from the form
      var username = $('#username').val();
      var rating = $('#rating').val();
      var body = $('body').val();
  
      var newUser = {
        name: name,
        rating: rating,
        body:body,
      };
  
      $.post('addStore', newStore, function(data, status) {
        console.log(data);
  
        if (data.success) {
          $('#msg').text(data.message);
          $('#msg').removeClass('fail');
          $('#msg').addClass('success');
  
          $('#username').val('');
          $('#rating').val('');
          $('#body').val();
        } else {
          $('#msg').text(data.message);
          $('#msg').removeClass('success');
          $('#msg').addClass('fail');
        }
  
      });
    });
  
    // #findStudent POST call
    $('#findStore').click(function() {
      // Get the data from the form
      var name = $('#searchName').val();
  
      $.post('searchStores', { name: name }, function(data, status) {
        console.log(data);
  
        var storeListContainer = $('#storeList');
        storeListContainer.empty(); // clear children every time (refresh results)
  
        //data.forEach((item, i) => {
        //  addStudentDiv(item, studentListContainer);
        //});
  
      });
    });
  });
  