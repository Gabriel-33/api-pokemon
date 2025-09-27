from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class Usuario(db.Model):
    # Tabela: 'usuario'
    IDUsuario = db.Column(db.Integer, primary_key=True)
    Nome = db.Column(db.String(120), unique=True, nullable=False)
    Login = db.Column(db.String(120), unique=True, nullable=False)
    Email = db.Column(db.String(120), unique=True, nullable=False)
    Senha = db.Column(db.String(200), nullable=False)
    DtInclusao = db.Column(db.Date, nullable=False)
    DtAlteracao = db.Column(db.Date, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def set_senha(self, senha):
        self.Senha = generate_password_hash(senha)

    def verificar_senha(self, senha):
        return check_password_hash(self.Senha, senha)

class TipoPokemon(db.Model):
    # Tabela: 'tipo_pokemon' (nome inferido pelo SQLAlchemy)
    IDTipoPokemon = db.Column(db.Integer, primary_key=True)
    Descricao = db.Column(db.String(120), unique=True, nullable=False)

class PokemonUsuario(db.Model):
    # Tabela: 'pokemon_usuario' (nome inferido pelo SQLAlchemy)
    IDPokemonUsuario = db.Column(db.Integer, primary_key=True)
    
    # Referenciando 'usuario' (minúsculas)
    IDUsuario = db.Column(db.Integer, db.ForeignKey("usuario.IDUsuario"), nullable=False)
    
    # CORREÇÃO FINAL: Referenciando a tabela 'tipo_pokemon' em snake_case
    IDTipoPokemon = db.Column(db.Integer, db.ForeignKey("tipo_pokemon.IDTipoPokemon"), nullable=False)
    
    Codigo = db.Column(db.String(120), unique=True, nullable=False)
    ImagemUrl = db.Column(db.String(120), unique=True, nullable=False)
    Nome = db.Column(db.String(120), unique=True, nullable=False)
    
    GrupoBatalha = db.Column(db.Boolean, nullable=False)
    Favorito = db.Column(db.Boolean, nullable=False)
