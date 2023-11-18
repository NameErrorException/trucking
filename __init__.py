import threading, os

def start_be():
    os.system('python be/app.py')

def start_fe():
    os.system('cd fe & npm run dev')

threading.Thread(target=start_be).start()
threading.Thread(target=start_fe).start()