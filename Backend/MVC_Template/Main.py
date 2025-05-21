from flask import Flask
from controllers.mainController import mainBlueprint

# create flask
main = Flask(__name__)

# register controller blueprint
main.register_blueprint(mainBlueprint)

# run dev server
if __name__ == '__main__':
    main.run(debug=True)