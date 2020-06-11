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