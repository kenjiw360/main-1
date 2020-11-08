var howmanyitems = 0;
if(!(localStorage.getItem("userToken"))){
  location = "index.html"
}
function goSomewhere(x){
  location = x
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
function exitr(){
  document.getElementsByTagName("unfocused")[0].style["display"] = "none";
  document.getElementsByTagName("selldiv")[0].style["display"] = "none";
}
function showitems(){
  db.collection("accounts")
  .doc(localStorage.getItem("userToken"))
  .get()
  .then(function (snapshots){
    var allitems = snapshots.data().owned
    var wholething = document.createElement("div");
    if(howmanyitems != allitems.length){
      howmanyitems = allitems.length
      for(i=(allitems.length-1);i>=0;i--){
        db.collection("shop")
        .where("name","==",allitems[i])
        .get()
        .then(function (snapshot){
          var name = document.createElement("h3")
          name.innerText = snapshot.docs[0].data().name
          var rarity = document.createElement("p")
          rarity.innerText = snapshot.docs[0].data().rarity
          var div = document.createElement("div")
          div.className = "shopitem"
          div.setAttribute("onClick","opensellwindow('"+snapshot.docs[0].data().name+"')")
          div.appendChild(name)
          div.appendChild(rarity)
          wholething.appendChild(div)
          document.getElementById("inventory").innerHTML = wholething.innerHTML
        })
      }
    }
  })
}
setInterval("showitems()",1)
function opensellwindow(name){
  document.getElementsByTagName("unfocused")[0].style["display"] = "block";
  var selldiv = document.getElementsByTagName("selldiv")[0];
  selldiv.style["display"] = "inline-block";
  selldiv.innerHTML = "<x onclick=\"exitr()\">X</x>";
  db.collection("accounts")
  .doc(localStorage.getItem("userToken"))
  .get()
  .then(function (snapshot){
    var title = document.createElement("h2")
    title.innerText = name;
    var sellamount = document.createElement("input");
    sellamount.type = "text";
    sellamount.id = "sellamount"
    sellamount.placeholder = "How Much Do You Want To Sell It For?"
    sellamount.style["width"] = "75%";
    sellamount.style["text-align"] = "center";
    var br = document.createElement("br");
    var br2 = document.createElement("br");
    var submit = document.createElement("a");
    submit.style["cursor"] = "pointer";
    submit.style["font-size"] = "20px";
    submit.innerText = "Submit";
    submit.setAttribute("onClick","sell('"+name+"','"+snapshot.data().username+"')")
    var error = document.createElement("p");
    error.id = "error"
    error.style["color"] = "red";
    var div = document.createElement("div");
    div.style["display"] = "inline-block";
    div.style["position"] = "absolute";
    div.style["top"] = "50%";
    div.style["left"] = "50%";
    div.style["width"] = "100%";
    div.style["margin"] = "0px";
    div.style["padding"] = "0px";
    div.style["transform"] = "translate(-50%,-50%)";
    div.appendChild(title)
    div.appendChild(sellamount)
    div.appendChild(br)
    div.appendChild(br2)
    div.appendChild(error)
    div.appendChild(submit)
    selldiv.appendChild(div)
  })
}
function sell(name,username){
  document.getElementById("error").innerText = ""
  var amount = document.getElementById("sellamount").value;
  console.log(parseInt(amount))
  if(isNaN(parseInt(amount))){
    document.getElementById("error").innerText = "Your Selling Amount includes characters that aren't numbers"
  }else{
    db.collection("usershop")
    .add({
      name: name,
      cost: parseInt(amount),
      seller: localStorage.getItem("userToken"),
      username: username
    })
    .then(function (snapshot){
      db.collection("accounts")
      .doc(localStorage.getItem("userToken"))
      .get()
      .then(function(snapshot){
        var array = snapshot.data().owned
        array.splice(array.indexOf(name),1)
        db.collection("accounts")
        .doc(localStorage.getItem("userToken"))
        .update({
          owned: array
        })
        .then(function (snapshot){
          exitr()
        })
      })
    })
  }
}