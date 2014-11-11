function pia() {
  try {
    var piido = $("#piido");
    socket.send(piido.val());
    piido.val('');
  } catch(exception) {
    addMessage("Failed To Send")
  }
}

function connect() {
  try {
    socket = new WebSocket(wshost);

    socket.onopen = function() {
      addMessage("Socket Status: " + socket.readyState + " (open)");
      for (var key in localStorage){
        show_piido(key);
      }
    }

    socket.onclose = function() {
      addMessage("Socket Status: " + socket.readyState + " (closed)");
    }

    socket.onmessage = function(msg) {
      addMessage("Received: " + msg.data);
      show_piido(msg.data);
    }
  } catch(exception) {
    addMessage("Error: " + exception);
  }
}

function show_piido(piido) {
  var rendered = Mustache.render(template, {piido: piido.toLowerCase()});
  console.log(rendered);
  $('#content').prepend(rendered);
  localStorage.setItem(piido, new Date().getTime());
}

function addMessage(msg) {
  console.log(msg);
}

$(function() {
  for (var key in tuits_submitted){
    localStorage.setItem(key, tuits_submitted[key]);
  }
  connect();
  $("#piido").focus();
});

$("#disconnect").click(function() {
  socket.close()
});

$("#piar").submit(function(){
  pia();
  return false;
});
$("#piar button").click(function(){
  pia();
});
$("#tuitear button").click(function(){
  var tuitear = $("#tuitear");
  var target = $("#host").val();
  var piido = $("#piido");
  tuitear.append(piido);
  if(target) {
    target = target + tuitear.attr('action');
    tuitear.attr('action', target);
  }
  return $("#tuitear").submit();
});
$("#download").click(function(){
  var target = $("#host").val();
  if(target) {
    target = target + '/tuits.json';
    $.get(target, function(tuits) {
      for (var key in tuits){
        show_piido(key);
      }
    });
  } else {
    alert('Local download not implemented yet (coming soon!!!)');
  }
});

function initMoustache() {
  template = $('#template').html();
  Mustache.parse(template);   // optional, speeds up future uses
}
