var socket = io();
$('form').submit(function(){
  socket.emit('manifest response', $('#m').val());
  $('#m').val('');
  return false;
});

socket.on('manifest response', function(msg){
  $('#declarations').prepend($('<li>').text(msg));
});

socket.on('manifest', function(tweet) {
  $('.manifesto').append($('<h1>').text(tweet));
  $('.modal-manifest').append($('<h1>').text(tweet));
});
socket.on('date', function(date) {
  $('.manifesto').append($('<small>').text(date));
});

socket.on('stream', function(vibes) {
  $('#declarations').prepend($('<li class="tweet-vibes">').text(vibes));
});