## inspector
`inspector` exposes a REST API and Websocket connection that communicates changes in a filesystem to clients. Changes are sent to the client via the Websocket route with the following schema. 
```
{
  "type" : "change", 
  "change" : str of added text (changes) in file, 
  "fp": path of changed file
}
```

### quickstart
run `node index.js` with `.env` file populated


`inspector` also exposes an API service that allows clients to get the full contents of a file `GET /document` or `POST /document` to make changes to an existing document. 
## API

### GET /document
`GET /document` expects an absolute filepath as a URL query param like this: 

`GET /document/?filepath=/Users/abqader/Desktop/notes/daily/2021-08-28.md`.

The endpoint responds with the file. 

### POST /document 
`POST /document` expects a file upload as `file` and a body param `filepath`. Here's an example of calling this endpoint from a Python client: 

```
import requests
file = "A test file\n No way!"
buffer = io.BytesIO(file.encode())
files = {'file': buffer}
r = requests.post(f"{API_URL}/document", files=files, data={"filepath": filepath})
```

If successful, it'll respond with a 200 status code and body `{status: "success"}` else it'll respond with a 400 status code and body describing the error. 

## worker 

An example worker can be found in `/worker/`. 
