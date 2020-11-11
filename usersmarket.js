if(!(localStorage.getItem("userToken"))){
  location = "index.html"
}
dragElement(document.getElementById("movablemoney"));
function goSomewhere(x){
  location = x;
}
function errormessage(message){
  document.getElementsByTagName("errorbackground")[0].style["display"] = "block";
  document.getElementsByTagName("error")[0].style["display"] = "inline-block";
  document.getElementsByTagName("errortext")[0].innerText = message;
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
      document.getElementById("shop").innerText = "";
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
          div.setAttribute("onClick","buy('"+snapshot.docs[i].id+"')")
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
function buy(id){
  document.getElementsByTagName("unfocused")[0].style["display"] = "block";
  document.getElementsByTagName("selldiv")[0].style["display"] = "inline-block";
  db.collection("usershop")
  .doc(id)
  .get()
  .then(function (snapshot){
    var h2 = document.createElement("h2");
    h2.innerText = snapshot.data().name;
    var seller = document.createElement("p");
    seller.innerText = snapshot.data().username;
    var cost = document.createElement("h4");
    cost.innerText = "$"+snapshot.data().cost;
    var buy = document.createElement("a");
    buy.style["font-size"] = "20px";
    buy.innerText = "Buy";
    buy.setAttribute("onClick","actualbuy('"+id+"',"+snapshot.data().cost+")");
    var div = document.createElement("div");
    div.style["display"] = "inline-block";
    div.style["position"] = "absolute";
    div.style["top"] = "50%";
    div.style["left"] = "50%";
    div.style["width"] = "100%";
    div.style["margin"] = "0px";
    div.style["padding"] = "0px";
    div.style["transform"] = "translate(-50%,-50%)";
    div.appendChild(h2);
    div.appendChild(seller);
    div.appendChild(cost);
    div.appendChild(buy);
    document.getElementsByTagName("selldiv")[0].innerHTML = "<x onclick=\"exitr()\">X</x>";
    document.getElementsByTagName("selldiv")[0].appendChild(div);
  })
}
var howmuchmoney = 0;
function money(){
  db.collection("accounts")
  .doc(localStorage.getItem("userToken"))
  .get()
  .then(function (snapshot){
    if(snapshot.data().money != howmuchmoney){
      document.getElementById("money").innerText = "$"+snapshot.data().money
      howmuchmoney = snapshot.data().money
    }
  })
}
setInterval("money()",1)
function actualbuy(id,cost){
  db.collection("accounts")
  .doc(localStorage.getItem("userToken"))
  .get()
  .then(function (snapshot){
    if(cost <= snapshot.data().money){
      var items = snapshot.data().owned
      var money = snapshot.data().money
      var amountofitems = snapshot.data().amountofitems
      db.collection("usershop")
      .doc(id)
      .get()
      .then(function (snapshot){
        items.push(snapshot.data().name)
        db.collection("accounts")
        .doc(snapshot.data().seller)
        .get()
        .then(function (snapshot){
          db.collection("accounts")
          .doc(snapshot.id)
          .update({
            money: snapshot.data().money+cost
          })
          .then(function (snapshot){
            db.collection("accounts")
            .doc(localStorage.getItem("userToken"))
            .update({
              owned: items,
              money: (money-cost),
              amountofitems: amountofitems+1
            })
            .then(function (snapshot){
              db.collection("usershop")
              .doc(id)
              .delete()
              .then(function (){
                exitr()
              })
            })
          })
        })
      })
    }else{
      errormessage("You don't have enough money")
    }
  })
}
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }
  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}