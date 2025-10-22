PYTHONPATH=. pytest


python -m venv .venv
source .venv/bin/activate
pip install flask
pip install mysql-connector-python
pip install flask-cors
pip install python-dotenv
pip install pytest pytest-mock pytest-cov
python -m supermercado.app

npm init -y

npm install
#cd front....

# Para hacer peticiones a tu backend Flask

npm install axios
npm install bootstrap
npm install react-router-dom
npm install swiper
npm run dev

export FLASK_APP=supermercado.app
export FLASK_ENV=development
flask run --debug
