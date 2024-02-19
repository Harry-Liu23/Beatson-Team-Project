import $ from 'jquery';

async function sendJsonToFlask(json, url) {
  const request = $.ajax({
    url: url,
    headers: {
      'accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      },
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(json)
  })
    
    if (request.ok) {
    return request;
  }
  return null;
}

export default sendJsonToFlask;