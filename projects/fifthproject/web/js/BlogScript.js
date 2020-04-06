window.addEventListener("load", openSocket(), false);

var webSocket;
function openSocket(){
    webSocket = new WebSocket("ws://localhost:8080/web_war_exploded/echo");

    webSocket.onopen = function(event){
        console.log("Connection opened");
    };

    webSocket.onmessage = function(event){
        writeResponse(event.data);
    };

    webSocket.onclose = function(event){
        writeResponse("Connection closed");
    };
}

function send(topic){

    var div = document.getElementById(topic);
    var name = div.children[1].value;
    var bericht = div.children[2].value;
    var rating = div.children[3].value;
    if(rating > 10) rating = 10;
    if(rating < 0 ) rating = 0;
    if(name && bericht) {
        var text = name + ": " + bericht + " Rating: " + rating + " " + topic;
        webSocket.send(text);
    }
    else{
        window.alert("De naam of de comment zijn niet juist ingevuld");
    }
}

function closeSocket(){
    webSocket.close();
}

function writeResponse(text){
    var topic = text.substr(text.length - 6, text.length -1);
    var cuttext = text.substr(0, text.length - 7);
    var div = document.getElementById(topic);
    var messages = div.children[5];
    messages.innerHTML += "<br/>" + cuttext;
    div.children[1].value = "";
    div.children[2].value = "";


}