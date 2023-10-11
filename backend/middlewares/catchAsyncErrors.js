export default (controllerFunction) => (req, res, next) => {
  return Promise.resolve(controllerFunction(req, res, next)).catch(next);
};
