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

})