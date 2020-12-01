//Form Validation---LOGIN FORM
function validateFormEmail() {
    var x = document.forms["signUp"]["email"].value;
    if (x == "") {
      alert("Email must be filled out");
      return false;
    }
  }
  
  function validateFormPassword() {
    var x = document.forms["signUp"]["psw"].value;
    if (x == "") {
      alert("Password must be filled out");
      return false;
    }
  }
  
//Form Validation---REGISTRATION FORM 
//making s ure password and repeat password are the same 

var password = document.getElementById("psw")
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
  