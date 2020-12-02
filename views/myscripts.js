//Form Validation---LOGIN FORM
function validateFormEmail() {
    var x = document.forms["signUp"]["email"].value;
    if (x == "") {
      alert("Email must be filled out");
      return false;
    }
  }
  
  function validateFormPassword() {
    var x = document.forms["signUp"]["password"].value;
    if (x == "") {
      alert("Password must be filled out");
      return false;
    }
  }
  
//Form Validation---REGISTRATION FORM 
//making s ure password and repeat password are the same 

var password = document.getElementById("password")
var confirm_password = document.getElementById("confirm_password");

function validatePassword(){
  if(password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match");
  } else {
    confirm_password.setCustomValidity('');
  }
}
password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;




// There's only one possible reason for that error message, document.getElementById("drop") does not return the element, and the only reason for that is that the element doesn't exists, but in the HTML it clearly does, so the script must be running before the elements in the DOM.


  