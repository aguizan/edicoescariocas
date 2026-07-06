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
    //  formato → "E-book", "Físico", "E-book e Físico" ou "Em breve".
    //  preco   → texto do preço, ex.: "R$ 54,00". Deixe "" se for "Em breve".
    //  sinopse → texto da ficha (entre crases: pode pular linha à vontade).
    //
    // ►► VENDA POR WHATSAPP ◄◄  O botão verde "Comprar pelo WhatsApp"
    //    é criado AUTOMATICAMENTE, usando o número em contato.whatsapp.
    //    A mensagem já pede quantidade e (para livro físico) o endereço.
    //    Livros com formato "Em breve" NÃO mostram botão de compra.
    //    Você responde com o total + sua chave Pix e combina o envio.
    livros: [
      {
        titulo: "O Arquiteto do Invisível",
        autor: "Anderson Guizan Silva",
        capa: "assets/capa/arquiteto.jpg",
        formato: "E-book",
        preco: "R$ 7,00",
        sinopse: `O Arquiteto do Invisível é o primeiro romance de Anderson Guizan Silva e convida o leitor a uma reflexão profunda sobre o poder da intenção, da educação e da capacidade humana de transformar a realidade.

Quando um homem comum descobre que seus pensamentos podem alcançar outras pessoas, ele é conduzido a uma jornada surpreendente, onde imaginação, esperança e responsabilidade se entrelaçam na construção de um mundo melhor. Entre o real e o invisível, a história revela que as maiores mudanças começam dentro de cada um de nós.

Um romance sensível e inspirador sobre sonhos, solidariedade e o extraordinário poder das boas ideias.`
      },
      {
        titulo: "A Promessa da Guanabara",
        autor: "Anderson Guizan Silva",
        capa: "assets/capa/promessa.jpg",
        formato: "Físico",
        preco: "R$ 54,00",
        sinopse: `No Rio de Janeiro de 1958, enquanto o rádio anunciava o primeiro título mundial e a Bossa Nova surgia como um sussurro nas janelas de Copacabana, um menino começava a desenhar sua própria história. Entre o barulho dos bondes que partiam e o silêncio dos novos edifícios que subiam, ele cresceu observando a alma de uma cidade em constante metamorfose.

Em um relato que cruza décadas, este livro é uma arqueologia dos afetos. Das mãos do avô que “sabiam pensar” às ladeiras de pedra da Praça XV, acompanhamos uma trajetória que sobrevive entre o concreto e a saudade. Uma obra sobre o que o tempo apaga, o que a tecnologia transforma e o que o coração se recusa a esquecer — um enigma que só se completa quando a última página é escrita.`
      },
      {
        titulo: "O Segredo do Solar",
        autor: "Anderson Guizan Silva",
        capa: "assets/capa/solar.png",
        formato: "Em breve",
        preco: "",
        sinopse: `Na Lapa, o tempo tem outro ritmo. Os sobrados guardam segredos que os moradores já esqueceram, e os objetos antigos chegam às mãos de quem sabe escutá-los.

Aristides de Castro tem um brechó. Restaura peças, conhece histórias, vive devagar. Até o dia em que, dentro de uma caixinha de madeira com fundo falso, encontra um bilhete que não devia estar ali.

A partir desse momento, o que parecia rotina começa a revelar suas camadas mais fundas — um solar abandonado no centro do Rio, uma herança que ninguém reclama, e gente disposta a muito para encontrá-la primeiro.

‘O Segredo do Solar’ é um romance sobre o que a cidade esconde sob o asfalto, sobre o que as pessoas escondem de si mesmas — e sobre o que vale a pena guardar.`
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
    //  tipo      → "orcamento" transforma a ficha no CALCULADOR de orçamento
    //              (usa a tabela em "orcamento" abaixo). Sem tipo = ficha normal.
    itens: [
      {
        titulo: "Impressão",
        capa: "assets/servicos/imprimir.jpg",
        tipo: "orcamento",
        descricao: `Faça o orçamento da impressão do seu livro. Escolha o formato, o papel, o acabamento e os serviços extras — o valor de um exemplar aparece na hora, e você pode enviar o pedido direto pelo WhatsApp.`
      },
      {
        titulo: "Serviço 2",
        capa: "",
        descricao: `Descrição completa do serviço 2.`
      },
      {
        titulo: "Serviço 3",
        capa: "",
        descricao: `Descrição completa do serviço 3.`
      }
    ]
  },

  /* ---------- ORÇAMENTO DE IMPRESSÃO (calculadora) ----------
     Preço de UM exemplar. Cada escolha soma o valor indicado.
     ►► Troque os números por R$ reais quando tiver a tabela. ◄◄
     • precoPorPagina → multiplicado pela quantidade de páginas.
     • Em cada grupo, você pode adicionar/remover opções livremente:
       o formulário se ajusta sozinho. O valor é o preço daquela opção.
     • isbn / fichaCatalografica / codigoBarras → valor cobrado quando
       o cliente marca a caixinha. */
  orcamento: {
    titulo: "Orçamento de impressão",
    moeda: "R$",
    precoPorPagina: 1.00,
    formato:   { "A5": 1, "16x23": 1, "13x18": 1 },
    papel:     { "80 gr": 1, "90 gr": 1, "Pólen": 1 },
    miolo:     { "Preto e branco": 1, "Colorido": 1 },
    capa:      { "Brochura": 1, "Brochura com orelhas": 1, "Capa dura": 1 },
    laminacao: { "Fosca": 1, "Brilho": 1 },
    isbn: 1,
    fichaCatalografica: 1,
    codigoBarras: 1
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
