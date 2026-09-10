# PointFlavor (Vue + Vite, DDD-inspirado)

## Scripts
- `npm run dev` — arranca el frontend en http://localhost:5173
- `npm run api` — levanta json-server en http://localhost:3001

## Estructura
- `auth/` (login, register, role-select)
- `discovery/` (categorías, resultados, mapa)
- `promotions/`, `reviews/`, `memberships/`, `contact/`
- `shared/` (infra transversal y vistas comunes)

## Flujo
1. Ir a **/auth** para “loguearse” (usa email de `server/db.json` o regístrate).
2. Seleccionar rol en **/role**.
3. Explorar **/categories**, ver **/results?q=Pollo**, **/map**, **/promos**, **/plans**, **/contact**.

## Deploy en Vercel
Usa estos valores al crear el proyecto:
- **Framework**: Vite
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

Variables de entorno (Production y Preview):
- **Key**: `VITE_API_URL`
- **Value**: URL del backend (ej: `https://pflavor-backend-production.up.railway.app`)

Notas:
- No uses `/swagger` en `VITE_API_URL`, solo el host base.
- Si cambias `VITE_API_URL`, redeploy en Vercel para aplicar el cambio.


