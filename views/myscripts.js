
var modal = document.getElementById('id02');
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

var modal = document.getElementById('id03');
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
var modal = document.getElementById('bg-modal');
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    
    if (event.target == modal) {
        modal.style.display = "none";
    }
document.getElementById("d1").innerHTML = "Where are you? Not where you want to be. Not just yet. " ;
document.getElementById("d2").innerHTML = "Browse through the properties listed here to find that special place that tickles your fancy." ;
document.getElementById("d3").innerHTML = "Our listings our homeowners opening their doors and hearts." ;
document.getElementById("d4").innerHTML = "So why book an overpriced unoriginal hotel room ?  Explore the world, feel at home. " ;

}
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
  

window.onclick = function(event) {
document.getElementById("dashBoard").innerHTML = "Hey there " ;
}