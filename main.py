import subprocess, signal, string, random, re, json, datetime, time, os, socket, requests, csv, glob
from flask import Flask, request, send_from_directory, jsonify, render_template, redirect, send_file
from flask_socketio import SocketIO, emit, Namespace

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret'
socketio = SocketIO(app, async_mode=None)

# Activate things for the thermometer
# os.system('modprobe w1-gpio')
# os.system('modprobe w1-therm')
# thermometer_device_base_dir = '/sys/bus/w1/devices/'
# device_folder = glob.glob(thermometer_device_base_dir + '28*')[0]
# device_file = device_folder + '/w1_slave'

working_dir = os.path.dirname(os.path.abspath(__file__)) # get our current working directory
os.chdir(working_dir)

@app.route('/')
def main():
    return render_template('thermometer.html')

"""retrieves static files"""
# @app.route('/static/<path:path>')
def send_static(path):
    return app.send_static_file(path)
    # return send_from_directory('static', path)
    
# Thermometer Functions
"""def get_raw_temp():
    f = open(device_file, 'r')
    lines = f.readlines()
    f.close()
    return lines
def get_temp():
    lines = get_raw_temp()
    while lines[0].strip()[-3:] != 'YES':
        # time.sleep(0.2)
        lines = get_raw_temp()
    equals_pos = lines[1].find('t=')
    if equals_pos != -1:
        temp_string = lines[1][equals_pos+2:]
        temp_c = float(temp_string) / 1000.0
        temp_f = temp_c * 9.0 / 5.0 + 32.0
        return temp_c, temp_f"""

# CSV Functions
def write_to_csv():
    with open('tempurature_data.csv', 'a') as file:
        file.write("{}, {}\n".format(3, 7))
        file.close()

def get_thermo_csv_list():
    with open("tempurature_data.csv", 'r') as file:
        csv_list = [[val.strip() for val in r.split(",")] for r in file.readlines()]
        file.close()
    return csv_list

@app.route('/get-thermo-csv_as-list')
def send_thermo_csv_as_list():
    return str(get_thermo_csv_list())

@app.route('/get-thermo-csv')
def send_thermo_csv_as_csv():
    return send_file('tempurature_data.csv', as_attachment=True)

@socketio.on('getLiveData')
def live_thermo_data():
    print('requested live data')
    emit('incomingData', {'data': str(get_thermo_csv_list())})

"""Set our on connect function for SocketIO"""
@socketio.on('connect')
def on_connect():
    print("Client Connected")
    write_to_csv()

"""Set our on disconnect function for socketIO"""
@socketio.on('disconnect')
def on_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    # app.run(port=3000, host='0.0.0.0')
    socketio.run(app, host='0.0.0.0', port=5000,  debug=True)