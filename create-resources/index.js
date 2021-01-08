const errors = require('../errors');
const utils = require('../utils');
const { getMongodbCollection } = require('../db/mongodb');


module.exports = async function (context, req) {
    try {
        await utils.validateUUIDField(context, req.params._id, 'The resources id specified in the URL does not match the UUID v4 format.');
        const collection = await getMongodbCollection('Customers');
        const result = await collection.insertOne(Object.assign(
            {},
            req.body,
            {
                docType: 'resources',
                createdDate: new Date(),
                updatedDate: new Date(),
                partitionKey: req.body._id
            }
        ));
        if (result) {
            context.res = {
                body: result.ops[0]
            };
        }
    } catch (error) {
        utils.handleError(context, error);
    }
}