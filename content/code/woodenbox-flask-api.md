---
title: Woodenbox
description: "Source code of the flask api running on the server"
draft: false
ShowBreadCrumbs: false
ShowReadingTime: false
---

---

```python
import os
import requests

from flask import Flask, Response, request

PORT = 5000
ID_MIN = 201
ID_MAX = 254
VM_STARTING_ID = 210

app = Flask(__name__)

@app.route("/suspend")
def suspend():
    response = Response("Suspending...")    
    
    @response.call_on_close
    def on_close():
        os.system("sudo /usr/bin/systemctl suspend")   
    
    return response

@app.route("/poweroff")
def poweroff():
    response = Response("Powering off...")
    
    @response.call_on_close
    def on_close():
        os.system("sudo /usr/sbin/poweroff")
    
    return response

@app.route("/reboot")
def reboot():
    response = Response("Rebooting...")
    
    @response.call_on_close
    def on_close():
        os.system("sudo /usr/sbin/reboot")
    
    return response

@app.route("/start")
def start():
    id = request.args.get('id')

    if (id is None):
        return "Missing parameter ID", 400

    if (not id.isnumeric() or
        int(id) < ID_MIN or
        int(id) > ID_MAX):
        return "ID must be an integer between 201 and 254", 400
    
    if (int(id) < VM_STARTING_ID):
        response = Response(f"Starting container with id {id}...")
        action = f"sudo /usr/sbin/pct start {id}"
    else:
        response = Response(f"Starting VM with id {id}...")
        action = f"sudo /usr/sbin/qm start {id}"

    @response.call_on_close
    def on_close():
        os.system(action)
    
    return response

@app.route("/stop")
def stop():
    id = request.args.get('id')

    if (id is None):
        return "Missing parameter ID", 400

    if (not id.isnumeric() or
        int(id) < ID_MIN or
        int(id) > ID_MAX):
        return "ID must be an integer between 201 and 254", 400
    
    if (int(id) < VM_STARTING_ID):
        response = Response(f"Shutting down container with id {id}...")
        action = f"sudo /usr/sbin/pct shutdown {id}"
    else:
        response = Response(f"Shutting down VM with id {id}...")
        action = f"sudo /usr/sbin/qm shutdown {id}"

    @response.call_on_close
    def on_close():
        os.system(action)
    
    return response

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=PORT)
```
