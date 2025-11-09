import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse
import pymysql

# CONFIGURAÇÃO DO BANCO
mydb = pymysql.connect(
    host="localhost",
    user="root",
    password="root",
    database="filmes",
    charset="utf8mb4",
    cursorclass=pymysql.cursors.DictCursor
)

# ---------------- FUNÇÕES AUXILIARES ----------------

def carregar_filmes():
    cursor = mydb.cursor()
    try:
        cursor.execute("""
            SELECT 
                f.id_filme, f.titulo, f.orcamento, f.tempo_duracao, f.ano,
                p.link_poster, t.link_trailer
            FROM filme f
            LEFT JOIN poster p ON f.id_filme = p.id_filme
            LEFT JOIN trailer t ON f.id_filme = t.id_filme
            ORDER BY f.id_filme ASC
        """)
        result = cursor.fetchall()
        return [
            {
                "id_filme": row["id_filme"],
                "titulo": row["titulo"],
                "orcamento": row["orcamento"],
                "tempo_duracao": str(row["tempo_duracao"]),
                "ano": row["ano"],
                "poster": row["link_poster"],
                "trailer": row["link_trailer"]
            } for row in result
        ]
    finally:
        cursor.close()

def carregar_filme_por_id(id_filme):
    cursor = mydb.cursor()
    try:
        cursor.execute("""
            SELECT 
                f.id_filme, f.titulo, f.orcamento, f.tempo_duracao, f.ano,
                p.link_poster, t.link_trailer
            FROM filme f
            LEFT JOIN poster p ON f.id_filme = p.id_filme
            LEFT JOIN trailer t ON f.id_filme = t.id_filme
            WHERE f.id_filme = %s
        """, (id_filme,))
        row = cursor.fetchone()
        if not row:
            return None
        return {
            "id_filme": row["id_filme"],
            "titulo": row["titulo"],
            "orcamento": row["orcamento"],
            "tempo_duracao": str(row["tempo_duracao"]),
            "ano": row["ano"],
            "poster": row["link_poster"],
            "trailer": row["link_trailer"]
        }
    finally:
        cursor.close()

def carregar_generos():
    cursor = mydb.cursor()
    try:
        cursor.execute("SELECT id_genero, nome_genero FROM genero ORDER BY nome_genero ASC")
        return [{"id": row["id_genero"], "nome": row["nome_genero"]} for row in cursor.fetchall()]
    finally:
        cursor.close()

def cadastrar_filme(data):
    cursor = mydb.cursor()
    try:
        # Inserir filme
        cursor.execute(
            "INSERT INTO filme (titulo, orcamento, tempo_duracao, ano) VALUES (%s, %s, %s, %s)",
            (data["titulo"], data.get("orcamento"), data.get("tempo_duracao"), data.get("ano"))
        )
        id_filme = cursor.lastrowid

        # Inserir poster e trailer
        if data.get("poster"):
            cursor.execute(
                "INSERT INTO poster (id_filme, link_poster) VALUES (%s, %s)",
                (id_filme, data["poster"])
            )
        if data.get("trailer"):
            cursor.execute(
                "INSERT INTO trailer (id_filme, link_trailer) VALUES (%s, %s)",
                (id_filme, data["trailer"])
            )

        # Inserir gêneros (data["generos"] é uma lista de nomes)
        if data.get("generos"):
            for nome_genero in data["generos"]:
                cursor.execute(
                    "SELECT id_genero FROM genero WHERE nome_genero=%s",
                    (nome_genero,)
                )
                row = cursor.fetchone()
                if row:
                    cursor.execute(
                        "INSERT INTO filme_genero (id_filme, id_genero) VALUES (%s, %s)",
                        (id_filme, row["id_genero"])
                    )

        mydb.commit()
        return id_filme
    except Exception as e:
        mydb.rollback()
        raise e
    finally:
        cursor.close()

# ---------------- HANDLER PRINCIPAL ----------------

class APIHandler(BaseHTTPRequestHandler):

    # Enviar JSON
    def _send_json(self, data, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode("utf-8"))

    # Enviar erro
    def _send_error(self, message, code=400):
        self._send_json({"error": message}, code)

    # CORS
    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    # GET
    def do_GET(self):
        parsed = urlparse(self.path)
        path_parts = parsed.path.strip("/").split("/")

        if self.path == "/filmes":
            return self._send_json(carregar_filmes())

        elif len(path_parts) == 2 and path_parts[0] == "filmes":
            try:
                id_filme = int(path_parts[1])
                filme = carregar_filme_por_id(id_filme)
                if filme:
                    return self._send_json(filme)
                else:
                    return self._send_error("Filme não encontrado", 404)
            except ValueError:
                return self._send_error("ID inválido", 400)

        elif self.path == "/generos":
            return self._send_json(carregar_generos())

        else:
            return self._send_error("Rota não encontrada", 404)

    # POST
    def do_POST(self):
        if self.path != "/filmes":
            return self._send_error("Rota não encontrada", 404)

        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length).decode("utf-8")

        try:
            data = json.loads(body)
        except json.JSONDecodeError:
            return self._send_error("JSON inválido", 400)

        if not data.get("titulo"):
            return self._send_error("Campo 'titulo' é obrigatório", 400)

        try:
            novo_id = cadastrar_filme(data)
            return self._send_json({"mensagem": "Filme cadastrado com sucesso", "id_filme": novo_id}, 201)
        except Exception as e:
            return self._send_error(f"Erro ao cadastrar filme: {str(e)}", 500)

# ---------------- SERVIDOR ----------------

def main():
    server_address = ("", 8000)
    httpd = HTTPServer(server_address, APIHandler)
    print("API rodando aqui ó --> http://localhost:8000")
    httpd.serve_forever()

if __name__ == "__main__":
    main()
