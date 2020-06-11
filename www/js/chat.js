const socket = io('http://localhost:3000')
const messageContainer = document.getElementById('message-container')
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

window.addEventListener("DOMContentLoaded", (event) => {
    const logoutBtn = document.getElementById('logout');
    logoutBtn.addEventListener('click', function () {
        window.localStorage.removeItem('userEmail');
        window.localStorage.removeItem('userName');
        window.localStorage.removeItem('userId');
    })

    // Si on n'est pas connecter, on redirige vers la page de connexion
    if(!localStorage.getItem('userId')){
        window.location.replace("/login");
    }
    const nameUser = localStorage.getItem('userName')

    if (messageForm != null) {
        appendMessage(`${nameUser} a rejoint la conversation !`)
        socket.emit('new-user', roomName, nameUser)

        messageForm.addEventListener('submit', e => {
            e.preventDefault()
            const message = messageInput.value
            appendMessage(`Moi: ${message}`)
            socket.emit('send-chat-message', roomName, message)
            messageInput.value = ''
        })
    }
    /**
     * Construit un nouvel item dans le menu quand une nouvelle conversation est créée
     */
    socket.on('room-created', room => {
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
        roomLink.href = `/${room}`
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