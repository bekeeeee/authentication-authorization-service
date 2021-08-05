import { ValidationError } from "express-validator"
import { CustomerError } from "./custome-error";
export class RequestValidationError extends CustomerError {
    statusCode = 400

    constructor(public errors: ValidationError[]) {
        super("Invalid request validation");
        Object.setPrototypeOf(this, RequestValidationError.prototype)

    }
    serializeErrors() {
        return this.errors.map(err => {
            return {
                message: err.msg, field: err.param
            }
        })
    }
}