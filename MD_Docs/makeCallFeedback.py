#!/usr/bin/env python3
import requests

import os

with open ('number.txt') as f:
    lines = f.readline()
number = lines[0:-1]
webhook =  "https://webhook.site/220d9b48-f807-4cd6-9421-52146bebce0e"

apiKey = 'sk-ov6c6hpxhx45p0wqretdf5e8g2mm6lirh0uiaku52zuksa452oeokla03gy2m0nu69'
model_level = ['base', 'enhanced','turbo']

voice = "maya"
task = "Build a minecraft server with bukkit plugins. Ask for their help"
temperature = 0.7 # Measure of random. # from 0 to 1
interruption_threshold = 100 # default (100)
webhook = 'https://webhook.site/220d9b48-f807-4cd6-9421-52146bebce0e'

context = [voice, task, temperature, interruption_threshold]

def makeCall(number, Context, webhook):
 # Headers
    headers = {
        'Authorization': apiKey
    }

    # Data
    data = {
        "phone_number": number,
        "task": task,
        "model": 'enhanced',
        "language": "en",
        "voice": "maya",
        "max_duration": 12,
        "record": True,
        "interruption_threshold": interruption_threshold,
        "temperature": temperature,
        "webhook": webhook,
    }

    # API request
    requests.post('https://api.bland.ai/v1/calls', json=data, headers=headers)

def giveFeedback(call_id,goal, questions):
    url = f"https://api.bland.ai/v1/calls/{call_id}/analyze"

    payload = {
        "goal": goal,
        "questions": questions
    }
    headers = {
        "authorization": apiKey,
        "Content-Type": "application/json"
    }

    response = requests.request("POST", url, json=payload, headers=headers)

    print(response.text)

# makeCall(number, context, webhook)
"""
Need to get call_id sent in .
"""

call_id = '010a71ed-7a27-4ba2-b45c-860ee229ba77'
goal = task
questions = [["Is it a man or a woman?", "man or woman"], ["Are they angry", "yes or no"]]
giveFeedback(call_id, goal, questions )
