# Promotion Management
## Se necesita

* **Docker Desktop** (con Docker Compose activo).
* **Git** (para clonar la vuelta).

---

## Variables de Entorno (.env)

El proyecto necesita un archivo `.env` en la raíz para que los contenedores sepan a qué puertos apuntar y cómo conectarse a la base de datos.

Crear un archivo llamado `.env` en la raíz de la carpeta y pégale esto:

Se encuentra un `.env.example` con las credenciales necesarias

---

## Paso a paso

### 1. Clonar el repositorio
git clone https://github.com/estiven0425/promotion-management.git
cd promotion-management

### 2. Armar el `.env`
Crear el archivo `.env` en la raíz con las variables.

### 3. Ejecutar Docker
docker compose up -d --build
### 4. Revisar que todo haya quedado bien
Para ver si los contenedores están arriba y en verde:

docker compose ps

---

## Dónde probar las aplicaciones
* **Frontend:** http://localhost (o el puerto que se haya puesto en FRONTEND_PORT)
* **Backend API:** http://localhost:3000 (o el puerto de BACKEND_PORT)
* **Postgres:** localhost:5432

---

##  Apagar o reiniciar

Para apagar los contenedores sin borrar los datos que ya estan en la BD:

docker compose down