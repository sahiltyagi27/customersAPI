'use strict';

const Promise = require('bluebird');
const validator = require('validator');
const errors = require('../errors');
const { MongoError } = require('mongodb');
const crypto = require('crypto');

exports.handleError = (context, error) => {
    context.log.error('Exception logs : ' + error);
    switch (error.constructor) {
        case errors.InvalidUUIDError:
        case errors.BookingRulesInvalid:
        case errors.FieldValidationError:
            this.setContextResError(context, error);
            break;
        case MongoError:
            this.handleMongoErrors(context, error);
            break;
        default:
            this.handleDefaultError(context, error);
            break;
    }
};


exports.validateUUIDField = (context, id, message = 'The customer id specified in the URL does not match the UUID v4 format.') => {
    return new Promise((resolve, reject) => {
        if (validator.isUUID(id, 4)) {
            resolve();
        } else {
            reject(
                new errors.InvalidUUIDError(message, 400)
            );
        }
    });
};

/**
 *
 * @param {any} context Context object from Azure function
 * @param {BaseError} error Custom error object of type base error
 */
exports.setContextResError = (context, error) => {
    context.res = {
        status: error.code,
        body: {
            code: error.code,
            description: error.message,
            reasonPhrase: error.name
        }
    };
};
exports.setOtherApiContextResError = (context, error) => {
    const body = {
        code: error.code,
        desciption: error.description,
        reasonPhrase: error.reasonPhrase
    };

    context.res = {
        status: error.code,
        body: body
    };
};
exports.handleDefaultError = (context, error) => {
    context.log.error(error.message || error);
    const response = error.error;
    if (response && response.reasonPhrase) {
        this.setOtherApiContextResError(context, error.error, error.statusCode);
    } else if (error.message.includes('Invalid URI')) {
        this.setContextResError(
            context,
            new errors.CustomerApiServerError(
                error.message,
                500
            )
        );
    } else {
        this.setContextResError(
            context,
            new errors.CustomerApiServerError(
                'Something went wrong. Please try again later',
                500
            )
        );
    }
};

exports.hashToken = token => crypto.createHash('sha512')
    .update(`${token}`)
    .digest('hex');

exports.handleMongoErrors = (context, error) => {
    switch (error.code) {
        case 11000:
            handleDuplicateDocumentInserts(context);
            break;
        default:
            this.handleDefaultError(context, error);
            break;
    }
};
const handleDuplicateDocumentInserts = context => {
    let className, entity;

    if (context.req.body.docType === 'customers') {
        className = 'DuplicateCustomerError';
        entity = 'customers';
    } else if (context.req.body.docType === 'resources') {
        className = 'DuplicateResourcesError';
        entity = 'resources';
    } else if (context.req.body.docType === 'resourceGroup') {
        className = 'DuplicateResourceGroupError';
        entity = 'resourceGroup';
    }

    this.setContextResError(
        context,
        new errors[className](
            `You've requested to create a new ${entity} but a ${entity} with the specified _id already exists.`,
            409
        )
    );
};