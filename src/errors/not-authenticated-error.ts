import { CustomerError } from "./custome-error";

export class NotAuthenticated extends CustomerError {
  statusCode = 401;
  reason = "Not authenticated";
  constructor() {
    super("Not authenticated");
    Object.setPrototypeOf(this, NotAuthenticated.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
