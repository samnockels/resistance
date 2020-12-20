from flask import Flask, json
import resistance

app = Flask(__name__)

@app.route('/', methods=['GET'])
def home():
  return '''
    <html>hello</html>
  '''

@app.route('/hello-world', methods=['GET'])
def hello_world():
  hw = resistance.hello_world()
  return json.dumps({
    "data": hw
  })