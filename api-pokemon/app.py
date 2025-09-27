from flask import Flask
from extensions import db, jwt
from routes.auth import auth_bp
from routes.equipe import equipe_bp
from routes.pokemon import pokemon_bp
# -----------------------------------------------------------------
# IMPORTANTE: Importar os modelos para que db.create_all() os encontre
# Se você tem uma pasta 'models', você pode precisar de 'from models import *'
# Assumindo que seu arquivo é apenas 'models.py' no mesmo nível:
import models 
# --------------- --------------------------------------------------

app = Flask(__name__)

# Configurações
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pokemon.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'pokemon'  # Altere para uma chave segura

# Inicializar extensões
db.init_app(app)
jwt.init_app(app)

# Registrar blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(pokemon_bp, url_prefix='/pokemon')
app.register_blueprint(equipe_bp, url_prefix='/equipe')

@app.route('/')
def hello():
    return 'API Pokemon funcionando!'

if __name__ == "__main__":
    with app.app_context():
        # Agora o db.create_all() deve funcionar, pois os modelos foram importados
        db.create_all()
    app.run(debug=True)
