export default (response, {
  error = null,
  redirect = null,
  status = 200,
  json = null
} = {}) => {
  if (error) {
    console.error(
      `${response.req.method} ${response.req.originalUrl}: ${error}`);
  }
  if (redirect) {
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
