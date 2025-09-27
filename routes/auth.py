from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from extensions import db
from models import Usuario
from datetime import datetime
from datetime import timedelta

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    # --- VALIDAÇÃO INICIAL ---
    required_fields = ["nome", "login", "email", "senha"]
    # Verifica se todas as chaves obrigatórias (em minúsculas) estão presentes
    if not all(field in data for field in required_fields):
        # MUDANÇA: Retorna erro 400 se os campos JSON estiverem ausentes
        return jsonify({"msg": "Campos 'nome', 'login', 'email' e 'senha' são obrigatórios."}), 400
    # --------------------------

    # Ao acessar as colunas do DB (Usuario.query.filter_by), usamos a capitalização do modelo (Email)
    # Ao acessar os dados JSON (data["email"]), usamos o nome padronizado (minúsculas)
    
    # Verifica se Email já existe
    if Usuario.query.filter_by(Email=data["email"]).first():
        return jsonify({"msg": "Email já cadastrado"}), 400
    
    # Verifica se Login já existe
    if Usuario.query.filter_by(Login=data["login"]).first():
        return jsonify({"msg": "Login já cadastrado"}), 400
    
    novo = Usuario(
        Nome=data["nome"], # Usando data["nome"] do JSON
        Login=data["login"], # Usando data["login"] do JSON
        Email=data["email"], # Usando data["email"] do JSON
        DtInclusao=datetime.utcnow().date(), 
        DtAlteracao=datetime.utcnow().date()
    )
    # Acessa a senha em minúsculas do JSON
    novo.set_senha(data["senha"])
    
    db.session.add(novo)
    db.session.commit()
    return jsonify({"msg": "Usuário registrado com sucesso!"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    # Verifica se as chaves de login (email e senha) estão presentes
    required_fields = ["email", "senha"]
    if not all(field in data for field in required_fields):
        return jsonify({"msg": "Campos 'email' e 'senha' são obrigatórios para login."}), 400
    
    # Busca pelo Email (usando a capitalização do modelo) com o dado em minúsculas (do JSON)
    usuario = Usuario.query.filter_by(Email=data["email"]).first()
    
    # Verifica a senha (usando a senha em minúsculas do JSON)
    if usuario and usuario.verificar_senha(data["senha"]):
        token = create_access_token(identity=str(usuario.IDUsuario),expires_delta=timedelta(days=1))
        return jsonify(access_token=token)
        
    return jsonify({"msg": "Credenciais inválidas"}), 401
