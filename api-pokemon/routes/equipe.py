from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import PokemonUsuario

equipe_bp = Blueprint("equipe", __name__)

@equipe_bp.route("/", methods=["GET"])
@jwt_required()
def listar_equipe():
    usuario_id = int(get_jwt_identity())
    # Filtra por usuário E por GrupoBatalha = True
    equipe = PokemonUsuario.query.filter_by(IDUsuario=usuario_id, GrupoBatalha=True).all()
    return jsonify([{
        "idPokemonUsuario": e.IDPokemonUsuario,
        "idUsuario": e.IDUsuario,
        "idTipoPokemon": e.IDTipoPokemon,
        "codigo": e.Codigo,
        "imagemUrl": e.ImagemUrl,
        "nome": e.Nome,
        "grupoBatalha": e.GrupoBatalha,
        "favorito": e.Favorito
    } for e in equipe])

@equipe_bp.route("/", methods=["POST"])
@jwt_required()
def adicionar_equipe():
    usuario_id = int(get_jwt_identity())
    data = request.get_json()
    
    # Validar campos obrigatórios
    if not data or "idPokemonUsuario" not in data:
        return jsonify({"msg": "ID do Pokemon é obrigatório"}), 400
    
    id_pokemon_usuario = data["idPokemonUsuario"]
    
    # Verificar se o Pokémon existe e pertence ao usuário
    pokemon = PokemonUsuario.query.filter_by(
        IDPokemonUsuario=id_pokemon_usuario, 
        IDUsuario=usuario_id
    ).first()
    
    if not pokemon:
        return jsonify({"msg": "Pokémon não encontrado"}), 404
    
    # Verificar se já está na equipe
    if pokemon.GrupoBatalha:
        return jsonify({"msg": "Pokémon já está na equipe"}), 400
    
    # Verificar limite de 6 Pokémon na equipe
    equipe_count = PokemonUsuario.query.filter_by(
        IDUsuario=usuario_id, 
        GrupoBatalha=True
    ).count()
    
    if equipe_count >= 6:
        return jsonify({"msg": "A equipe já tem 6 Pokémon"}), 400
    
    # Adicionar à equipe
    pokemon.GrupoBatalha = True
    db.session.commit()
    
    return jsonify({"msg": "Pokémon adicionado à equipe!"})

@equipe_bp.route("/<int:id_pokemon_usuario>", methods=["DELETE"])
@jwt_required()
def remover_equipe(id_pokemon_usuario):
    usuario_id = int(get_jwt_identity())
    
    # Buscar o Pokémon que pertence ao usuário
    pokemon = PokemonUsuario.query.filter_by(
        IDPokemonUsuario=id_pokemon_usuario, 
        IDUsuario=usuario_id
    ).first()
    
    if not pokemon:
        return jsonify({"msg": "Pokémon não encontrado"}), 404
    
    # Remover da equipe (mas manter como favorito se for o caso)
    pokemon.GrupoBatalha = False
    db.session.commit()
    
    return jsonify({"msg": "Pokémon removido da equipe!"})

# Rota para trocar Pokémon na equipe
@equipe_bp.route("/trocar", methods=["PUT"])
@jwt_required()
def trocar_pokemon_equipe():
    usuario_id = int(get_jwt_identity())
    data = request.get_json()
    
    if not data or "sair" not in data or "entrar" not in data:
        return jsonify({"msg": "IDs de saída e entrada são obrigatórios"}), 400
    
    id_sair = data["sair"]
    id_entrar = data["entrar"]
    
    # Verificar Pokémon que vai sair
    pokemon_sair = PokemonUsuario.query.filter_by(
        IDPokemonUsuario=id_sair, 
        IDUsuario=usuario_id
    ).first()
    
    if not pokemon_sair or not pokemon_sair.GrupoBatalha:
        return jsonify({"msg": "Pokémon para remover não encontrado na equipe"}), 404
    
    # Verificar Pokémon que vai entrar
    pokemon_entrar = PokemonUsuario.query.filter_by(
        IDPokemonUsuario=id_entrar, 
        IDUsuario=usuario_id
    ).first()
    
    if not pokemon_entrar:
        return jsonify({"msg": "Pokémon para adicionar não encontrado"}), 404
    
    if pokemon_entrar.GrupoBatalha:
        return jsonify({"msg": "Pokémon já está na equipe"}), 400
    
    # Fazer a troca
    pokemon_sair.GrupoBatalha = False
    pokemon_entrar.GrupoBatalha = True
    
    db.session.commit()
    
    return jsonify({"msg": "Troca realizada com sucesso!"})