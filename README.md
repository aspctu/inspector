# inspector

### overview
`inspector` exposes a REST API and Websocket connection that communicates changes in a filesystem to clients. Changes are sent to the client via the Websocket route with the following schema. The REST API allows clients to write and read files from the filesystem. 


```
{
  "type" : "change" | "add" 
  "change" : str of added text (changes) in file, 
  "fp": path of changed file
}
```
`inspector` also exposes routes to get the full contents of a file `GET /document` or `POST /document` to make changes to an existing document. 

### quickstart
- run `node index.js` with `.env` file populated to start the `inspector` server. 
- connect via websocket at url `ws://localhost:8085` 

# REST API

## GET /document
```
GET /document 
  
  params:
    - filepath: the absolute file path of the file you'd like to read 
  
  response:
    - 200: returns the file object 
    - 400: "No filepath was provided.""

  example:
    - GET /document/?filepath=/Users/abqader/Desktop/notes/daily/2021-08-28.md`
```

## POST /document 
```
POST /document

  params: 
    - files: a file object 
    - filepath: a request body param of the filepath you'd like to write to

  response:
    - 200: "{ status: "success" }"
    - 400: "No files were uploaded"

   example: 
    import requests
    file = "A test file\n No way!"
    buffer = io.BytesIO(file.encode())
    files = {'file': buffer}
    r = requests.post(f"{API_URL}/document", files=files, data={"filepath": filepath})
```

## worker 

An example client can be found in `/worker/`. 
