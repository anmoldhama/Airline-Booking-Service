const {statusCodes} = require('http-status-codes');

class ServiceError extends Error{
    constructor(message = 'Something went wrong',explanation = 'Service layer error', statusCode = statusCodes.INTERNAL_SERVER_ERROR){
        this.name = 'ServiceError',
        this.message = message,
        this.explanation = explanation,
        this.statusCode = statusCode
    } 
}

module.exports = ServiceError;