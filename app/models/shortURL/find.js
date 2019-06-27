/* Placeholder. */
export default async (query, {
  sort = null,
  limit = null
} = {}) => {
  const database = [[0, {path: 'abc', destination: 'http://example.com'}]];
  let results = database;
  for (const key in query) {
    results = results.filter(([id, shortURL]) => shortURL[key] == query[key]);
  }
  return results;
};
