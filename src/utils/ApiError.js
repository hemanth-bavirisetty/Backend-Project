class ApiError extends Error {
	constructor(
		statusCode,
		message = "somemting went wrong...",
		errors = [],
		stack = ""
	) {
		super(message);
		this.statusCode = statusCode;
		this.message = message;
		this.data = null;
		this.stack = stack;
		this.errors = errors;

		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

export { ApiError };
