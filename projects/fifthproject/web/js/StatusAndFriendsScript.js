window.addEventListener("load", getStatus, false);
window.addEventListener("load",getFriends,false);
document.getElementById("dropdownStatus").selected = 0;
document.getElementById("dropdownStatus").addEventListener("change", changeStatus, false);
document.getElementById("add").addEventListener("onclick", addFriend, false);

var xhrFriends = new XMLHttpRequest();
var xhrAddFriend = new XMLHttpRequest();
var xhr = new XMLHttpRequest();
var xhrChangestatus = new XMLHttpRequest();


function changeStatus(evt){
    let waarde = evt.target.value;
    if( waarde === "custom"){
        var div = document.getElementById("custom");
        var p = document.createElement("input");
        p.id = "customtext";
        var but = document.createElement("button");
        but.id = "button";
        var buttext = document.createTextNode("submit");
        but.append(buttext);
        but.addEventListener("click", deleteAndContinue, false);
        div.append(p);
        div.append(but);
        document.getElementById("customtext").focus();
        p.setAttribute("value", "custom");

        function deleteAndContinue() {
            var information = "status=" + encodeURIComponent(document.getElementById("customtext").value);
            xhrChangestatus.open("POST", "Controller?action=ChangeStatus", true);
            xhrChangestatus.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhrChangestatus.send(information);
            document.getElementById("button").removeEventListener("click", next,false);
            document.getElementById("customtext").remove();
            document.getElementById("button").remove();
            setTimeout(getStatus, 1000);

        }

    }
    else{
        var information = "status=" + encodeURIComponent(waarde);
        xhrChangestatus.open("POST", "Controller?action=ChangeStatus", true);
        xhrChangestatus.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhrChangestatus.send(information);
        setTimeout(getStatus, 1000);
    }
}
function getStatus(){
    xhr.open("GET", "Controller?action=LoadStatus", true);
    xhr.onreadystatechange = getData;
    xhr.send(null);
}
function getData() {
    if(xhr.status == 200){
        if(xhr.readyState == 4){
            var isEmpty = document.getElementById('status').innerHTML === "";
            var status = JSON.parse(xhr.responseText);
            if(isEmpty){
                var div = document.getElementById("status");
                var p = document.createElement("p");
                p.id = "statusParagraaf";
                var text = document.createTextNode(status);
                p.appendChild(text);
                div.appendChild(p);
            }
            else{
                document.getElementById("statusParagraaf").innerText = status;
            }
        }
    }
}

function getFriends(){
    xhrFriends.open("GET", "Controller?action=LoadFriendsOfLoggedInUser", true);
    xhrFriends.onreadystatechange = getDataFriends;
    xhrFriends.send(null);
}
function getDataFriends() {
    if (xhrFriends.status == 200) {
        if (xhrFriends.readyState == 4) {

            var serverResponse = JSON.parse(xhrFriends.responseText);
            console.log(serverResponse);
            for(let i = 0; i<serverResponse.length; i++) {
                if (document.getElementById(serverResponse[i].email) === null) {
                    var td1 = document.createElement("td");
                    var td2 = document.createElement("td");
                    var tr = document.createElement("tr");
                    td2.id = serverResponse[i].email;
                    var td1text = document.createTextNode("firstname: " + serverResponse[i].firstName);
                    var td2text = document.createTextNode("Status: " + serverResponse[i].status.status);
                    td1.append(td1text);
                    td2.append(td2text);
                    tr.append(td1);
                    tr.append(td2);
                    document.getElementById("friendList").append(tr);
                }
                else{
                    var statusPerson = document.getElementById(serverResponse[i].email);
                    statusPerson.innerText = "Status: " + serverResponse[i].status.status;
                }
            }
            setInterval(getFriends, 2000);
        }
    }
}
function addFriend(){
    var email = document.getElementById("inputAddFriend").value;
    if(email != null){
        var information = "email=" + encodeURIComponent(email);
        console.log("test");
        document.getElementById("inputAddFriend").value = "";
        xhrAddFriend.open("POST", "Controller?action=AddFriendToLoggedInUser", true);
        xhrAddFriend.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhrAddFriend.send(information);
    }
}
