# rayrosound.com — DNS в Porkbun (сайт + почта)

Регистратор и DNS: Porkbun (аккаунт `rayro`). Nameservers оставить порк-баневские
(`curitiba/fortaleza/maceio/salvador.ns.porkbun.com`), ничего не переносить.

## 1. Сайт (GitHub Pages)

Сначала удалить две дефолтные записи Porkbun:

- `ALIAS  rayrosound.com → uixie.porkbun.com`
- `CNAME  *.rayrosound.com → uixie.porkbun.com`

Добавить:

| Type  | Host | Answer                      | TTL |
|-------|------|-----------------------------|-----|
| A     | (пусто) | 185.199.108.153          | 600 |
| A     | (пусто) | 185.199.109.153          | 600 |
| A     | (пусто) | 185.199.110.153          | 600 |
| A     | (пусто) | 185.199.111.153          | 600 |
| CNAME | www  | rayrosound-sudo.github.io   | 600 |

Через 10–30 минут: GitHub → repo `rayrosound` → Settings → Pages → появится «DNS check successful» → поставить галку **Enforce HTTPS**. Сертификат выпускается автоматически.

Проверка: `dig +short rayrosound.com` должен вернуть четыре адреса 185.199.x.153.

## 2. Почта bookings@rayrosound.com (Zoho Mail Free)

Порядок: сначала завести аккаунт Zoho и получить оттуда точные значения, потом менять DNS.

1. zoho.com/mail → Forever Free → добавить домен `rayrosound.com`.
2. Верификация домена: Zoho даст TXT `zoho-verification=zb…` → добавить в Porkbun (Host пусто).
3. Создать ящик `bookings@rayrosound.com`, имя «Sviatlana Leonava».
4. Удалить в Porkbun дефолтную почту:
   - `MX fwd1.porkbun.com` и `MX fwd2.porkbun.com`
   - `TXT v=spf1 include:_spf.porkbun.com ~all`
5. Добавить (значения из мастера Zoho, ниже типовые для US-региона):

| Type | Host            | Answer                                   | Prio |
|------|-----------------|------------------------------------------|------|
| MX   | (пусто)         | mx.zoho.com                              | 10   |
| MX   | (пусто)         | mx2.zoho.com                             | 20   |
| MX   | (пусто)         | mx3.zoho.com                             | 50   |
| TXT  | (пусто)         | v=spf1 include:zoho.com ~all             |      |
| TXT  | zmail._domainkey| (DKIM из Zoho: Admin → Email Authentication → DKIM) | |
| TXT  | _dmarc          | v=DMARC1; p=none; rua=mailto:bookings@rayrosound.com | |

EU-регион Zoho: `mx.zoho.eu` / `include:zohomail.eu`.

6. В Zoho включить IMAP/SMTP (Settings → Mail Accounts), при 2FA сделать app-password.
7. Gmail (аккаунт, где будет жить mailer) → Settings → Accounts → «Send mail as» → `bookings@rayrosound.com`, SMTP `smtp.zoho.com:465 SSL`, логин = адрес, пароль = app-password. Подтвердить кодом из Zoho-ящика.
8. Тест: письмо себе → «Show original» → SPF, DKIM, DMARC = PASS.
9. Прогрев 7 дней по `~/vcprogram/rayro_email_setup.md` (шаг 3), потом mailer.

Домен новый (зарегистрирован 23.09.2026), холодные письма без прогрева уйдут в спам.

## 3. Что сделать позже

- `rayro.me`: если Dynadot ещё даёт выкупить, взять и поставить редирект 301 на rayrosound.com (в Porkbun или Dynadot «URL forwarding»). Инстаграм-ник @rayro.me остаётся.
- Cloudflare не нужен: GitHub Pages сам даёт CDN и HTTPS.
