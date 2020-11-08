if(!(localStorage.getItem("userToken"))){
  location = "index.html"
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
  document.getElementsByTagName("errorbackground")[0].style["display"] = "none";
}
function exitr(){
  document.getElementsByTagName("unfocused")[0].style["display"] = "none";
  document.getElementsByTagName("selldiv")[0].style["display"] = "none";
}
var howbigisshop = 0;
function reloadshop(){
  db.collection("usershop")
  .orderBy("cost")
  .get()
  .then(function (snapshot){
    if(snapshot.docs.length != howbigisshop){
      document.getElementById("shop").innerHTML = "";
      for(i=0;i < snapshot.docs.length;i++){
        if(snapshot.docs[i].data().seller != localStorage.getItem("userToken")){
          console.log("test")
          var title = document.createElement("h2");
          title.innerText = snapshot.docs[i].data().name
          var seller = document.createElement("p")
          seller.innerText = snapshot.docs[i].data().username
          var cost = document.createElement("h4")
          cost.innerText = "$"+snapshot.docs[i].data().cost
          var div = document.createElement("div")
          div.className = "shopitem"
          div.appendChild(title)
          div.appendChild(seller)
          div.appendChild(cost)
          document.getElementById("shop").appendChild(div)
        }
      }
      howbigisshop = snapshot.docs.length
    }
  })
}
setInterval("reloadshop()",1)