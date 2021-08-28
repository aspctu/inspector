### inspector workers 

Workers are websocket clients that recieve a stream of changes when connected to `ws://[INSPECTOR_URL]:8085`. Workers can listen to these changes for specific keywords and execute functions. The output of these functions are written back to the main file by `POST https://[INSPECTOR_URL]:8765` with the updated file. 

An example worker is provided in `search-worker.py`. It replaces any instance of `search:` with `you have searched something here`. 