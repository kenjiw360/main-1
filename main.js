if(!(localStorage.getItem("userToken"))){
  location = "index.html"
}
startup()
db.collection("accounts")
.doc(localStorage.getItem("userToken"))
.get()
.then(function (snapshot){
  if(snapshot.data().tutorial == 0){
    errormessage("The top left quadrant is your accounts. You can change your bio over their. The bottom left quadrant is your friends, followers, and followings. The right half side is the shop. To buy products, just click on the box that contains the product")
    db.collection("accounts")
    .doc(localStorage.getItem("userToken"))
    .update({
      tutorial: 1
    })
  }
})
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
  document.getElementsByTagName("errorbackground")[0].style["display"] = "none";
}
function startup(){
  db.collection("accounts")
  .doc(localStorage.getItem("userToken"))
  .get()
  .then(function (snapshot){
    document.getElementById("name").innerText = snapshot.data().username
    document.getElementById("balance").innerText = "Balance: $"+snapshot.data().money;
    document.getElementById("bio").innerText = snapshot.data().bio
  })
}
function changebio(){
  db.collection("accounts")
  .doc(localStorage.getItem("userToken"))
  .get()
  .then(function (snapshot){
    document.getElementById("bio").innerHTML = `<textarea id="changedbio" style="height:25vh;width:80%;font-family: Gotham; font-size: 15px;resize:none;" maxlength="200"></textarea>`;
    document.getElementById("changebiotext").innerText = "Submit";
    document.getElementById("changebiotext").setAttribute("onClick", "actualchangebio()")
  })
}
function actualchangebio(){
  var newbio = document.getElementById("changedbio").value;
  document.getElementById("bio").innerText = newbio
  document.getElementById("changebiotext").innerText = "Submitting...";
  db.collection("accounts")
  .doc(localStorage.getItem("userToken"))
  .update({
    bio: newbio
  })
  .then(function (snapshot){
    document.getElementById("bio").innerText = newbio
    document.getElementById("changebiotext").innerText = "Change Bio";
  })
}
function everyms(){
  db.collection("shop")
  .where("left",">",0)
  .orderBy("left","desc")
  .onSnapshot(function (snapshot){
    var wholething = document.createElement("div");
    for(i=0;i<snapshot.docs.length;i++){
      var name = document.createElement("h3")
      name.innerText = snapshot.docs[i].data().name
      var left = document.createElement("h5")
      left.innerText = "There are "+snapshot.docs[i].data().left+" left"
      var rarity = document.createElement("p")
      rarity.innerText = snapshot.docs[i].data().rarity
      var cost = document.createElement("p")
      cost.innerText = "$"+snapshot.docs[i].data().cost
      var div = document.createElement("div")
      div.className = "shopitem"
      div.setAttribute("onClick","buy('"+snapshot.docs[i].id+"','"+name.innerText+"')")
      div.appendChild(name)
      div.appendChild(left)
      div.appendChild(rarity)
      div.appendChild(cost)
      wholething.appendChild(div)
    }
    if(wholething.innerHTML != document.getElementById("shop").innerHTML){
      console.log("test")
      document.getElementById("shop").innerHTML = wholething.innerHTML;
    }
  })
}
setInterval("everyms()",1)
function buy(item,name){
  console.log("test")
  db.collection("shop")
  .doc(item,name)
  .get()
  .then(function (snapshot){
    var cost = snapshot.data().cost
    db.collection("accounts")
    .doc(localStorage.getItem("userToken"))
    .get()
    .then(function (snapshots){
      if(cost > snapshots.data().money){
        errormessage("You Don't Have Enough Money")
        return false;
      }else{
        db.collection("shop")
        .doc(item)
        .update({
          left: snapshot.data().left-1
        })
        .then(function (snapshot){
          db.collection("accounts")
          .doc(localStorage.getItem("userToken"))
          .get()
          .then(function (snapshots){
            var items = snapshots.data().owned;
            items.push(name)
            var money = snapshots.data().money
            db.collection("accounts")
            .doc(localStorage.getItem("userToken"))
            .update({
              owned: items,
              money: snapshots.data().money - cost
            })
            .then(function (snapshot){
              console.log(money)
              console.log(cost)
              document.getElementById("balance").innerText = "Balance: $"+(money-cost)
            })
          })
        })
      }
    })
  })
}