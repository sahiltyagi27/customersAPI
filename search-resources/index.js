const errors = require('../errors')
const utils = require('../utils')
const { getMongodbCollection } = require('../db/mongodb')

module.exports = async function (context, req) {

    try {
        utils.validateUUIDField(context, req.params.resourceID, 'The resources id specified in the URL does not match the UUID v4 format.');
        const collection = getMongodbCollection('Customers')
        if (!req.body) {
            req.body = {};
        }
        const resources = collection.find(req.body);
        let isMerchantLinked = false
        if (resources) {
            if (resources.adminRights && Array.isArray(resources.adminRights)) {
                resources.adminRights.forEach(element => {
                    if (req.params.id === element.merchantID) {
                        isMerchantLinked = true
                    }
                });
                return Promise.resolve();
            }
        } else {
            utils.setContextResError(
                context,
                new errors.ResourcesNotFoundError(
                    'The resources id specified in the URL doesn\'t exist.',
                    404
                )
            )
        }

        if (!isMerchantLinked) {
            utils.setContextResError(
                context,
                new errors.UserNotAuthenticatedError(
                    'Merchant is not valid to read these resources.',
                    401
                ));
            return Promise.resolve();
        }
        context.res = {
            body: resources
        }


    } catch (error) {
        utils.handleError(context, error);
    }
}