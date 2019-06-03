// This module defines the custom exceptions that can be thrown during the execution

// Generic Error
class InternalErrorException extends Error {
    constructor(message) {
        super(message);
        this.name = 'InternalErrorException';
    }
}

// Thrown when an user provides bad credentials in the login
class WrongCredentialsException extends Error {
    constructor(message) {
        super(message);
        this.name = 'WrongCredentialsException';
    }
}

// Thrown when the user tries to upload a file with a name of an existing resource
class ConflictFileException extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConflictFileException';
    }
}