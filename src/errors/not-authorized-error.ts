import { CustomerError } from "./custome-error";

export class NotAuthorizedError extends CustomerError  {
    statusCode = 401
    reason = "Not authorized"
    constructor() {
        super("Not authorized");
        Object.setPrototypeOf(this, NotAuthorizedError.prototype)

    }

    serializeErrors() {
        return [{
            message: this.reason
        }]
    }
}