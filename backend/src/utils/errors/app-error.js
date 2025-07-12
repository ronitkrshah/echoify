class AppError extends Error {
    /** @type {number} */
    errorCode;
    /** @type {string} */
    explanation;

    /**
     * @param {string} message
     * @param {number} errorCode
     * @param {string} [explanation]
     */
    constructor(message, errorCode, explanation) {
        super(message);
        this.errorCode = errorCode;
        this.explanation = explanation || "Thats's All We Know";

        Object.setPrototypeOf(this, new.target.prototype);
    }
}

module.exports = AppError;
