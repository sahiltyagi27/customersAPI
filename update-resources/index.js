const errors = require('../errors')
const utils = require('../utils')
const { getMongodbCollection } = require('../db/mongodb')
const { Promise } = require('bluebird')

module.exports = async function (context, req) {
    try {
        await utils.validateUUIDField(context, req.params.resourceID, 'The resources id specified in the URL does not match the specified UUID v4 format.')
        const collection = getMongodbCollection('Customers');
        const resources = collection.findOne({ _id: req.params.resourceID, partitionKey: req.params.resourceID, docType: 'resources' });
        let isMerchantLinked = false
        if (resources) {
            if (resources.adminRights && Array.isArray(resources.adminRights)) {
                resources.forEach(element => {
                    if (req.params.id === element.merchantID && (element.adminRights.roles == "admin")) {
                        isMerchantLinked = true
                    }
                });
            }
        } else {
            utils.setContextResError(
                context,
                new errors.ResourcesNotFoundError(
                    'The resources id specified in the url doesn\'t exist',
                    404
                )
            )
            Promise.resolve()
        }

        if (!isMerchantLinked) {
            utils.setContextResError(
                context,
                new errors.UserNotAuthenticatedError(
                    'Merchant is not valid to update these resources',
                    401
                )
            )
            Promise.resolve()
        }

        const result = await collection.updateOne({ _id: req.params.resourceID, partitionKey: req.params.resourceID, docType: 'resources' },
            {
                $set:
                    Object.assign(
                        {},
                        req.body,
                        { updatedDate: new Date() }
                    )
            });

        context.res = {
            body: result
        }

    } catch (error) {
        utils.handleError(context, error);
    }
}