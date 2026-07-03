console.log("Projeto iniciado.");

/**
 * Posicionamento dinâmico dos hotspots sobre as placas + toda a interação
 * dos painéis. Os TEXTOS e DADOS (missão, quem somos, livros, serviços,
 * contato, poema) vêm de conteudo.js (window.CONTEUDO) — edite lá, não aqui.
 */

(function () {
    'use strict';

    // Fonte única de conteúdo (conteudo.js precisa ser carregado ANTES deste arquivo).
    const C = window.CONTEUDO || {};
    if (!window.CONTEUDO) {
        console.error('[conteudo] conteudo.js não foi carregado antes do main.js. Verifique a ordem dos <script>.');
    }

    // Dimensões originais do artboard (Affinity), em pixels.
    const ARTBOARD_WIDTH = 2634;
    const ARTBOARD_HEIGHT = 1482;

    // Coordenadas de cada placa no artboard original: { x, y, largura, altura }
    const PLACAS = {
        'btn-missao':       { x: 657.0, y: 314.8, l: 212.2, a: 132.7 },
        'btn-quem':         { x: 645.7, y: 449.8, l: 216.2, a: 113.7 },
        'btn-publicacoes':  { x: 605.9, y: 554.7, l: 290.7, a: 174.6 },
        'btn-servicos':     { x: 633.8, y: 735.5, l: 216.2, a: 113.7 },
        'btn-contato':      { x: 592.4, y: 866.6, l: 300.8, a: 126.4 },
    };

    const imagem = document.getElementById('poste-interativo');

    if (!imagem) {
        console.error('[hotspots] Elemento #poste-interativo não encontrado.');
        return;
    }

    /* =========================================================
       CONTEÚDO — preenche Missão, Quem Somos, Contato e o Poema
       a partir de conteudo.js.
       ========================================================= */

    function txt(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function blocos(campo){
        var arr = Array.isArray(campo) ? campo : String(campo == null ? '' : campo).split(/\n\s*\n/);
        return arr.map(function (t) { return String(t).trim(); }).filter(function (t) { return t; });
    }

    function preencherTextos() {
        // Missão
        if (C.missao) {
            const m = document.getElementById('missao');
            if (m) {
                m.innerHTML = blocos(C.missao.texto || C.missao.paragrafos).map(function (t) {
                    return '<p style="margin-bottom:20px;text-indent:2em;">' + txt(t).replace(/\n/g, '<br>') + '</p>';
                }).join('');
            }
        }

        // Quem Somos (+ frase de fecho, se houver)
        if (C.quem) {
            const q = document.getElementById('quem-somos');
            if (q) {
                const ps = blocos(C.quem.texto || C.quem.paragrafos).map(function (t) {
                    return '<p style="margin-bottom:20px;text-indent:2em;">' + txt(t).replace(/\n/g, '<br>') + '</p>';
                }).join('');
                const fecho = C.quem.fecho
                    ? '<p style="text-align:center;font-style:italic;margin-top:30px;font-weight:bold;color:#222;font-size:1.1rem;border-top:1px solid #eee;padding-top:15px;">' + txt(C.quem.fecho) + '</p>'
                    : '';
                q.innerHTML = ps + fecho;
            }
        }

        // Contato — WhatsApp
        if (C.contato && C.contato.whatsapp) {
            const wa = document.getElementById('link-whatsapp');
            if (wa) {
                wa.href = 'https://wa.me/' + C.contato.whatsapp
                    + '?text=' + encodeURIComponent('Olá, vim através do site da Edições Cariocas');
            }
        }

        // Poema da logo (aceita texto único com quebras OU lista de linhas)
        if (C.poema && C.poema.length) {
            const tl = document.querySelector('#texto-logo p');
            if (tl) {
                const linhas = Array.isArray(C.poema) ? C.poema : String(C.poema).split('\n');
                tl.innerHTML = linhas.map(function (linha) {
                    return linha === '' ? '' : txt(linha);
                }).join('<br>');
            }
        }
    }

    preencherTextos();

    /* =========================================================
       HOTSPOTS — posicionamento sobre as placas
       ========================================================= */

    function calcularAreaRealDaImagem() {
        const containerWidth = imagem.clientWidth;
        const containerHeight = imagem.clientHeight;

        const proporcaoImagem = ARTBOARD_WIDTH / ARTBOARD_HEIGHT;
        const proporcaoContainer = containerWidth / containerHeight;

        let larguraReal, alturaReal, offsetX, offsetY;

        if (proporcaoContainer > proporcaoImagem) {
            alturaReal = containerHeight;
            larguraReal = alturaReal * proporcaoImagem;
            offsetX = (containerWidth - larguraReal) / 2;
            offsetY = 0;
        } else {
            larguraReal = containerWidth;
            alturaReal = larguraReal / proporcaoImagem;
            offsetX = 0;
            offsetY = containerHeight - alturaReal;
        }

        return { larguraReal, alturaReal, offsetX, offsetY };
    }

    const TAMANHO_MINIMO_TOQUE = 44; // px

    function atualizarHotspots() {
        const area = calcularAreaRealDaImagem();

        Object.keys(PLACAS).forEach(function (id) {
            const elemento = document.getElementById(id);
            if (!elemento) {
                console.warn('[hotspots] Elemento #' + id + ' não encontrado no HTML.');
                return;
            }

            const placa = PLACAS[id];

            const left = area.offsetX + (placa.x / ARTBOARD_WIDTH) * area.larguraReal;
            const top = area.offsetY + (placa.y / ARTBOARD_HEIGHT) * area.alturaReal;
            let width = (placa.l / ARTBOARD_WIDTH) * area.larguraReal;
            let height = (placa.a / ARTBOARD_HEIGHT) * area.alturaReal;

            let leftAjustado = left;
            let topAjustado = top;

            if (width < TAMANHO_MINIMO_TOQUE) {
                leftAjustado = left - (TAMANHO_MINIMO_TOQUE - width) / 2;
                width = TAMANHO_MINIMO_TOQUE;
            }
            if (height < TAMANHO_MINIMO_TOQUE) {
                topAjustado = top - (TAMANHO_MINIMO_TOQUE - height) / 2;
                height = TAMANHO_MINIMO_TOQUE;
            }

            elemento.style.left = leftAjustado + 'px';
            elemento.style.top = topAjustado + 'px';
            elemento.style.width = width + 'px';
            elemento.style.height = height + 'px';
        });
    }

    if (imagem.complete) {
        atualizarHotspots();
    } else {
        imagem.addEventListener('load', atualizarHotspots);
    }

    let resizeTimeout;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(atualizarHotspots, 100);
    });

    /* =========================================================
       PAINÉIS DE TEXTO (Missão / Quem Somos / Contato)
       ========================================================= */

    const MAPA_PAINEIS = {
        'btn-missao': 'texto-missao',
        'btn-quem': 'texto-quem',
        'btn-contato': 'texto-contato',
    };

    function fecharTodosPaineis() {
        Object.values(MAPA_PAINEIS).forEach(function (painelId) {
            const painel = document.getElementById(painelId);
            if (painel) painel.classList.remove('ativo');
        });
        Object.keys(MAPA_PAINEIS).forEach(function (botaoId) {
            const botao = document.getElementById(botaoId);
            if (botao) botao.setAttribute('aria-expanded', 'false');
        });
    }

    function alternarPainel(botaoId, painelId) {
        const painel = document.getElementById(painelId);
        const botao = document.getElementById(botaoId);
        if (!painel || !botao) return;

        const estavaAtivo = painel.classList.contains('ativo');
        fecharTodosPaineis();

        if (!estavaAtivo) {
            painel.classList.add('ativo');
            botao.setAttribute('aria-expanded', 'true');
        }
    }

    Object.keys(MAPA_PAINEIS).forEach(function (botaoId) {
        const botao = document.getElementById(botaoId);
        if (!botao) {
            console.warn('[painéis] Botão #' + botaoId + ' não encontrado.');
            return;
        }
        botao.addEventListener('click', function (evento) {
            evento.stopPropagation();
            alternarPainel(botaoId, MAPA_PAINEIS[botaoId]);
        });
    });

    document.querySelectorAll('.painel-info .fechar-painel').forEach(function (botaoFechar) {
        botaoFechar.addEventListener('click', function (evento) {
            evento.stopPropagation();
            fecharTodosPaineis();
        });
    });

    /* =========================================================
       CARROSSÉIS (Publicações e Serviços)
       ========================================================= */

    function criarCarrossel(config) {
        const faixa = document.getElementById(config.faixaId);
        const trilho = document.getElementById(config.trilhoId);
        const botao = document.getElementById(config.botaoId);

        function montar() {
            if (!trilho) return;
            trilho.innerHTML = '';

            config.dados.forEach(function (item) {
                const card = document.createElement('div');
                card.className = 'item-carrossel';
                card.setAttribute('role', 'button');
                card.setAttribute('tabindex', '0');
                card.setAttribute('aria-label', item.titulo);

                if (item.capa) {
                    const img = document.createElement('img');
                    img.src = item.capa;
                    img.alt = item.titulo;
                    card.appendChild(img);
                }

                card.addEventListener('click', function (evento) {
                    evento.stopPropagation();
                    config.aoClicarItem(item);
                });
                card.addEventListener('keydown', function (evento) {
                    if (evento.key === 'Enter' || evento.key === ' ') {
                        evento.preventDefault();
                        config.aoClicarItem(item);
                    }
                });

                trilho.appendChild(card);
            });
        }

        function abrir() {
            if (!faixa) return;
            faixa.classList.add('ativo');
            if (botao) botao.setAttribute('aria-expanded', 'true');
        }

        function fechar() {
            if (!faixa) return;
            faixa.classList.remove('ativo');
            if (botao) botao.setAttribute('aria-expanded', 'false');
        }

        if (botao) {
            botao.addEventListener('click', function (evento) {
                evento.stopPropagation();
                fecharTodosPaineis();
                if (faixa && faixa.classList.contains('ativo')) {
                    fechar();
                } else {
                    abrir();
                }
            });
        }

        montar();

        return { abrir: abrir, fechar: fechar };
    }

    /* =========================================================
       PAINÉIS DE DETALHE (livro / serviço)
       ========================================================= */

    function criarPainelDetalhe(painelId, camposIds) {
        const painel = document.getElementById(painelId);
        const elCapa = document.getElementById(camposIds.capa);
        const elTitulo = document.getElementById(camposIds.titulo);
        const elTexto = document.getElementById(camposIds.texto);
        const elLink = camposIds.link ? document.getElementById(camposIds.link) : null;
        const elVendas = camposIds.vendas ? document.getElementById(camposIds.vendas) : null;

        function abrir(item) {
            if (!painel) return;

            if (elCapa) {
                elCapa.src = item.capa || '';
                elCapa.alt = item.titulo;
                elCapa.style.display = item.capa ? 'block' : 'none';
            }
            if (elTitulo) elTitulo.textContent = item.titulo;
            if (elTexto) elTexto.textContent = item.texto;

            // Botões de compra (vendas). Se houver lista, usa o container;
            // senão, mantém o link único legado.
            if (elVendas) {
                const vendas = item.vendas || [];
                let html = '';

                // Botão principal: Comprar pelo WhatsApp (criado automaticamente
                // para livros que tenham whatsappLink).
                if (item.whatsappLink) {
                    html += '<a href="' + item.whatsappLink + '" target="_blank" rel="noopener"'
                        + ' style="display:block;text-align:center;font-style:normal;font-size:14px;color:#fff;background:#25d366;padding:10px 16px;border-radius:4px;text-decoration:none;margin:4px 0 12px;">'
                        + 'Comprar pelo WhatsApp' + (item.preco ? ' — ' + txt(item.preco) : '') + '</a>';
                }

                // Botões extra (Amazon etc.), se houver.
                if (vendas.length) {
                    html += vendas.map(function (v) {
                        return '<a class="botao-venda" href="' + (v.link || '#') + '" target="_blank" rel="noopener"'
                            + ' style="display:inline-block;margin:8px 10px 0 0;padding:10px 20px;border:1px solid #333;border-radius:6px;text-decoration:none;color:#333;font-family:Georgia,serif;">'
                            + txt(v.loja || 'Comprar') + '</a>';
                    }).join('');
                }

                if (html) {
                    elVendas.innerHTML = html;
                    elVendas.style.display = 'block';
                    if (elLink) elLink.style.display = 'none';
                } else {
                    elVendas.innerHTML = '';
                    elVendas.style.display = 'none';
                    if (elLink) {
                        elLink.href = item.link || '#';
                        elLink.style.display = 'inline-block';
                    }
                }
            } else if (elLink) {
                elLink.href = item.link || '#';
            }

            painel.classList.add('ativo');
        }

        function fechar() {
            if (painel) painel.classList.remove('ativo');
        }

        const botaoFechar = painel ? painel.querySelector('.fechar-painel') : null;
        if (botaoFechar) {
            botaoFechar.addEventListener('click', function (evento) {
                evento.stopPropagation();
                fechar();
            });
        }

        return { abrir: abrir, fechar: fechar };
    }

    // ---- Publicações (carrossel de livros) — dados de conteudo.js ----

    const DADOS_LIVROS = ((C.publicacoes && C.publicacoes.livros) || []).map(function (l) {
        const numWa = (C.contato && C.contato.whatsapp) || '';
        const preco = l.preco || '';
        const msg = 'Olá! Quero comprar o livro "' + (l.titulo || '') + '"' + (preco ? ' (' + preco + ')' : '') + '.';
        return {
            titulo: l.titulo || '',
            autor: l.autor || '',
            capa: l.capa || '',
            texto: l.sinopse || '',
            preco: preco,
            whatsappLink: numWa ? 'https://wa.me/' + numWa + '?text=' + encodeURIComponent(msg) : '',
            vendas: l.vendas || [],
            link: (l.vendas && l.vendas[0] && l.vendas[0].link) || '#'
        };
    });

    const painelLivro = criarPainelDetalhe('detalhe-livro', {
        capa: 'detalhe-livro-capa',
        titulo: 'detalhe-livro-titulo',
        texto: 'detalhe-livro-sinopse',
        vendas: 'detalhe-livro-vendas',
        link: 'detalhe-livro-link',
    });

    const carrosselPublicacoes = criarCarrossel({
        botaoId: 'btn-publicacoes',
        faixaId: 'faixa-publicacoes',
        trilhoId: 'trilho-carrossel',
        dados: DADOS_LIVROS,
        aoClicarItem: painelLivro.abrir,
    });

    // ---- Serviços (carrossel de cards) — dados de conteudo.js ----

    const DADOS_SERVICOS = ((C.servicos && C.servicos.itens) || []).map(function (s) {
        return {
            titulo: s.titulo || '',
            capa: s.capa || '',
            texto: s.descricao || ''
        };
    });

    const painelServico = criarPainelDetalhe('detalhe-servico', {
        capa: 'detalhe-servico-capa',
        titulo: 'detalhe-servico-titulo',
        texto: 'detalhe-servico-descricao',
    });

    const carrosselServicos = criarCarrossel({
        botaoId: 'btn-servicos',
        faixaId: 'faixa-servicos',
        trilhoId: 'trilho-servicos',
        dados: DADOS_SERVICOS,
        aoClicarItem: painelServico.abrir,
    });

    // ---- Texto da logo / poesia (clique) ----

    const gatilhoLogo = document.getElementById('gatilho-logo');
    const textoLogo = document.getElementById('texto-logo');
    const botaoFecharTextoLogo = document.getElementById('fechar-texto-logo');

    function abrirTextoLogo() {
        if (textoLogo) textoLogo.classList.add('ativo');
    }

    function fecharTextoLogo() {
        if (textoLogo) textoLogo.classList.remove('ativo');
    }

    if (gatilhoLogo) {
        gatilhoLogo.addEventListener('click', function (evento) {
            evento.stopPropagation();
            if (textoLogo && textoLogo.classList.contains('ativo')) {
                fecharTextoLogo();
            } else {
                abrirTextoLogo();
            }
        });
    }

    if (botaoFecharTextoLogo) {
        botaoFecharTextoLogo.addEventListener('click', function (evento) {
            evento.stopPropagation();
            fecharTextoLogo();
        });
    }

    // ---- Contato (formulário de e-mail) — e-mail vem de conteudo.js ----

    const EMAIL_DESTINO = (C.contato && C.contato.email) || 'contato@edicoescariocas.com.br';

    const formContato = document.getElementById('form-contato');
    if (formContato) {
        formContato.addEventListener('submit', function (evento) {
            evento.preventDefault();

            const nome = document.getElementById('contato-nome').value.trim();
            const email = document.getElementById('contato-email').value.trim();
            const mensagem = document.getElementById('contato-mensagem').value.trim();

            const assunto = 'Contato pelo site — ' + nome;
            const corpo = 'Nome: ' + nome + '\nE-mail: ' + email + '\n\n' + mensagem;

            const linkMailto = 'mailto:' + EMAIL_DESTINO
                + '?subject=' + encodeURIComponent(assunto)
                + '&body=' + encodeURIComponent(corpo);

            window.location.href = linkMailto;
        });
    }

    // Clique fora fecha tudo.
    document.addEventListener('click', function (evento) {
        const cliqueDentroDePainel = evento.target.closest('.painel-info');
        const cliqueDentroDaFaixa = evento.target.closest('.faixa-carrossel');
        const cliqueEmHotspot = evento.target.closest('#hotspots');
        const cliqueEmGatilhoLogo = evento.target.closest('#gatilho-logo');
        if (!cliqueDentroDePainel && !cliqueDentroDaFaixa && !cliqueEmHotspot && !cliqueEmGatilhoLogo) {
            fecharTodosPaineis();
            carrosselPublicacoes.fechar();
            carrosselServicos.fechar();
            painelLivro.fechar();
            painelServico.fechar();
            fecharTextoLogo();
        }
    });

    // ESC fecha tudo.
    document.addEventListener('keydown', function (evento) {
        if (evento.key === 'Escape') {
            fecharTodosPaineis();
            carrosselPublicacoes.fechar();
            carrosselServicos.fechar();
            painelLivro.fechar();
            painelServico.fechar();
            fecharTextoLogo();
        }
    });
})();
