/**
 * @param {any} data
 */
exports.successResponse = function (data) {
    return {
        status: true,
        data,
    };
};
