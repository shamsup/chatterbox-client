var app = (function() {
  var url = 'https://api.parse.com/1/classes/messages';
  var data = {
    username: 'testuserlol',
    currentRoom: '',
    rooms: {},
    messages: {},
    friends: {},
  };



  function init(){
    // gather the username
    data.username = prompt('What is your username?') || 'holydiver666';
    $('#main').on('click', '.username', this.handleUsernameClick);
    $('#send').on('submit', this.handleSubmit.bind(this));
    $('#roomSelect').on('click', 'a', function(e) {
      e.preventDefault();
      this.setRoom($(e.target).prop('roomName'));
    }.bind(this));
    this.fetch(({results}) => {
      results.forEach(message => {
        data.messages[message.objectId] = message;
        data.rooms[message.roomname] = data.rooms[message.roomname] || [];
        data.rooms[message.roomname].push(message);
        if (message.roomname = data.currentRoom) {
          renderMessage(message);
        }
      });

      for (var key in data.rooms) {
        this.renderRoom(key);
      }
      setRoom('lobby');
    });
  }

  function send(message) {
    $.ajax({
      url: url,
      type: 'POST',
      data: JSON.stringify(message)
    });
  }

  function fetch(callback) {
    $.ajax({
      url: url,
      type: 'GET',
      success: callback
    });
  }

  function clearMessages() {
    $('#chats').empty();
  }

  function renderMessage(message) {
    var $li = $('<li class="collection-item"></li>');
    var $row = $('<div class="row"></div>');
    var $username = $('<div class="username col s3"></span>');
    $username.text(message.username);
    $username.data('username', message.username);
    $friendIcon = $(`<i class="material-icons${data.friends[message.username] ? ' friended' : ''}">assignment_ind</i>`);
    $username.prepend($friendIcon);
    var $message = $('<div class="message"></div>');
    $message.text(message.text);
    $row.append($username, $message);
    $li.append($row);
    $('#chats').append($li);

    // always have chat box scrolled to bottom
    $('#chats').scrollTop($('#chats')[0].scrollHeight);
  }

  function renderRoom(roomName) {
    var $li = $(`<li></li>`);
    var $room = $('<a href="#"></a>');
    $room.text(roomName).prop('roomName', roomName);
    $li.append($room)
    $('#roomSelect').append($li );
  }

  function handleUsernameClick(e) {
    var username = $(this).data('username');
    data.friends[username] = !data.friends[username];
    $('i', this).toggleClass('friended');
  }

  function handleSubmit(e) {
    console.log('called')
    e.preventDefault();
    var message = $('#message').val();
    this.send({username: data.username, text: message, roomname: data.currentRoom});
  }

  function setRoom(roomName) {
    if (roomName !== data.currentRoom) {
      data.currentRoom = roomName;
      $('#room-name').text(data.currentRoom);
      $('#chats').empty();
      data.rooms[data.currentRoom].forEach(renderMessage);

    }
  }

  // our public api
  return {
    init: init,
    send: send,
    fetch: fetch,
    server: url,
    clearMessages: clearMessages,
    renderMessage: renderMessage,
    renderRoom: renderRoom,
    handleUsernameClick: handleUsernameClick,
    handleSubmit: handleSubmit,
    setRoom: setRoom
  }

}());
