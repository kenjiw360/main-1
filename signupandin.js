if(localStorage.getItem("userToken")){
  location = "main.html";
}
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
  if(!(username && password)){
    errormessage("You didn't fill in all the inputs")
  }else{
    db.collection("accounts")
    .where("username","==",username)
    .get()
    .then(function (snapshot){
      if(snapshot.empty){
        db.collection("accounts")
        .add({
          username: username,
          password: CryptoJS.SHA256(password).toString(),
          friends: [],
          following: [],
          bio: "This is my bio. Make me interesting!",
          money: 50,
          owned: [],
          profile: "https://avatars.dicebear.com/api/bottts/"+username+".svg",
          tutorial: 0
        })
        .then(function (snapshot){
          localStorage.setItem("userToken",snapshot.id)
          location = "main.html";
        })
      }else{
        errormessage("That username was already taken.")
      }
    })
  }
}
function signin(){
  var username = document.getElementById("usernamer").value;
  var password = document.getElementById("passwordr").value;
  db.collection("accounts")
  .where("username","==",username)
  .get()
  .then(function (snapshot){
    if(snapshot.empty){
      errormessage("That account doesn't exist")
    }else{
      if(snapshot.docs[0].data().password == CryptoJS.SHA256(password).toString()){
        localStorage.setItem("userToken",snapshot.docs[0].id)
        location = "main.html"
      }else{
        errormessage("Your password was wrong")
      }
    }
  })
}