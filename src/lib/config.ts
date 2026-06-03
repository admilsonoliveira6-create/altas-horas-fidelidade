// ============================================================
//  CONFIGURAÇÃO DO CLIENTE
//  Edite apenas este arquivo para adaptar o app a um novo negócio
// ============================================================

const config = {

  // --- IDENTIDADE DA MARCA ---
  nome: 'Altas Horas',
  subtitulo: 'Depósito e Mercearia · Califórnia',
  iniciais: 'AH',          // 2-3 letras para o ícone circular

  // --- CORES (HEX) ---
  corPrimaria: '#D91F26',   // fundo principal
  corSecundaria: '#F5C518', // destaques, pontos, CTAs
  corTexto: '#1A1A1A',      // texto sobre cor secundária

  // --- REGRA DE PONTOS ---
  // Ex: a cada R$1 comprado = 1 ponto
  reaisPorPonto: 1,         // R$1 = 1 ponto | R$2 = 0.5 ponto

  // --- PRÊMIOS ---
  premios: [
    {
      id: 'premio1',
      nome: 'Cerveja Grátis',
      descricao: '1 long neck gelada na hora',
      pontos: 200,
      emoji: '🍺',
    },
    {
      id: 'premio2',
      nome: 'Fardo Grátis',
      descricao: 'Fardo 12 latas da sua escolha',
      pontos: 500,
      emoji: '📦',
    },
  ],

  // --- CONTATO ---
  whatsapp: '5524999999999',  // com DDI+DDD, sem espaços ou símbolos

  // --- RODAPÉ DA TELA DE LOGIN ---
  tagline: 'R$1 comprado = 1 ponto. Simples assim.',

}

export default config

// ============================================================
//  EXEMPLOS DE OUTROS CLIENTES:
//
//  Padaria:
//    nome: 'Pão Quente'
//    corPrimaria: '#8B4513'  (marrom)
//    corSecundaria: '#FFD700' (dourado)
//    reaisPorPonto: 2        (R$2 = 1 ponto)
//    premios: [{ nome: 'Café Grátis', pontos: 50 }, { nome: 'Pão na Chapa', pontos: 100 }]
//
//  Açougue:
//    nome: 'Açougue do João'
//    corPrimaria: '#8B0000'  (vermelho escuro)
//    corSecundaria: '#FFFFFF'
//    premios: [{ nome: '1kg Frango Grátis', pontos: 300 }]
//
//  Lava-rápido:
//    nome: 'Brilha Car'
//    corPrimaria: '#003087'  (azul)
//    corSecundaria: '#00BFFF'
//    reaisPorPonto: 5        (R$5 = 1 ponto)
//    premios: [{ nome: 'Lavagem Grátis', pontos: 200 }]
// ============================================================
