# Video del Hero

Coloca aquí el archivo de video con movimiento suave:

    public/hero/hero-movimiento.mp4

Luego activa el video en `components/Hero.tsx`:

    videoSrc: null            ->  videoSrc: "/hero/hero-movimiento.mp4"

Mientras `videoSrc` sea `null`, el Hero muestra la imagen de fondo
(placeholder de Unsplash) para que nunca quede un bloque vacío.

Recomendaciones para el archivo:
- MP4 (H.264) y opcionalmente WebM como alternativa.
- Duración corta en bucle (5-12 s) para un peso razonable.
- Resolución 1920x1080, menos de ~3 MB.
- Sin audio (el elemento ya va con `muted`).
