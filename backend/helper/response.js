class Response {

    static success(data = {}) {
        return {
            status: "success",
            data
        };
    }

    static fail(data = {}) {
        return {
            status: "fail",
            data
        };
    }

    static error(message = "An error occurred") {
        return {
            status: "error",
            message
        };
    }
}

module.exports = Response;
