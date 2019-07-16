export default (response, {
  error = null,
  denyAuthorization = false,
  redirect = null,
  status = 200,
  json = null
} = {}) => {
  if (error) {
    console.error(
      `${response.req.method} ${response.req.originalUrl}: ${error}`);
  }
  if (denyAuthorization) {
    response.set('WWW-Authenticate', 'Basic realm="Access to protected '
    + 'resources or services."');
    response.status(401).end();
  } else if (redirect) {
    response.redirect(status, redirect);
  } else {
    response.status(status);
  }
  if (json) {
    response.set('Content-Type', 'application/json');
    response.json(json);
  } else {
    response.end();
  }
};
