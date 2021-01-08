'use strict';

/**
 * Base error for custom errors thrown by MerchantsAPI function app.
 */
class BaseError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'CustomerApiFunctionsBaseError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.BaseError = BaseError;

class CustomerApiServerError extends BaseError {
    constructor(message, code) {
        super(message, code);
        this.name = 'CustomerApiServerError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.CustomerApiServerError = CustomerApiServerError;

class InvalidUUIDError extends BaseError {
    constructor(message, code) {
        super(message, code);
        this.name = 'InvalidUUIDError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.InvalidUUIDError = InvalidUUIDError;

class EmptyRequestBodyError extends BaseError {
    constructor(message, code) {
        super(message, code);
        this.name = 'EmptyRequestBodyError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.EmptyRequestBodyError = EmptyRequestBodyError;

class DuplicateCustomerError extends BaseError {
    constructor(message, code) {
        super(message);
        this.name = 'DuplicateCustomerError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.DuplicateCustomerError = DuplicateCustomerError;

class DuplicateResourcesError extends BaseError {
    constructor(message, code) {
        super(message);
        this.name = 'DuplicateResourcesError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.DuplicateResourcesError = DuplicateResourcesError;

class UserNotAuthenticatedError extends BaseError {
    constructor(message, code) {
        super(message);
        this.name = 'UserNotAuthenticatedError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor)
    }
}
exports.UserNotAuthenticatedError = UserNotAuthenticatedError;

class BookingRulesInvalid extends BaseError {
    constructor(message, code) {
        super(message);
        this.name = 'BookingRulesInvalid';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.BookingRulesInvalid = BookingRulesInvalid;

class CustomerNotFoundError extends BaseError {
    constructor(message, code) {
        super(message);
        this.name = 'CustomerNotFoundError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.CustomerNotFoundError = CustomerNotFoundError

class ResourcesNotFoundError extends BaseError {
    constructor(message, code) {
        super(message);
        this.name = 'ResourcesNotFoundError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ResourcesNotFoundError = ResourcesNotFoundError;

class ResourceGroupNotFoundError extends BaseError {
    constructor(message, code) {
        super(message);
        this.name = 'ResourceGroupNotFoundError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ResourceGroupNotFoundError = ResourceGroupNotFoundError

class DuplicateResourceGroupError extends BaseError {
    constructor(message, code) {
        super(message);
        this.name = 'DuplicateResourceGroupError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.DuplicateResourceGroupError = DuplicateResourceGroupError