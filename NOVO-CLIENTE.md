# Como criar um novo App de Fidelidade

## Tempo médio: 30 minutos

---

## Passo 1 — Copiar o projeto

No GitHub, abre o repositório `altas-horas-fidelidade` e clica em
**Use this template → Create a new repository**.

Nome sugerido: `fidelidade-[nome-do-cliente]`
Ex: `fidelidade-padaria-pao-quente`

---

## Passo 2 — Editar o config (1 arquivo só)

Abre `src/lib/config.ts` e preenche:

```ts
const config = {
  nome: 'Nome do Negócio',
  subtitulo: 'Tipo do negócio · Bairro',
  iniciais: 'PN',           // 2-3 letras para o ícone

  corPrimaria: '#D91F26',   // cor principal da marca
  corSecundaria: '#F5C518', // cor de destaque
  corTexto: '#1A1A1A',

  reaisPorPonto: 1,         // R$1 = 1 ponto

  premios: [
    { id: 'p1', nome: 'Prêmio 1', descricao: 'Descrição', pontos: 200, emoji: '🎁' },
    { id: 'p2', nome: 'Prêmio 2', descricao: 'Descrição', pontos: 500, emoji: '🏆' },
  ],

  whatsapp: '5524999999999',
  tagline: 'R$1 comprado = 1 ponto. Simples assim.',
}
```

**Só isso.** O app inteiro se adapta automaticamente.

---

## Passo 3 — Criar banco no Supabase

1. Novo projeto no supabase.com
2. SQL Editor → cola o `supabase-schema.sql` → Run
3. Copia URL e anon key

---

## Passo 4 — Deploy na Vercel

1. Importa o novo repositório GitHub na Vercel
2. Framework Preset: **Next.js**
3. Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ADMIN_PASSWORD` (senha do admin do cliente)
4. Deploy

---

## Passo 5 — Entregar ao cliente

- **Link do app:** `nome-do-projeto.vercel.app`
- **Link do admin:** `nome-do-projeto.vercel.app/admin`
- **Senha do admin:** a que você definiu no passo 4

---

## Precificação sugerida

| Serviço | Valor |
|---|---|
| Criação + configuração + deploy | R$ 300 |
| Manutenção mensal (suporte + ajustes) | R$ 50/mês |
| Domínio personalizado (ex: fidelidade.padaria.com.br) | R$ 50/ano |

**Custo mensal de infraestrutura para você: R$ 0**

---

## Paleta de cores por segmento

| Segmento | Primária | Secundária |
|---|---|---|
| Depósito / Bar | `#D91F26` | `#F5C518` |
| Padaria | `#8B4513` | `#FFD700` |
| Açougue | `#8B0000` | `#FFFFFF` |
| Lava-rápido | `#003087` | `#00BFFF` |
| Farmácia | `#006400` | `#FFFFFF` |
| Pizzaria | `#FF4500` | `#FFD700` |
| Salão de beleza | `#FF69B4` | `#FFD700` |
| Pet shop | `#4169E1` | `#FFA500` |
