# Capturas de pantalla (entrega TFM)

Coloca aquí **mínimo 5** imágenes PNG/JPG del sistema funcionando.

## Nombres sugeridos

| Archivo | Qué capturar |
|---------|----------------|
| `01-dashboard-principal.png` | Dashboard tras conectar MetaMask (tokens / pendientes) |
| `02-registro-usuario.png` | Pantalla `/register` con el formulario de rol y nombre |
| `03-tokens.png` | Lista de tokens o formulario de crear token |
| `04-transferencias.png` | Pendientes o historial en `/transfers` |
| `05-trazabilidad.png` | `/traceability` con linaje o historial de un token |
| `06-admin.png` (opcional) | Panel admin aprobando usuarios |
| `07-etherscan.png` (opcional) | Tx o contrato en Sepolia Etherscan |

## Cómo sacarlas (Windows)

1. En `frontend/.env.local` pon: `NEXT_PUBLIC_DEMO_UI=1`
2. Reinicia `npm run dev` (Anvil no es obligatorio solo para navegar UI vacía).
3. Abre http://localhost:3000 — verás el menú sin MetaMask (banner ámbar arriba).
4. En cada pantalla: `Win + Shift + S` → guarda PNG en esta carpeta.
5. **Antes de la demo/evaluación:** quita o comenta `NEXT_PUBLIC_DEMO_UI` y reinicia.

No hace falta editar código: solo imágenes claras y legibles.
