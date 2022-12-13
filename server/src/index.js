
const ENDPOINT = "https://api.openai.com/v1/completions";


TEMPLATE = `
GOAL:
ELI5 - Explain Like I'm 5
In the following phrase, explain the meaning of the selected context in 3-10 sentences max.

# Sentence
Good seeing you at <SELECTED>NeurIPS</SELECTED>! 
# Explain
NeurIPS is a conference for machine learning researchers.

---

# Sentence
 the CCP general secretary has been the <SELECTED>paramount leader</SELECTED> of the PRC.
# Explain
The paramount leader is an informal term for the most important political figure in China

---

# Sentence
<SELECTED>Joint Embedding</SELECTED>
# Explain
Joint embedding is a method for embedding words and phrases into a common vector space.
This allows for the comparison of words and phrases in a way that is not possible with traditional word embeddings.

---

# Sentence
{input}
# Explain
`

function applyTemplate(template, variables) {
    // Create a regular expression to match variable placeholders in the template
    const regex = /\{([^}]+)\}/g;
  
    // Use the replace() method to replace the variable placeholders with the corresponding values from the variables object
    return template.replace(regex, (match, variable) => variables[variable]);
}

function sendOpenAIRequest(template, inputs) {
    // Set the request headers
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAPI_KEY}`
    };
    
    console.log(applyTemplate(template, inputs))
    // Set the request body
    const body = JSON.stringify({
      prompt: applyTemplate(template, inputs),
      model: 'text-davinci-002',
      max_tokens: 100,
      temperature: 0.5,
      stop: ['---']
    });
  
    // Send the request
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: headers,
      body: body
    })
}


async function handleRequest(request) {
  const body = await request.json()
  const input = body.input
  const response = await sendOpenAIRequest(TEMPLATE, {'input': input})
  const headers = new Headers({
    "Content-Type": "application/json",
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type', // request.headers.get('Access-Control-Request-Headers'),
  })
  return new Response(response.body, {
      headers: headers,
      status: response.status,
      statusText: response.statusText
  })
}

async function handlePreflight(request) {
  // Set the CORS headers
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type'
  })

  // Return a new response with the CORS headers
  return new Response(null, {
    status: 200,
    statusText: 'OK',
    headers: headers
  })
}


addEventListener('fetch', event => {
  if (event.request.method === 'OPTIONS') {
    // Handle the preflight request
    event.respondWith(handlePreflight(event.request))
  } else {
    // Handle the actual request
    event.respondWith(handleRequest(event.request))
  }
})

