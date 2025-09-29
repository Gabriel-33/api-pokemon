import asyncio
import aiohttp
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import requests
from extensions import db
from models import PokemonUsuario

pokemon_bp = Blueprint("pokemon", __name__)
BASE_API_URL = "https://pokeapi.co/api/v2"

# -----------------------------
# Funções auxiliares
# -----------------------------
async def fetch_pokemon_details(session, url, user_favs):
    async with session.get(url) as response:
        detalhe = await response.json()

        pokemon_id = detalhe.get("id")
        codigo_pokemon = str(pokemon_id).zfill(3)

        status_db = user_favs.get(codigo_pokemon)
        return {
            "id": pokemon_id,
            "name": detalhe.get("name"),
            "codigo": codigo_pokemon,
            "imageUrl": detalhe.get("sprites", {}).get("front_default"),
            "types": [t["type"]["name"] for t in detalhe.get("types", [])],
            "IsFav": status_db.Favorito if status_db else False,
            "IsTeamBattle": status_db.GrupoBatalha if status_db else False,
        }


async def listar_async(urls, user_favs):
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_pokemon_details(session, url, user_favs) for url in urls]
        return await asyncio.gather(*tasks)


# -----------------------------
# Rota principal (paginação)
# -----------------------------
@pokemon_bp.route("/", methods=["GET"])
@jwt_required(optional=True)
def listar_pokemons():
    user_id = get_jwt_identity()
    limit = request.args.get("limit", default=20, type=int)
    offset = request.args.get("offset", default=0, type=int)

    url = f"{BASE_API_URL}/pokemon?limit={limit}&offset={offset}"

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
    except requests.exceptions.RequestException:
        return jsonify({"msg": "Erro ao buscar Pokémons na API externa."}), 500

    data = response.json()

    # Buscar favoritos do usuário em 1 query só
    user_favs = {}
    if user_id:
        registros = PokemonUsuario.query.filter_by(IDUsuario=user_id).all()
        user_favs = {r.Codigo: r for r in registros}

    urls = [item["url"] for item in data["results"]]

    detailed_results = asyncio.run(listar_async(urls, user_favs))

    return jsonify({
        "count": data.get("count"),
        "next": data.get("next"),
        "previous": data.get("previous"),
        "results": detailed_results
    })


# -----------------------------
# Buscar por nome/ID
# -----------------------------
@pokemon_bp.route("/search/<string:name_or_id>", methods=["GET"])
@jwt_required(optional=True)
def buscar_por_nome(name_or_id):
    user_id = get_jwt_identity()
    url = f"{BASE_API_URL}/pokemon/{name_or_id.lower()}"

    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        detalhe = response.json()
    except requests.exceptions.RequestException:
        return jsonify({"msg": f"Pokémon '{name_or_id}' não encontrado."}), 404

    pokemon_id = detalhe.get("id")
    codigo_pokemon = str(pokemon_id).zfill(3)

    status_db = None
    if user_id:
        status_db = PokemonUsuario.query.filter_by(IDUsuario=user_id, Codigo=codigo_pokemon).first()

    return jsonify({
        "id": pokemon_id,
        "name": detalhe.get("name"),
        "codigo": codigo_pokemon,
        "imageUrl": detalhe.get("sprites", {}).get("front_default"),
        "types": [t["type"]["name"] for t in detalhe.get("types", [])],
        "IsFav": status_db.Favorito if status_db else False,
        "IsTeamBattle": status_db.GrupoBatalha if status_db else False
    })
# -----------------------------
# Buscar por geracao
# -----------------------------
@pokemon_bp.route("/generation/<string:name_or_id>", methods=["GET"])
@jwt_required(optional=True)
def buscar_por_geracao_otimizada(name_or_id):
    user_id = get_jwt_identity()
    
    url = f"https://pokeapi.co/api/v2/generation/{name_or_id.lower()}"
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        dados_geracao = response.json()
    except requests.exceptions.RequestException:
        return jsonify({"msg": f"Geração '{name_or_id}' não encontrada."}), 404
    
    # Buscar status dos Pokémon no banco (apenas se logado)
    mapa_pokemon_usuario = {}
    if user_id:
        pokemons_usuario = PokemonUsuario.query.filter_by(IDUsuario=user_id).all()
        mapa_pokemon_usuario = {p.Codigo: p for p in pokemons_usuario}
    
    # Versão otimizada: não busca detalhes individuais, usa informações básicas
    pokemons_da_geracao = []
    
    for especie in dados_geracao.get("pokemon_species", []):
        especie_name = especie["name"]
        pokemon_id = especie["url"].split("/")[-2]
        codigo_pokemon = str(pokemon_id).zfill(3)
        status_db = mapa_pokemon_usuario.get(codigo_pokemon)
        
        # Usa imagem padrão sem buscar detalhes (mais rápido)
        pokemon_info = {
            "id": int(pokemon_id),
            "name": especie_name,
            "codigo": codigo_pokemon,
            "imageUrl": f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{pokemon_id}.png",
            "types": [],  # Deixar vazio ou buscar depois se necessário
            "IsFav": status_db.Favorito if status_db else False,
            "IsTeamBattle": status_db.GrupoBatalha if status_db else False
        }
        
        pokemons_da_geracao.append(pokemon_info)
    
    # Ordenar por ID
    pokemons_da_geracao.sort(key=lambda x: x["id"])
    
    return jsonify({
        "geracao": {
            "id": dados_geracao.get("id"),
            "name": dados_geracao.get("name"),
            "regiao_principal": dados_geracao.get("main_region", {}).get("name"),
            "total_pokemons": len(pokemons_da_geracao)
        },
        "pokemons": pokemons_da_geracao
    })

# -----------------------------
# Favoritos
# -----------------------------
@pokemon_bp.route("/favoritos", methods=["GET"])
@jwt_required()
def listar_favoritos():
    usuario_id = int(get_jwt_identity())
    favs = PokemonUsuario.query.filter_by(IDUsuario=usuario_id, Favorito=True).all()
    return jsonify([{
        "idPokemonUsuario": f.IDPokemonUsuario,
        "idUsuario": f.IDUsuario,
        "idTipoPokemon": f.IDTipoPokemon,
        "codigo": f.Codigo,
        "imageUrl": f.ImagemUrl,
        "nome": f.Nome,
        "IsTeamBattle": f.GrupoBatalha,
        "IsFav": f.Favorito
    } for f in favs])


@pokemon_bp.route("/campoBatalha", methods=["GET"])
@jwt_required()
def listar_campo_de_batalha():
    usuario_id = int(get_jwt_identity())
    battle = PokemonUsuario.query.filter_by(IDUsuario=usuario_id, GrupoBatalha=True).all()
    return jsonify([{
        "idPokemonUsuario": f.IDPokemonUsuario,
        "idUsuario": f.IDUsuario,
        "idTipoPokemon": f.IDTipoPokemon,
        "codigo": f.Codigo,
        "imageUrl": f.ImagemUrl,
        "nome": f.Nome,
        "IsTeamBattle": f.GrupoBatalha,
        "IsFav": f.Favorito
    } for f in battle])


# -----------------------------
# Adicionar favorito
# -----------------------------
@pokemon_bp.route("/adicionarFavorito", methods=["POST"])
@jwt_required()
def adicionar_favorito():
    usuario_id = int(get_jwt_identity())
    data = request.get_json()

    if not data or "idTipoPokemon" not in data or "codigo" not in data or "imagemUrl" not in data or "nome" not in data:
        return jsonify({"msg": "Dados incompletos"}), 400

    existing = PokemonUsuario.query.filter_by(IDUsuario=usuario_id, Codigo=data["codigo"]).first()
    if existing:
        existing.Favorito = data.get("favorito", True)
        existing.GrupoBatalha = data.get("grupoBatalha", False)
        db.session.commit()
        return jsonify({"msg": "Favorito atualizado!"})

    novo = PokemonUsuario(
        IDUsuario=usuario_id,
        IDTipoPokemon=data["idTipoPokemon"],
        Codigo=data["codigo"],
        ImagemUrl=data["imagemUrl"],
        Nome=data["nome"],
        GrupoBatalha=data.get("grupoBatalha", False),
        Favorito=True
    )
    db.session.add(novo)
    db.session.commit()
    return jsonify({"msg": "Favorito adicionado!", "id": novo.IDPokemonUsuario})


# -----------------------------
# Remover favorito
# -----------------------------
@pokemon_bp.route("/<int:id_pokemon_usuario>", methods=["DELETE"])
@jwt_required()
def remover_favorito(id_pokemon_usuario):
    usuario_id = int(get_jwt_identity())
    fav = PokemonUsuario.query.filter_by(IDPokemonUsuario=id_pokemon_usuario, IDUsuario=usuario_id).first()

    if not fav:
        return jsonify({"msg": "Favorito não encontrado"}), 404

    fav.Favorito = False
    db.session.commit()
    return jsonify({"msg": "Favorito removido!"})


# -----------------------------
# Alternar favorito
# -----------------------------
@pokemon_bp.route("/<int:id_pokemon_usuario>/toggle", methods=["PUT"])
@jwt_required()
def alternar_favorito(id_pokemon_usuario):
    usuario_id = int(get_jwt_identity())
    fav = PokemonUsuario.query.filter_by(IDPokemonUsuario=id_pokemon_usuario, IDUsuario=usuario_id).first()

    if not fav:
        return jsonify({"msg": "Pokemon não encontrado"}), 404

    fav.Favorito = not fav.Favorito
    db.session.commit()

    status = "favoritado" if fav.Favorito else "desfavoritado"
    return jsonify({"msg": f"Pokemon {status}!", "favorito": fav.Favorito})

# -----------------------------
# Adicionar favorito
# -----------------------------
@pokemon_bp.route("/adicionarCampoBatalha", methods=["POST"])
@jwt_required()
def adicionar_campo_batalha():
    usuario_id = int(get_jwt_identity())
    data = request.get_json()

    if not data or "idTipoPokemon" not in data or "codigo" not in data or "imagemUrl" not in data or "nome" not in data:
        return jsonify({"msg": "Dados incompletos"}), 400

    existing = PokemonUsuario.query.filter_by(IDUsuario=usuario_id, Codigo=data["codigo"]).first()
    if existing:
        existing.Favorito = data.get("favorito", False)
        existing.GrupoBatalha = data.get("grupoBatalha", True)
        db.session.commit()
        return jsonify({"msg": "Campo de batalha atualizado!"})

    novo = PokemonUsuario(
        IDUsuario=usuario_id,
        IDTipoPokemon=data["idTipoPokemon"],
        Codigo=data["codigo"],
        ImagemUrl=data["imagemUrl"],
        Nome=data["nome"],
        GrupoBatalha=True,
        Favorito=data["favorito"]
    )
    db.session.add(novo)
    db.session.commit()
    return jsonify({"msg": "Campo de batalha adicionado!", "id": novo.IDPokemonUsuario})
