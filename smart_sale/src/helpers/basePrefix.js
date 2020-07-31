export const basePrefix = (base = '', request) => {
  let path = request.url.replace(/^\//,'');
  base = base.replace(/\/$/,'')

    request.url = `${base}/${path}`

  return request;
};
