const errors = require('../errors');
const utils = require('../utils');
const { getMongodbCollection } = require('../db/mongodb');


module.exports = async function (context, req) {
    try {
        await utils.validateUUIDField(context, req.params.id, 'The resources id specified in the URL does not match the UUID v4 format.');
        const collection = await getMongodbCollection.collection('Customers');
        const resources = await collection.findOne({ _id: req.params.resourceID, partitionKey: req.params.resourceID, docType: 'resources' });
        let isMerchantLinked = false;
        if (resources) {
            if (resources.adminRights && Array.isArray(resources.adminRights)) {
                resources.adminRights.forEach(element => {
                    if (req.params.id === element.merchantID) {   //Validate whether user is allowed to see merchant data or not?
                        isMerchantLinked = true;
                    }
                });
            }
        } else {
            utils.setContextResError(
                context,
                new errors.ResourcesNotFoundError(
                    'The resources id specified in the URL doesn\'t exist.',
                    404
                )
            );
            return Promise.resolve();
        }
        if (!isMerchantLinked) {
            utils.setContextResError(
                context,
                new errors.UserNotAuthenticatedError(
                    'Merchant is not valid to delete these resources',
                    401
                )
            );
            return Promise.resolve();
        }
        const result = await collection.deleteOne({
            docType: 'resources',
            _id: req.params.resourceID,
            partitionKey: req.params.resourceID
        });
        if (result && result.deletedCount === 1) {
            context.res = {
                body: {
                    code: 200,
                    description: 'Successfully deleted the specified resources'
                }
            };
        } else {
            utils.setContextResError(
                context,
                new errors.ResourcesNotFoundError(
                    'The resources id specified in the URL doesn\'t exist.',
                    404
                )
            );
        }
    } catch (error) {
        utils.handleError(context, error);
    }
};

