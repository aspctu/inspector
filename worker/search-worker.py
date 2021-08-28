import websocket
import _thread
import time
import json
import requests
import io 
import os
from dotenv import load_dotenv
load_dotenv()

WS_URL = os.getenv('WS_URL')
API_URL = os.getenv('API_URL')

def get_file(filepath):
    file = requests.get(f"{API_URL}/document", params={'filename': filepath})
    return file.content.splitlines()

def find_command(line):
    return line.find("search:") == 0

def execute_worker(filecontent):
    new_file = []
    for line in filecontent:
        line = line.decode() 
        if find_command(line):
            # parse line to get arguments / etc 
            # execute worker 
            new_file.append("you searched for something here")
        else:
            new_file.append(line + "\n")
    return new_file

def write(filepath): 
    nfile = get_file(filepath)
    nfile = execute_worker(nfile)
    nfile = ''.join(map(str, nfile))
    nfile = io.BytesIO(nfile.encode())
    files = {'file': nfile}
    r = requests.post(f"{API_URL}/document", files=files, data={"filepath" : filepath})

def on_message(ws, message):
    message = json.loads(message)
    if (message['type'] == "change"):
        if (message["change"] != ""):
            if (message["change"].find("search:") != -1):
                write(message["fp"])

def on_error(ws, error):
    print(error)

def on_close(ws, close_status_code, close_msg):
    print("closed")

def on_open(ws):
    print("opened")

ws = websocket.WebSocketApp(WS_URL,
                            on_open=on_open,
                            on_message=on_message,
                            on_error=on_error,
                            on_close=on_close)

ws.run_forever()