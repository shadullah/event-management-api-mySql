const asyncHandler = (reqHandler) => {
  return (req, res, next) => {
    Promise.resolve(reqHandler(req, res, next)).catch((error) =>
      console.log(error)
    );
  };
};

export { asyncHandler };
