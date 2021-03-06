import config from '../config.js';

export async function invokeApig(
  { path,
    method = 'GET',
    body}, userToken) {

  const url = `${config.apiGateway.URL}${path}`;
  const headers = {
    Authorization: userToken,
  };

  body = (body) ? JSON.stringify(body) : body;
  console.log("Ready to fetch");
  const results = await fetch(url, {
    method,
    body,
    headers
  });
  console.log("fecth complet");

  if (results.status !== 200) {
    throw new Error(await results.text());
  }

  return results.json();
}
