export default request =>
  new Promise((resolve, reject) => {
    request.setEncoding('utf8');
    let body = '';
    request.on('error', error =>
      reject(`Connection failure when receiving request: ${error}`)
    );
    request.on('data', data => (body += data));
    request.on('end', () =>
      new Promise(resolve => resolve(JSON.parse(body)))
        .then(resolve)
        .catch(error => reject(`Couldn't parse JSON: ${error}`))
    );
  });
