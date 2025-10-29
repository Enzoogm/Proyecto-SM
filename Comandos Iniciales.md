# Inicializar los tests

PYTHONPATH=. pytest

# Inicializar backend

python -m venv .venv
source .venv/bin/activate
pip install flask
pip install mysql-connector-python
pip install flask-cors
pip install python-dotenv
pip install pytest-dotenv
pip install Flask python-dotenv PyJWT Werkzeug
pip install pytest pytest-mock pytest-cov
python -m supermercado.app

# Inicializar front-end

npm install

npm install axios
npm install bootstrap
npm install react-router-dom
npm install swiper
npm run dev
