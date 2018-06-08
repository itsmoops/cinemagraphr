/**
 * Add your own database configurations here - Go to your Firebase Project
 * First click on Storage and initialize it for your project
 * Copy the config info from Overview -> Add Firebase to your web app
 */
const firebaseConfig = {
    dev: {
        apiKey: 'AIzaSyCr20iFgUwbZTzhyXw-eMOX3HkzO8JuRVo',
        authDomain: 'cinemagraphr-dev.firebaseapp.com',
        databaseURL: 'https://cinemagraphr-dev.firebaseio.com',
        projectId: 'cinemagraphr-dev',
        storageBucket: 'cinemagraphr-dev.appspot.com',
        messagingSenderId: '254386857685'
    },

    prod: {
        apiKey: 'AIzaSyCUk0DztuhbGTdcDJeWOHjFK1GY_yXWzQI',
        authDomain: 'cinemagraphr-prod.firebaseapp.com',
        databaseURL: 'https://cinemagraphr-prod.firebaseio.com',
        projectId: 'cinemagraphr-prod',
        storageBucket: 'cinemagraphr-prod.appspot.com',
        messagingSenderId: '164893430698'
    }
}

export default firebaseConfig
