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
        appendNotification(`${userName} a rejoint la conversation !`)
        socket.emit('new-user', roomName, userName, userId)

        messageForm.addEventListener('submit', e => {
            e.preventDefault()
            const message = messageInput.value
            appendMessage({message: message, name: userName, user_id: userId})
            socket.emit('send-chat-message', roomName, message, userId)
            messageInput.value = ''
        })
    }
    /**
     * Construit un nouvel item dans le menu quand une nouvelle conversation est créée
     */
    socket.on('room-created', (room, roomId) => {
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
        appendMessage({message: data.message, name: data.name, user_id: data.userId})
    })

    socket.on('user-connected', name => {
        appendNotification(`${name} a rejoint la conversation !`)
    })

    socket.on('user-disconnected', name => {
        appendNotification(`${name} a quitté la conversation !`)
    })

    /**
     * Affiche un message dans la conversation
     * @param data
     */
    function appendMessage(data) {
        let newMessage = `
            <div class="message-user ${data.user_id == userId ? 'me' :''}">
                <div class="user ${data.user_id == userId ? 'me' :''}">
                    <span>${data.name}</span>
                </div>
                <div class="message  ${data.user_id == userId ? 'me' :''}">
                    <span>${data.message}</span>
                </div>
            </div>`
        messageContainer.innerHTML += newMessage;
        scroollToBottom(messageContainer.lastElementChild)
    }

    /**
     * Affiche une notification
     * @param message
     */
    function appendNotification(message) {
        let newMessage = `
            <div class="notification">
                <div class="divider"></div>
                <div class="info-notif">${message}</div>
                <div class="divider"></div>
            </div>
        `
        messageContainer.innerHTML += newMessage
        scroollToBottom(messageContainer.lastElementChild)
    }

    function scroollToBottom(element)
    {
        element.scrollIntoView({ behavior: 'smooth', block: 'end'})
    }
});