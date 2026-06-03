# Altas Horas Fidelidade — PWA

## Stack
- Next.js 15 (App Router)
- Tailwind CSS (cores da marca)
- Supabase (banco de dados)
- Service Worker manual (instalação PWA via WhatsApp)

## Telas
| Rota | Quem usa | O que faz |
|---|---|---|
| `/` | Cliente | Login/cadastro por telefone |
| `/dashboard` | Cliente | Saldo de pontos, prêmios, histórico |
| `/resgatar` | Cliente | Escolhe e confirma o resgate |
| `/admin` | Dono | Adiciona pontos após a venda |

## Regras de negócio
- R$1 comprado = 1 ponto (truncado: R$45,50 = 45 pts)
- 200 pontos = Cerveja grátis (long neck)
- 500 pontos = Fardo grátis (12 latas)
- Resgate desconta os pontos automaticamente

---

## Setup passo a passo

### 1. Node.js
Use Node.js 20 (LTS). A versão 24 tem um bug no webpack/Next.js.

**Com nvm (recomendado):**
```bash
nvm install 20
nvm use 20
```

**Sem nvm:** baixar Node.js 20 LTS em nodejs.org

### 2. Supabase
1. Criar projeto grátis em [supabase.com](https://supabase.com)
2. Abrir **SQL Editor** e rodar todo o conteúdo de `supabase-schema.sql`
3. Copiar as credenciais em **Project Settings → API**:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Variáveis de ambiente
```bash
cp .env.local.example .env.local
```
Editar `.env.local` com os dados do Supabase e trocar a senha do admin.

### 4. Instalar e rodar localmente
```bash
npm install
npm run dev
```
Abrir http://localhost:3000

### 5. Deploy na Vercel (recomendado — grátis)

**Opção A — Via GitHub:**
1. `git init && git add . && git commit -m "init"`
2. Criar repo no GitHub e fazer push
3. Importar no Vercel: [vercel.com/new](https://vercel.com/new)
4. Em **Environment Variables**, adicionar as 3 vars do `.env.local`
5. Deploy automático

**Opção B — Via Vercel CLI:**
```bash
npm i -g vercel
vercel --prod
# Configurar as env vars quando solicitado
```

**Importante:** A Vercel usa Node.js 20 por padrão — o build funciona perfeitamente lá.

### 6. Ícones PWA
Os ícones `public/icons/icon-192.png` e `public/icons/icon-512.png` já foram gerados.
Para regenerar com Pillow:
```bash
pip install Pillow
python gerar-icones.py
```

---

## Distribuição via WhatsApp
Depois do deploy, o link fica tipo `https://altashoras.vercel.app`.

Mensagem sugerida para o dono mandar:
> "Galera do Califórnia! Agora o Altas Horas tem cartão fidelidade digital.
> Cada R$1 comprado = 1 ponto. Com 200 pontos, cerveja grátis! 🍺
> Acessa aqui e já cadastra: https://altashoras.vercel.app"

No celular, ao abrir o link o browser mostra "Adicionar à tela inicial" — vira ícone igual a um app, sem passar pela Play Store.

---

## Painel do dono
Acesse `/admin` com a senha configurada em `NEXT_PUBLIC_ADMIN_PASSWORD`.
**Troque a senha antes de ir ao ar** — a padrão é `altashoras2026`.

Fluxo de uso no caixa:
1. Abrir `/admin` no celular do dono
2. Digitar o telefone do cliente
3. Digitar o valor da compra em R$
4. "Adicionar Pontos" → pronto

---

## Segurança (próximos passos)
- Mover o admin para autenticação via Supabase Auth (email/senha)
- Trocar RLS anon por service_role em API Routes para o admin
- OTP por SMS para os clientes (via Supabase + Twilio)
