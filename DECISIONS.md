# DECISIONS.md

Aquí resumo de forma rápida las decisiones técnicas que tomé para armar el proyecto, buscando el equilibrio ideal entre rapidez de desarrollo, mantenibilidad y el cumplimiento exacto de los requerimientos.

---

## 1. Stack Tecnológico

### **Frontend: React + Vite**
* **¿Por qué?** Vite es mil veces más rápido que el viejo *Create React App* al desarrollar y empaqueta genial para producción.
* **Estado:** Lo manejé con el estado nativo de React (`useState` / `useEffect`) junto con componentes bien modularizados (`PromotionForm`, `PromotionList`, `SummaryCards`). Para el alcance de este módulo no hacía falta meter Redux o Context API, era meterle complejidad extra sin necesidad.
* **Estilos:** Usé estilos directos/módulos para mantener la interfaz limpia, responsiva y funcional sin engordar el bundle con librerías de componentes pesadas.

---

### **Backend: Node.js con Express**
* **¿Por qué?** Levantar una API REST funcional en Express toma minutos, el manejo de JSON es nativo y mantiene un mismo lenguaje (JavaScript) en todo el proyecto.
* **Arquitectura:** Separación simple y clara (Rutas $\rightarrow$ Controladores $\rightarrow$ Servicios $\rightarrow$ Modelos). Esto permite tener bien aislada la lógica del negocio (validar fechas, topes del 100% de descuento y los cambios de estado) de la parte que atiende los endpoints.

---

### **Base de Datos: PostgreSQL + ORM**
* **¿Por qué?** Postgres es un motor relacional sólido, súper confiable con datos en transacciones y se integra perfecto con Docker.
* **Estructura (2 tablas):** Cumpliendo con la restricción de la prueba, armé dos tablas principales (`promotions` y `promotion_targets`) para soportar la relación de que una promoción se le pueda aplicar a uno o varios productos/categorías.
* **ORM:** Utilizar un ORM facilita correr las migraciones automáticamente al levantar el contenedor y evita problemas de inyección SQL.

---

## 2. Docker & Docker Compose

* **Builds optimizados:** Las imágenes de Docker usan *multi-stage building*. Esto significa que compilan todo en un entorno temporal y al final entregan una imagen súper ligera (sirviendo el Frontend con Nginx y el Backend con Node Alpine).
* **Orquestación (`docker-compose.yml`):**
  * Levanta la BD (Postgres), Backend y Frontend con una sola orden.
  * Tiene configurado el `healthcheck` de la BD para que el backend espere a que Postgres esté verdaderamente listo antes de intentar conectarse.
  * El endpoint `/health` del backend no solo responde con un texto fijo; hace una consulta rápida a la base de datos (`SELECT 1`) para confirmar que el backend *y* la conexión a la base de datos están operativos al 100%.

---

## 3. Pipeline de CI/CD (GitHub Actions)

El flujo en `.github/workflows/ci.yml` corre por etapas dependientes (`lint` $\rightarrow$ `test` $\rightarrow$ `build` $\rightarrow$ `smoke-test`):

1. **Lint & Test:** Pasa las revisiones de código y corre los tests unitarios de las validaciones de negocio.
2. **Build:** Construye las imágenes Docker para asegurar que todo empaque sin romper.
3. **Smoke Test de Integración:** 
   * Levanta los contenedores en el runner de GitHub con `docker-compose up -d`.
   * Espera a que la app inicie y le hace una petición `curl` al endpoint `/health`.
   * Si `/health` responde `200 OK` (lo que certifica app + base de datos andando), el pipeline pasa a verde; si no, rompe explícitamente.

---

## 4. Secretos y Variables de Entorno

* **Cero credenciales expuestas:** No hay claves, passwords ni URLs de BD hardcodeadas en ningún archivo del repo.
* **`.env.example`:** Queda la plantilla lista para que cualquiera sepa qué variables se necesitan (`DB_HOST`, `DB_PASSWORD`, `PORT`, etc.) sin revelar datos reales.
* **GitHub Secrets:** Los valores reales se inyectan en tiempo de ejecución en el pipeline de GitHub Actions usando Secrets. Si falta alguna variable obligatoria al intentar correr la app, el proceso se frena de inmediato.