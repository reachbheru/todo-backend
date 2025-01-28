const asyncHandler = (requestHandler) => async (req, res, next) => {
    try {
        await requestHandler(req, res, next); // Run the handler and await its result.
    } catch (error) {
        next(error); // Pass any errors to the next middleware.
    }
};

export { asyncHandler };