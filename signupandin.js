function goSomewhere(x){
  location = x;
}
function errormessage(message){
  document.getElementsByTagName("errorbackground")[0].style["display"] = "block";
  document.getElementsByTagName("error")[0].style["display"] = "inline-block";
  document.getElementsByTagName("errortext")[0].innerHTML = message;
}
function exit(){
  document.getElementsByTagName("errorbackground")[0].style["display"] = "none";
}
function signup(){
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  db.collection("accounts")
  .where("username","==",username)
  .get()
  .then(function (snapshot){
    if(snapshot.empty){

    }else{
      errormessage("That username was already taken.")
    }
  })
}
errormessage("That username was already taken.")