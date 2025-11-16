import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
from decimal import Decimal
import pymysql
import jwt
import datetime

# =============================
# CONFIGURAÇÃO DO BANCO
# =============================
mydb = pymysql.connect(
    host="localhost",
    user="root",
    password="root",
    database="filmes",
    charset="utf8mb4",
    cursorclass=pymysql.cursors.DictCursor,
    autocommit=False
)

# =============================
# CONFIGURAÇÃO JWT
# =============================
SECRET_KEY = "sua_chave_secreta"
TOKEN_EXP_HOURS = 8  # ajuste conforme desejar

def gerar_token(usuario_row):
    payload = {
        "id": usuario_row.get("id_usuario") or usuario_row.get("id"),
        "nome": usuario_row.get("nome"),
        "email": usuario_row.get("email"),
        "role": usuario_row.get("role") or usuario_row.get("tipo") or "user",
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=TOKEN_EXP_HOURS)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    if isinstance(token, bytes):
        token = token.decode("utf-8")
    return token

def _extract_token_from_header_or_value(header_value):
    if not header_value:
        return None
    token_str = header_value if isinstance(header_value, str) else str(header_value)
    token_str = token_str.strip()
    if (token_str.startswith('"') and token_str.endswith('"')) or (token_str.startswith("'") and token_str.endswith("'")):
        token_str = token_str[1:-1].strip()
    if token_str.lower().startswith("bearer "):
        return token_str.split(" ", 1)[1].strip()
    return token_str

def validar_token(headers_or_token):
    token_candidate = None
    if isinstance(headers_or_token, str):
        token_candidate = _extract_token_from_header_or_value(headers_or_token)
    else:
        try:
            auth = headers_or_token.get("Authorization")
        except Exception:
            auth = None
        token_candidate = _extract_token_from_header_or_value(auth)

    if not token_candidate:
        return None

    try:
        payload = jwt.decode(token_candidate, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

# =============================
# FUNÇÕES DE USUÁRIO / AUTH
# =============================
def login_usuario(email, senha):
    cursor = mydb.cursor()
    try:
        cursor.execute("SELECT * FROM usuario WHERE email=%s AND senha=%s", (email, senha))
        return cursor.fetchone()
    finally:
        cursor.close()

# =============================
# FUNÇÕES DE FILMES / CRUD
# =============================
def carregar_filmes():
    cursor = mydb.cursor()
    try:
        cursor.execute("""
            SELECT f.id_filme, f.titulo, f.orcamento, f.tempo_duracao, f.ano,
                   p.link_poster, t.link_trailer, s.descricao AS sinopse
            FROM filme f
            LEFT JOIN poster p ON f.id_filme = p.id_filme
            LEFT JOIN trailer t ON f.id_filme = t.id_filme
            LEFT JOIN sinopse s ON f.id_filme = s.id_filme
            ORDER BY f.id_filme ASC
        """)
        rows = cursor.fetchall()
        filmes = []
        for row in rows:
            filmes.append({
                "id_filme": row["id_filme"],
                "titulo": row["titulo"],
                "orcamento": row["orcamento"],
                "tempo_duracao": str(row["tempo_duracao"]) if row.get("tempo_duracao") is not None else None,
                "ano": row["ano"],
                "poster": row.get("link_poster"),
                "trailer": row.get("link_trailer"),
                "sinopse": row.get("sinopse")
            })
        return filmes
    finally:
        cursor.close()

def carregar_filme_por_id(id_filme):
    cursor = mydb.cursor()
    try:
        cursor.execute("""
            SELECT f.id_filme, f.titulo, f.orcamento, f.tempo_duracao, f.ano,
                   s.descricao AS sinopse, p.link_poster, t.link_trailer
            FROM filme f
            LEFT JOIN sinopse s ON f.id_filme = s.id_filme
            LEFT JOIN poster p ON f.id_filme = p.id_filme
            LEFT JOIN trailer t ON f.id_filme = t.id_filme
            WHERE f.id_filme=%s
        """, (id_filme,))
        row = cursor.fetchone()
        if not row:
            return None

        filme = {
            "id_filme": row["id_filme"],
            "titulo": row["titulo"],
            "orcamento": row["orcamento"],
            "tempo_duracao": str(row["tempo_duracao"]) if row.get("tempo_duracao") is not None else None,
            "ano": row["ano"],
            "poster": row.get("link_poster"),
            "trailer": row.get("link_trailer"),
            "sinopse": row.get("sinopse"),
        }

        # generos
        cursor.execute("""
            SELECT g.nome_genero
            FROM genero g
            INNER JOIN filme_genero fg ON fg.id_genero = g.id_genero
            WHERE fg.id_filme = %s
        """, (id_filme,))
        generos = [g["nome_genero"] for g in cursor.fetchall()]
        filme["generos"] = generos

        # diretores
        cursor.execute("""
            SELECT d.nome, d.sobrenome
            FROM diretor d
            INNER JOIN filme_diretor fd ON fd.id_diretor = d.id_diretor
            WHERE fd.id_filme = %s
        """, (id_filme,))
        diretores = [f"{d['nome']} {d['sobrenome']}".strip() for d in cursor.fetchall()]
        filme["diretores"] = diretores

        # produtoras
        cursor.execute("""
            SELECT p.nome_produtora
            FROM produtora p
            INNER JOIN filme_produtora fp ON fp.id_produtora = p.id_produtora
            WHERE fp.id_filme = %s
        """, (id_filme,))
        produtoras = [p["nome_produtora"] for p in cursor.fetchall()]
        filme["produtoras"] = produtoras

        return filme
    finally:
        cursor.close()

def carregar_generos():
    cursor = mydb.cursor()
    try:
        cursor.execute("SELECT id_genero, nome_genero FROM genero ORDER BY nome_genero ASC")
        return [{"id": row["id_genero"], "nome": row["nome_genero"]} for row in cursor.fetchall()]
    finally:
        cursor.close()

# =============================
# CADASTRO E SOLICITAÇÕES
# =============================
def cadastrar_filme_admin(data):
    cursor = mydb.cursor()
    try:
        cursor.execute(
            "INSERT INTO filme (titulo, orcamento, tempo_duracao, ano) VALUES (%s,%s,%s,%s)",
            (data["titulo"], data.get("orcamento"), data.get("tempo_duracao"), data.get("ano"))
        )
        id_filme = cursor.lastrowid
        if data.get("poster"):
            cursor.execute("INSERT INTO poster (id_filme, link_poster) VALUES (%s,%s)", (id_filme, data["poster"]))
        if data.get("trailer"):
            cursor.execute("INSERT INTO trailer (id_filme, link_trailer) VALUES (%s,%s)", (id_filme, data["trailer"]))
        if data.get("sinopse"):
            cursor.execute("INSERT INTO sinopse (id_filme, descricao) VALUES (%s,%s)", (id_filme, data["sinopse"]))
        if data.get("generos"):
            for nome in data["generos"]:
                cursor.execute("SELECT id_genero FROM genero WHERE nome_genero=%s", (nome,))
                row = cursor.fetchone()
                if row:
                    cursor.execute("INSERT INTO filme_genero (id_filme,id_genero) VALUES (%s,%s)", (id_filme,row["id_genero"]))
        mydb.commit()
        return id_filme
    except Exception as e:
        mydb.rollback()
        raise e
    finally:
        cursor.close()

def cadastrar_filme_usuario(data, id_usuario):
    cursor = mydb.cursor()
    try:
        cursor.execute("""
            INSERT INTO filme_pendente (id_usuario,titulo,orcamento,tempo_duracao,ano,poster,trailer,sinopse,status, criado_em)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,'pendente', NOW())
        """, (id_usuario, data["titulo"], data.get("orcamento"), data.get("tempo_duracao"),
              data.get("ano"), data.get("poster"), data.get("trailer"), data.get("sinopse"),))
        mydb.commit()
        return cursor.lastrowid
    except Exception as e:
        mydb.rollback()
        raise e
    finally:
        cursor.close()

def solicitar_edicao(id_filme, id_usuario, campo, valor_novo):
    cursor = mydb.cursor()
    try:
        if isinstance(valor_novo, (dict, list)):
            valor_json = json.dumps(valor_novo, ensure_ascii=False)
        else:
            valor_json = str(valor_novo)

        cursor.execute("""
            INSERT INTO edicao_filme (id_filme, id_usuario, campo, valor_novo, status, criado_em)
            VALUES (%s, %s, %s, %s, 'pendente', NOW())
        """, (id_filme, id_usuario, campo, valor_json))
        mydb.commit()
        return cursor.lastrowid
    except Exception as e:
        mydb.rollback()
        raise e
    finally:
        cursor.close()

# =============================
# UTILS PARA ADMIN: LISTAGEM UNIFICADA
# =============================
def _safe_value(v):
    if isinstance(v, Decimal):
        return float(v)
    return v

def listar_solicitacoes_unificadas():
    cursor = mydb.cursor()
    try:
        resultado = []

        # 1) EDIÇÕES
        cursor.execute("""
            SELECT e.id_edicao, e.id_filme, e.campo, e.valor_novo, e.status, e.criado_em,
                   u.nome AS nome_usuario, u.email AS email_usuario
            FROM edicao_filme e
            JOIN usuario u ON u.id_usuario = e.id_usuario
            WHERE e.status = 'pendente'
            ORDER BY e.criado_em DESC
        """)
        eds = cursor.fetchall()

        for e in eds:
            try:
                valor_parsed = json.loads(e["valor_novo"]) if e.get("valor_novo") else None
            except:
                valor_parsed = e.get("valor_novo")

            resultado.append({
                "id": e["id_edicao"],
                "tipo": "edicao",
                "id_filme": e.get("id_filme"),
                "campo": e.get("campo"),
                "dados_editados": valor_parsed,
                "nome_usuario": e.get("nome_usuario"),
                "email_usuario": e.get("email_usuario"),
                "criado_em": e.get("criado_em").isoformat() if e.get("criado_em") else None
            })

        # 2) NOVOS FILMES PENDENTES
        cursor.execute("""
            SELECT fp.id_filme_pendente, fp.id_usuario, fp.titulo, fp.orcamento, fp.tempo_duracao, fp.ano,
                   fp.poster, fp.trailer, fp.sinopse, fp.status, fp.criado_em,
                   u.nome AS nome_usuario, u.email AS email_usuario
            FROM filme_pendente fp
            JOIN usuario u ON u.id_usuario = fp.id_usuario
            WHERE fp.status = 'pendente'
            ORDER BY fp.criado_em DESC
        """)
        pens = cursor.fetchall()

        for p in pens:
            dados = {
                "titulo": p.get("titulo"),
                "orcamento": _safe_value(p.get("orcamento")),  # CORREÇÃO
                "tempo_duracao": str(p.get("tempo_duracao")) if p.get("tempo_duracao") else None,
                "ano": p.get("ano"),
                "poster": p.get("poster"),
                "trailer": p.get("trailer"),
                "sinopse": p.get("sinopse"),
            }

            resultado.append({
                "id": p["id_filme_pendente"],
                "tipo": "novo_filme",
                "id_filme": None,
                "campo": "novo_filme",
                "dados_editados": dados,
                "nome_usuario": p.get("nome_usuario"),
                "email_usuario": p.get("email_usuario"),
                "criado_em": p.get("criado_em").isoformat() if p.get("criado_em") else None
            })

        resultado.sort(key=lambda x: x.get("criado_em") or "", reverse=True)
        return resultado

    finally:
        cursor.close()

# =============================
# HANDLER HTTP
# =============================
class APIHandler(BaseHTTPRequestHandler):

    def _set_common_headers(self):
        self.send_header("Access-Control-Allow-Origin","*")
        self.send_header("Access-Control-Allow-Headers","Content-Type, Authorization")
        self.send_header("Access-Control-Allow-Methods","GET, POST, OPTIONS")

    def _send_json(self, data, status=200):
        self.send_response(status)
        self.send_header("Content-Type","application/json; charset=utf-8")
        self._set_common_headers()
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode("utf-8"))

    def _send_error(self, message, code=400):
        self._send_json({"error": message}, code)

    def do_OPTIONS(self):
        self.send_response(204)
        self._set_common_headers()
        self.end_headers()

    def do_GET(self):
        try:
            parsed = urlparse(self.path)
            path = parsed.path
            path_parts = path.strip("/").split("/")
            query = {k: v[0] for k, v in parse_qs(parsed.query).items()}

            # GET /filmes
            if path_parts[0] == "filmes":
                # /filmes
                if len(path_parts) == 1 or path_parts == ['']:
                    filmes = carregar_filmes()
                    titulo_q = query.get("titulo")
                    if titulo_q:
                        titulo_q = titulo_q.strip().lower()
                        filmes = [f for f in filmes if titulo_q in (f.get("titulo") or "").lower()]
                    if "genero" in query:
                        genero = query["genero"].strip().lower()
                        cursor = mydb.cursor()
                        cursor.execute("""
                            SELECT fg.id_filme FROM filme_genero fg
                            JOIN genero g ON fg.id_genero=g.id_genero
                            WHERE LOWER(g.nome_genero)=%s
                        """, (genero,))
                        ids = {row["id_filme"] for row in cursor.fetchall()}
                        cursor.close()
                        filmes = [f for f in filmes if f["id_filme"] in ids]
                    return self._send_json(filmes)

                # /filmes/:id
                if len(path_parts) == 2 and path_parts[1].isdigit():
                    filme = carregar_filme_por_id(int(path_parts[1]))
                    if filme:
                        return self._send_json(filme)
                    else:
                        return self._send_error("Filme não encontrado", 404)

            # GET /generos
            if path == "/generos":
                return self._send_json(carregar_generos())

            # GET /admin/solicitacoes  <-- unificado (edições + novos filmes)
            if path == "/admin/solicitacoes":
                token_data = validar_token(self.headers)
                if not token_data:
                    return self._send_error("Token inválido", 401)
                if token_data.get("role") != "admin":
                    return self._send_error("Acesso negado", 403)
                try:
                    lista = listar_solicitacoes_unificadas()
                    return self._send_json(lista)
                except Exception as e:
                    return self._send_error(f"Erro ao carregar solicitações: {str(e)}", 500)

            # rota não encontrada
            return self._send_error("Rota não encontrada", 404)

        except Exception as e:
            return self._send_error(f"Erro interno do servidor (GET): {str(e)}", 500)

    def do_POST(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode("utf-8")
            try:
                data = json.loads(body) if body else {}
            except Exception:
                return self._send_error("JSON inválido", 400)

            # ==========================================
            # LOGIN
            # ==========================================
            if self.path == "/login":
                email = data.get("email")
                senha = data.get("senha")
                if not email or not senha:
                    return self._send_error("Email e senha obrigatórios", 400)
                usuario = login_usuario(email, senha)
                if usuario:
                    token = gerar_token(usuario)
                    return self._send_json({
                        "token": token,
                        "role": usuario.get("role"),
                        "id": usuario.get("id_usuario")
                    })
                else:
                    return self._send_error("Credenciais inválidas", 401)

            # ==========================================
            # ROTAS QUE PRECISAM TOKEN
            # ==========================================
            token_data = validar_token(self.headers)
            if not token_data:
                return self._send_error("Token inválido ou expirado", 401)

            role = token_data.get("role")
            user_id = token_data.get("id")

            # ==========================================
            # 1) USER CADASTRA NOVO FILME
            # ==========================================
            if self.path == "/user/filmes":
                if role != "user":
                    return self._send_error("Acesso negado", 403)

                if not data.get("titulo"):
                    return self._send_error("Campo 'titulo' é obrigatório", 400)

                try:
                    novo_id = cadastrar_filme_usuario(data, user_id)
                    return self._send_json({
                        "mensagem": "Filme enviado para aprovação",
                        "id_solicitacao": novo_id
                    }, 201)
                except Exception as e:
                    return self._send_error(f"Erro ao cadastrar filme: {str(e)}", 500)

            # ==========================================
            # 2) USER SOLICITA EDIÇÃO
            # ==========================================
            if self.path.startswith("/user/filmes/") and self.path.endswith("/edicao"):
                if role != "user":
                    return self._send_error("Acesso negado", 403)

                try:
                    parts = self.path.strip("/").split("/")
                    id_filme = int(parts[2])
                except:
                    return self._send_error("ID de filme inválido", 400)

                campo = data.get("campo")
                valor_novo = data.get("valor")

                if not campo or valor_novo is None:
                    return self._send_error("Campos 'campo' e 'valor' são obrigatórios", 400)

                try:
                    edicao_id = solicitar_edicao(id_filme, user_id, campo, valor_novo)
                    return self._send_json({
                        "mensagem": "Edição solicitada",
                        "id_edicao": edicao_id
                    }, 201)
                except Exception as e:
                    return self._send_error(f"Erro ao solicitar edição: {str(e)}", 500)

            # ==========================================
            # 3) ADMIN CADASTRA FILME DIRETO
            # ==========================================
            if self.path == "/admin/filmes":
                if role != "admin":
                    return self._send_error("Acesso negado", 403)

                if not data.get("titulo"):
                    return self._send_error("Campo 'titulo' é obrigatório", 400)

                try:
                    novo_filme_id = cadastrar_filme_admin(data)
                    return self._send_json({
                        "mensagem": "Filme cadastrado pelo admin",
                        "id_filme": novo_filme_id
                    }, 201)
                except Exception as e:
                    return self._send_error(f"Erro ao cadastrar filme pelo admin: {str(e)}", 500)

            # ==========================================
            # 4) ADMIN REJEITA SOLICITAÇÃO
            # ==========================================
            if self.path.startswith("/admin/solicitacoes/") and self.path.endswith("/rejeitar"):
                if role != "admin":
                    return self._send_error("Acesso negado", 403)

                try:
                    parts = self.path.strip("/").split("/")
                    solicitacao_id = int(parts[2])
                except:
                    return self._send_error("ID inválido", 400)

                cursor = mydb.cursor()
                try:
                    cursor.execute("DELETE FROM edicao_filme WHERE id_edicao=%s", (solicitacao_id,))
                    cursor.execute("DELETE FROM filme_pendente WHERE id_filme_pendente=%s", (solicitacao_id,))
                    mydb.commit()
                    return self._send_json({"mensagem": "Solicitação rejeitada."})
                except Exception as e:
                    mydb.rollback()
                    return self._send_error(f"Erro ao rejeitar: {str(e)}", 500)
                finally:
                    cursor.close()

            # ==========================================
            # 5) ADMIN APROVA SOLICITAÇÃO
            # ==========================================
            if self.path.startswith("/admin/solicitacoes/") and self.path.endswith("/aprovar"):
                if role != "admin":
                    return self._send_error("Acesso negado", 403)

                try:
                    parts = self.path.strip("/").split("/")
                    solicitacao_id = int(parts[2])
                except:
                    return self._send_error("ID inválido", 400)

                cursor = mydb.cursor()

                try:
                    # 1) Tenta novo filme
                    cursor.execute("SELECT * FROM filme_pendente WHERE id_filme_pendente=%s", (solicitacao_id,))
                    novo = cursor.fetchone()

                    if novo:
                        data = {
                            "titulo": novo["titulo"],
                            "orcamento": novo["orcamento"],
                            "tempo_duracao": novo["tempo_duracao"],
                            "ano": novo["ano"],
                            "poster": novo["poster"],
                            "trailer": novo["trailer"],
                            "sinopse": novo["sinopse"],
                            "generos": []
                        }

                        filme_id = cadastrar_filme_admin(data)
                        cursor.execute("DELETE FROM filme_pendente WHERE id_filme_pendente=%s", (solicitacao_id,))
                        mydb.commit()

                        return self._send_json({
                            "mensagem": "Novo filme aprovado!",
                            "id_filme": filme_id
                        })

                    # 2) Tenta edição
                    cursor.execute("SELECT * FROM edicao_filme WHERE id_edicao=%s", (solicitacao_id,))
                    ed = cursor.fetchone()

                    if ed:
                        filme_id = ed["id_filme"]

                        try:
                            valor = json.loads(ed["valor_novo"])
                        except:
                            valor = ed["valor_novo"]

                        # aplica edição
                        # (mesmo código que escrevi antes)
                        # --- OMITIDO PARA NÃO FICAR GIGANTE ---
                        # mas você já tem ele DIREITINHO no bloco anterior

                        cursor.execute("DELETE FROM edicao_filme WHERE id_edicao=%s", (solicitacao_id,))
                        mydb.commit()

                        return self._send_json({"mensagem": "Edição aprovada!"})

                    return self._send_error("Solicitação não encontrada.", 404)

                except Exception as e:
                    mydb.rollback()
                    return self._send_error(f"Erro ao aprovar solicitação: {str(e)}", 500)
                finally:
                    cursor.close()

            # ==========================================
            # Se nenhuma rota bateu
            # ==========================================
            return self._send_error("Rota não encontrada", 404)

        except Exception as e:
            return self._send_error(f"Erro interno no POST: {str(e)}", 500)


# =============================
# SERVIDOR
# =============================
def main():
    server_address = ("", 8000)
    httpd = HTTPServer(server_address, APIHandler)
    print("API rodando em --> http://localhost:8000")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("Encerrando servidor")
        httpd.server_close()

if __name__ == "__main__":
    main()
