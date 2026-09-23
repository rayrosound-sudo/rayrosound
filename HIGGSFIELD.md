# Higgsfield assets for rayrosound.com

Сайт уже работает без сгенерированных ассетов: hero рисует canvas-хейз (`js/haze.js`),
секция F1 показывает фото-постер. Как только файлы ниже появятся в `assets/video/`,
сайт подхватит их сам, без правок кода.

## Подключение Higgsfield к Claude Code (один раз, в интерактивной сессии)

```bash
claude mcp add --transport http --scope user higgsfield https://mcp.higgsfield.ai/mcp
```

Затем в Claude Code: `/mcp` → войти через аккаунт Higgsfield (OAuth). Перезапустить Claude Code, если тулы не появились.

## Что генерировать (4 файла)

| Файл | Что это | Спека |
|---|---|---|
| `assets/video/hero.mp4` | фон hero | 8–10 с seamless loop, 1920×1080, H.264, **< 3 MB**, без звука, без людей, без текста |
| `assets/video/hero-poster.jpg` | первый кадр hero | 1920×1080, JPEG q80, < 250 KB |
| `assets/video/f1.mp4` | фон секции F1 | 8–10 с loop, 1920×1080, < 3 MB; если есть реальная съёмка с Yas Marina — лучше она |
| `assets/img/textures/{sand,water,glass}.jpg` | разделители (опционально) | 1600×900, JPEG q75 |

## Промты (Higgsfield, в этом порядке)

**Hero loop**
> Slow cinematic loop: desert heat haze at golden hour dissolving into a calm ocean surface, seen from a low angle. Warm sand and bone tones against near-black shadows, one soft ember-orange glow on the horizon (#C75B2A), no sun disc. Very slow drift, almost still, seamless loop, no people, no text, no lens flares. Film grain, 35mm, anamorphic softness. 10 seconds.

**Hero — вариант B (если А слишком «пустой»)**
> Macro of light passing through a glass of water on a stone table at sunset, refractions moving very slowly across a sand-coloured wall. Monochrome warm palette, one ember accent. Seamless 8-second loop, no text, no people.

**F1 loop (если нет реальной съёмки)**
> Night at a Formula 1 circuit, long exposure feel: light trails along the pit straight, grandstand glow, heat shimmer above tarmac. Desaturated, near-black with sand highlights and a single ember accent. Slow camera drift, seamless 10-second loop, no logos, no cars in focus, no text.

**Textures (по одному)**
> Sand grain macro, raking light, warm bone tones, near-black shadows, still, 16:9.
> Water surface at dusk, soft ripples, desaturated sand-and-ink palette, still, 16:9.
> Light through frosted glass, slow gradient, bone and graphite, still, 16:9.

Правило для всех: палитра сайта `#F2F0EC / #D8D2C7 / #0E0E0D / #2A2A28`, акцент `#C75B2A` максимум одним пятном. Никаких фиолетово-синих градиентов.

## Сжать перед коммитом

```bash
ffmpeg -i in.mp4 -an -vf "scale=1920:-2,fps=24" -c:v libx264 -crf 28 -preset slow -movflags +faststart -pix_fmt yuv420p assets/video/hero.mp4
ffmpeg -i assets/video/hero.mp4 -frames:v 1 -q:v 3 assets/video/hero-poster.jpg
```

Цель: hero.mp4 меньше 3 MB. Если больше, поднять `-crf` до 30–32.
