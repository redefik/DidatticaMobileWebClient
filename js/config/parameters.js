// Configuration parameters of the application
angular.module('didatticaMobileWebClient')
    .constant('BACKEND_ENDPOINT', 'http://localhost:80/didattica-mobile/api/v1.0/')
    .constant('INTERNAL_ERROR_MESSAGE', 'Errore interno')
    .constant('CONFLICT_FILE_ERROR_MESSAGE', 'Esiste già un file con questo nome')
    .constant('WRONG_CREDENTIALS_ERROR_MESSAGE', 'Credenziali errate')
    .constant('UNKNOWN_ERROR_MESSAGE', 'Errore sconosciuto');