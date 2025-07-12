const { NextFunction, Request, Response } = require("express");

/**
 * @param {(req: Request, res: Response, next: NextFunction ) => Promise<void>} func
 * @returns {(req: Request, res: Response, next: NextFunction ) => Promise<void>}
 */
exports.asyncRouteHandler = function (func) {
    return (req, res, next) => {
        Promise.resolve(func(req, res, next)).catch((err) => {
            // Assuming the err is Error | AppError
            res.status(err?.errorCode || 500).json({
                status: false,
                message: err.message,
                explaination: err?.explanation || "That's All We Know :)",
                data: null,
            });
        });
    };
};
