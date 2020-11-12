if(!(localStorage.getItem("userToken"))){
  location = "index.html"
}
dragElement(document.getElementById("movablestandings"))
function goSomewhere(x){
  location = x;
}
function reload(){
  db.collection("accounts")
  .where("amountofitems",">=",0)
  .orderBy("amountofitems","desc")
  .onSnapshot(function (snapshot){
    document.getElementById("bestname").innerText = snapshot.docs[0].data().username
    document.getElementById("howmuchmoney").innerText = "Balance: $"+snapshot.docs[0].data().money
    document.getElementById("howmanyitems").innerText = "Has "+ snapshot.docs[0].data().amountofitems +" Item(s)."
    if(!(snapshot.docs.length <= 2)){
      document.getElementById("notname").innerText = snapshot.docs[1].data().username
      document.getElementById("nothowmuchmoney").innerText = "Balance: $"+snapshot.docs[1].data().money
      document.getElementById("nothowmanyitems").innerText = "Has "+ snapshot.docs[1].data().amountofitems +" Item(s)."
    }
    if(!(snapshot.docs.length <= 3)){
      document.getElementById("nottname").innerText = snapshot.docs[2].data().username
      document.getElementById("notthowmuchmoney").innerText = "Balance: $"+snapshot.docs[2].data().money
      document.getElementById("notthowmanyitems").innerText = "Has "+ snapshot.docs[2].data().amountofitems +" Item(s)."
    }
    for(i=0;i<snapshot.docs.length;i++){
      if(snapshot.docs[i].id == localStorage.getItem("userToken")){
        document.getElementById("position").innerText = "#"+(i+1)
      }
    }
  })
}
setInterval("reload()",1)


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