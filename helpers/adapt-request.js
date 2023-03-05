module.exports = function adaptRequest (req = {}) {
  return Object.freeze({
    path: req.path,
    method: req.method,
    pathParams: req.params,
    queryParams: req.query,
    correlationId: req.correlationId(),
    body: req.body
  })
}
