import process from 'process';

export default request => {
  if (process.env.ADMIN_USERNAME == null || process.env.ADMIN_PASSWORD == null
      || !request.headers.authorization
      || !request.headers.authorization.startsWith('Basic ')) {
    return false;
  }
  const [username, password] =
    new Buffer(request.headers.authorization.slice(6), 'base64')
      .toString().split(':');
  return username == process.env.ADMIN_USERNAME
    && password == process.env.ADMIN_PASSWORD;
};
