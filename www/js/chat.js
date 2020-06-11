const socket = io('http://localhost:3000')


window.addEventListener("DOMContentLoaded", (event) => {
    const messageContainer = document.getElementById('message-container')
    const roomContainer = document.getElementById('room-container')
    const messageForm = document.getElementById('send-container')
    const messageInput = document.getElementById('message-input')
    const logoutBtn = document.getElementById('logout');

    logoutBtn.addEventListener('click', function () {
        fetch('/api/auth/logout', {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        }).then( apiResponse => {
            // Vérifier le status de la requête
            if( apiResponse.ok ){
                // Extraire les données JSON de la réponse
                window.location.replace("/login");
            }

        });
    })

    const userName = localStorage.getItem('userName')
    const userId = localStorage.getItem('userId')

    if (messageForm != null) {
        appendMessage(`${userName} a rejoint la conversation !`)
        socket.emit('new-user', roomName, userName)

        messageForm.addEventListener('submit', e => {
            e.preventDefault()
            const message = messageInput.value
            appendMessage(`Moi: ${message}`)
            socket.emit('send-chat-message', roomName, message, userId)
            messageInput.value = ''
        })
    }
    /**
     * Construit un nouvel item dans le menu quand une nouvelle conversation est créée
     */
    socket.on('room-created', (room, roomId) => {
        console.log(roomId)
        const roomParentElement = document.createElement('li')
        roomParentElement.className += 'chat-room'
        const roomElement = document.createElement('div')
        roomElement.className += 'infos'
        roomParentElement.append(roomElement)
        const roomInfos = document.createElement('span')
        roomInfos.className += 'name'
        roomElement.append(roomInfos)
        roomInfos.innerText = room
        const roomLink = document.createElement('a')
        roomLink.className += 'link'
        roomLink.href = `/${room}/${roomId}`
        roomLink.innerText = 'Rejoindre'
        roomContainer.append(roomParentElement)
        roomElement.append(roomLink)
    })

    socket.on('chat-message', data => {
        appendMessage(`${data.name}: ${data.message}`)
    })

    socket.on('user-connected', name => {
        appendMessage(`${name} a rejoint la conversation !`)
    })

    socket.on('user-disconnected', name => {
        appendMessage(`${name} a quitté la conversation !`)
    })

    /**
     * Céer un element dans la conversation
     * @param message
     */
    function appendMessage(message) {
        const messageElement = document.createElement('div')
        messageElement.innerText = message
        messageContainer.append(messageElement)
    }
});