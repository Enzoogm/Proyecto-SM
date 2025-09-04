
python -m venv .venv
source .venv/bin/activate
pip install flask
pip install mysql-connector-python

python -m supermercado.app



export FLASK_APP=supermercado.app
export FLASK_ENV=development
flask run --debug