function checkUserToken()
{
    fetch('/api/auth/me').then( apiResponse => {
        // Vérifier le status de la requête
        if( apiResponse.ok ){
            // Extraire les données JSON de la réponse
            return apiResponse.json();
        }
        else{
            // Rediriger à la page d'accueil
            window.location.replace("/login");
        }
    })
        .then( jsonData =>  {
            if(!localStorage.getItem('userId')) localStorage.setItem('userId', jsonData.data._id)
            if(!localStorage.getItem('userName')) localStorage.setItem('userName', jsonData.data.pseudo)
            if(!localStorage.getItem('userEmail')) localStorage.setItem('userEmail', jsonData.data.email)
        })
        .catch( apiError => {
            console.log(apiError)
        });
}

checkUserToken();

window.addEventListener("DOMContentLoaded", (event) => {
    let aside = document.getElementById('menu');
    let btnOpenMenu = document.getElementById('btn-open-menu');
    let btnCloseMenu = document.getElementById('btn-close-menu');
    let btnDeleteRooms = document.getElementsByClassName('delete-room');
    let openMenu = document.getElementById('open-menu');
    let closeMenu = document.getElementById('close-menu');

    btnCloseMenu.addEventListener('click', function () {
        aside.classList.remove('--open');
        aside.classList.add('--close');
    })

    btnOpenMenu.addEventListener('click', function () {
        aside.classList.remove('--close');
        aside.classList.add('--open');

    })
    Array.from(btnDeleteRooms).forEach(function (btnDelete) {
        btnDelete.addEventListener('click', function () {
            let roomId = this.getAttribute('data-id');
            let roomName = this.getAttribute('data-name');

            fetch(`${roomName}/${roomId}`, {
                method: 'DELETE',
            }).then( apiResponse => {
                // Vérifier le status de la requête
                if( apiResponse.ok ){
                    // Extraire les données JSON de la réponse
                    return apiResponse.json();
                }
                else{
                    // Créer une alerte pur confirmer la suppréssion
                    let alert = `<div class="alert-notif --error" id="notif-${roomId}">
                        <span>La conversation ${roomName} n'a pas pu été supprimée !</span>
                    </div>`;
                    document.body.innerHTML += alert;

                    // Supprime la notf après 3 seconde
                    setTimeout(function () {
                        document.body.removeChild(document.getElementById('notif-'+roomId))
                    }, 3000)
                }
            })
                .then( jsonData =>  {
                    // Créer une alerte pur confirmer la suppréssion
                    let alert = `<div class="alert-notif --success" id="notif-${roomId}">
                        <span>La conversation ${roomName} a bien été supprimée !</span>
                    </div>`;
                    document.getElementById('room-container').removeChild(this.closest('li'))
                    document.body.innerHTML += alert;

                    // Supprime la notf après 3 seconde
                    setTimeout(function () {
                        document.body.removeChild(document.getElementById('notif-'+roomId))
                    }, 3000)
                })
                .catch( apiError => {
                    console.log(apiError)
                });
        })
    })


})