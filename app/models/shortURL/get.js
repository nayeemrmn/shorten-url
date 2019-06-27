/* Placeholder. */
export default async id => {
  return id == 0 ? {path: 'abc', destination: 'http://example.com'}
    : Promise.reject(`No short URL with id: ${id}.`);
};
