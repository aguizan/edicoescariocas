/* =============================================================
   EDIÇÕES CARIOCAS — CONTEÚDO DO SITE (fonte única)
   -------------------------------------------------------------
   ESTE é o único arquivo que você edita para mudar o conteúdo.
   Vale para as DUAS versões: desktop (index.html) e mobile
   (celular.html). As duas leem daqui.

   ►► COMO ESCREVER OS TEXTOS ◄◄
   Há dois tipos de aspas neste arquivo:

   1) Textos curtos (título, autor, número) usam "aspas duplas".
      → NÃO aperte Enter dentro delas e NÃO use " no meio do texto.

   2) Textos longos (sinopse, descrição, parágrafos) usam crases: ` `
      (a tecla ` fica ao lado do número 1, canto superior esquerdo).
      → DENTRO das crases você PODE apertar Enter e escrever à vontade,
        inclusive com aspas " e apóstrofos '. A quebra de linha vira
        um novo parágrafo automaticamente.
      → O único caractere que NÃO pode aparecer dentro das crases é a
        própria crase ` .

   • Itens de lista são separados por vírgula.
   • Imagens: informe o caminho do arquivo, ex.: "assets/capa/x.jpg".
     Deixe "" para mostrar um placeholder.
   ============================================================= */

window.CONTEUDO = {

  marca: "Edições Cariocas",

  /* ---------- 01 · MISSÃO ---------- */
  missao: {
    kicker: "01 · Missão",
    titulo: "Missão",
    // Escreva livremente entre as crases. Pule linha para separar parágrafos.
    texto: `A Edições Cariocas não é um lugar físico; ela pulsa na vontade de cada um de transformar o seu próprio ambiente em um território de criação.

Nossa missão vai além dos livros: existimos para difundir o conhecimento compartilhado, empolgar através da arte, da literatura e dos fazeres manuais, transformando a realidade local e ressignificando nossa essência cultural.`
  },

  /* ---------- 02 · QUEM SOMOS ---------- */
  quem: {
    kicker: "02 · Quem somos",
    titulo: "Quem somos",
    texto: `A Edições Cariocas nasceu do desejo de olhar para o Rio de Janeiro além dos cartões-postais. Crescemos sob o compasso de uma cidade que respira história e transforma sua própria geografia em poesia.

Somos um selo independente dedicado a dar voz e força à identidade carioca. Através dos livros, da música, das artes e da preservação do patrimônio cultural, nosso compromisso é capturar a essência viva desta terra.

Acreditamos no trabalho que edifica como resistência. Cada projeto é gestado com o cuidado de um artesão, garantindo que a obra brilhe com luz própria.

Olhamos para o passado para entender quem somos, escrevemos no presente para registrar nossa passagem e miramos o futuro para saber onde podemos chegar.`,
    // Frase de fecho (aparece em destaque, itálico). Deixe `` vazio para não mostrar.
    fecho: `Edições Cariocas: cultura com o sotaque, o charme e a alma do Rio.`
  },

  /* ---------- 03 · PUBLICAÇÕES / LIVROS ---------- */
  publicacoes: {
    kicker: "03 · Publicações",
    titulo: "Publicações",
    intro: "Toque numa capa para ver a sinopse e onde comprar.",
    // Um objeto por livro.
    //  capa    → caminho da imagem da capa ("" = placeholder).
    //  preco   → texto do preço, ex.: "R$ 49,00" (opcional, "" esconde).
    //  sinopse → texto da ficha (entre crases: pode pular linha à vontade).
    //  vendas  → links EXTRA de compra (Amazon etc.), se houver. [] = nenhum.
    //
    // ►► VENDA POR WHATSAPP ◄◄  O botão verde "Comprar pelo WhatsApp"
    //    é criado AUTOMATICAMENTE em todo livro, usando o número em
    //    contato.whatsapp (lá embaixo). Ao tocar, abre a conversa já com
    //    o título do livro (e o preço, se preenchido). Você responde com
    //    sua chave Pix e combina o frete. Não precisa fazer nada aqui além
    //    de preencher o número em contato.whatsapp e, se quiser, o preco.
    livros: [
      {
        titulo: "O Arquiteto do Invisível",
        autor: "Anderson Guizan Silva",
        capa: "assets/capa/arquiteto.jpg",
        preco: "",
        sinopse: `Escreva aqui a sinopse do livro: sobre o que é, o tom, por que vale a leitura.

Pode ter vários parágrafos — basta pular linha aqui dentro.`,
        vendas: [
          { loja: "Comprar na Amazon", link: "https://" },
          { loja: "Comprar direto com a editora", link: "https://" }
        ]
      },
      {
        titulo: "A Promessa da Guanabara",
        autor: "Anderson Guizan Silva",
        capa: "assets/capa/promessa.jpg",
        preco: "",
        sinopse: `Sinopse do segundo livro.`,
        vendas: [
          { loja: "Comprar", link: "https://" }
        ]
      },
      {
        titulo: "O Segredo do Solar",
        autor: "Anderson Guizan Silva",
        capa: "assets/capa/solar.jpg",
        preco: "",
        sinopse: `Sinopse do terceiro livro.`,
        vendas: []
      }
    ]
  },

  /* ---------- 04 · SERVIÇOS ---------- */
  servicos: {
    kicker: "04 · Serviços",
    titulo: "Serviços",
    intro: "Toque num serviço para ver os detalhes.",
    // Um objeto por serviço (vira carrossel + ficha, igual aos livros).
    //  capa      → imagem do card ("" = placeholder).
    //  descricao → texto da ficha (entre crases: pode pular linha à vontade).
    itens: [
      {
        titulo: "Serviço 1",
        capa: "assets/servicos/servico-1.jpg",
        descricao: `Descrição completa do serviço 1: o que é, para quem, como funciona.`
      },
      {
        titulo: "Serviço 2",
        capa: "assets/servicos/servico-2.jpg",
        descricao: `Descrição completa do serviço 2.`
      },
      {
        titulo: "Serviço 3",
        capa: "assets/servicos/servico-3.jpg",
        descricao: `Descrição completa do serviço 3.`
      }
    ]
  },

  /* ---------- 05 · CONTATO ---------- */
  contato: {
    kicker: "05 · Contato",
    titulo: "Fale conosco",
    // Número no formato internacional, só dígitos (55 + DDD + número).
    whatsapp: "5521995751613",
    email: "agsmanuscritos@gmail.com"
  },

  /* ---------- POEMA (aparece ao tocar/clicar na logo) ---------- */
  // Entre crases: escreva o poema com quebras de linha normais (Enter).
  poema: `Há noites em que a baía para.
A lua cheia desce devagar
e pousa — quase sem querer —
sobre o ombro do Pão de Açúcar.

O Rio inteiro respira fundo.
E tudo o que era cidade
vira, por um momento,
só água e luz.`

};
