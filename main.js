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

    // Curva da ciclovia (mesmo artboard 2634x1482), usada para posicionar os
    // cards de Serviços "pousados" sobre o traçado, como faixas de um cilindro.
    // Path extraído de uploads/caminho.svg (aresta inferior dos cards); a
    // aresta superior é este mesmo traçado deslocado 288 unidades para cima.
    const CURVA_CICLOVIA_D = 'M-0,1325.933L1385.02,1335.174C1778.286,1325.403 2089.311,1242.874 2213.293,1167.605C2288.63,1121.868 2443.734,1011.707 2115.088,1009.251';
    const CURVA_ALTURA_CARD = 288; // unidades do artboard entre aresta inferior e superior
    const CURVA_FRACAO_MAX = 0.78; // evita a ponta final, onde o traçado se fecha sobre si mesmo
    let _curvaPathEl = null;
    function obterCurvaPath() {
        if (_curvaPathEl) return _curvaPathEl;
        const NS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden;');
        const path = document.createElementNS(NS, 'path');
        path.setAttribute('d', CURVA_CICLOVIA_D);
        svg.appendChild(path);
        document.body.appendChild(svg);
        _curvaPathEl = path;
        return path;
    }
    function amostrarCurva(n) {
        const path = obterCurvaPath();
        const total = path.getTotalLength();
        const pontos = [];
        for (let i = 0; i < n; i++) {
            const frac = n > 1 ? (i / (n - 1)) * CURVA_FRACAO_MAX : CURVA_FRACAO_MAX / 2;
            const p = path.getPointAtLength(frac * total);
            pontos.push({ x: p.x, y: p.y });
        }
        return pontos;
    }

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

        // Contato — E-mail (clique copia o endereço para a área de transferência)
        if (C.contato && C.contato.email) {
            const em = document.getElementById('link-email');
            if (em) {
                em.textContent = C.contato.email;
                em.addEventListener('click', function () {
                    var ok = false;
                    try {
                        var ta = document.createElement('textarea');
                        ta.value = C.contato.email;
                        ta.style.position = 'fixed';
                        ta.style.opacity = '0';
                        document.body.appendChild(ta);
                        ta.select();
                        ok = document.execCommand('copy');
                        document.body.removeChild(ta);
                    } catch (e) { ok = false; }
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(C.contato.email).catch(function () {});
                    }
                    var m = document.getElementById('link-email-msg');
                    if (m) {
                        m.textContent = ok ? 'copiado ✓' : C.contato.email;
                        m.style.opacity = '1';
                        setTimeout(function () { m.style.opacity = '0'; }, 2000);
                    }
                });
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
                card.className = 'item-carrossel' + (item.alto ? ' item-carrossel--alto' : '');
                if (item.aspecto) card.style.aspectRatio = String(item.aspecto);
                card.setAttribute('role', 'button');
                card.setAttribute('tabindex', '0');
                card.setAttribute('aria-label', item.titulo);

                if (item.capa) {
                    const img = document.createElement('img');
                    img.src = item.capa;
                    img.alt = item.titulo;
                    card.appendChild(img);
                }

                if (item.selo) {
                    const selo = document.createElement('span');
                    selo.className = 'item-carrossel-selo';
                    selo.textContent = item.selo;
                    card.appendChild(selo);
                }

                if (config.legenda) {
                    const legenda = document.createElement('span');
                    legenda.className = 'item-carrossel-legenda';
                    legenda.textContent = item.titulo;
                    card.appendChild(legenda);
                }

                if (item.avaliacoes !== undefined) {
                    const est = document.createElement('span');
                    est.className = 'item-carrossel-estrelas';
                    est.style.cssText = 'position:absolute;left:6px;bottom:6px;font-size:12px;color:#e8a33d;background:rgba(255,255,255,.85);padding:2px 6px;border-radius:3px;letter-spacing:1px;';
                    est.textContent = item.avaliacoes.length ? estrelasTexto(item.mediaNota) + ' ' + item.mediaNota.toFixed(1) : '';
                    if (item.avaliacoes.length) card.appendChild(est);
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

            if (config.curva) posicionarNaCurva();
        }

        function posicionarNaCurva() {
            if (!trilho) return;
            const cards = trilho.querySelectorAll('.item-carrossel');
            if (!cards.length) return;
            const area = calcularAreaRealDaImagem();
            const pontos = amostrarCurva(cards.length);
            const alturaCardPx = (CURVA_ALTURA_CARD / ARTBOARD_HEIGHT) * area.alturaReal * 1.35;
            const larguraCardPx = alturaCardPx * (2 / 3); // mantém a proporção 2:3 das capas
            let centroXAnterior = null;
            const espacamentoMin = larguraCardPx + 10;
            cards.forEach(function (card, i) {
                const p = pontos[i];
                let centroX = area.offsetX + (p.x / ARTBOARD_WIDTH) * area.larguraReal;
                const minX = area.offsetX + larguraCardPx / 2;
                const maxX = area.offsetX + area.larguraReal - larguraCardPx / 2;
                if (centroX < minX) centroX = minX;
                if (centroX > maxX) centroX = maxX;
                if (centroXAnterior !== null && centroX - centroXAnterior < espacamentoMin) {
                    centroX = centroXAnterior + espacamentoMin;
                }
                centroXAnterior = centroX;
                const baseY = area.offsetY + (p.y / ARTBOARD_HEIGHT) * area.alturaReal;
                card.style.position = 'absolute';
                card.style.left = (centroX - larguraCardPx / 2) + 'px';
                card.style.top = (baseY - alturaCardPx) + 'px';
                card.style.width = larguraCardPx + 'px';
                card.style.height = alturaCardPx + 'px';
                card.style.aspectRatio = '';
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

        if (config.curva) {
            let resizeTimeoutCurva;
            window.addEventListener('resize', function () {
                clearTimeout(resizeTimeoutCurva);
                resizeTimeoutCurva = setTimeout(posicionarNaCurva, 100);
            });
        }

        return { abrir: abrir, fechar: fechar };
    }

    /* =========================================================
       PAINÉIS DE DETALHE (livro / serviço)
       ========================================================= */

    function estrelasTexto(nota) {
        const n = Math.round(Number(nota) || 0);
        return '★★★★★☆☆☆☆☆'.slice(5 - n, 10 - n);
    }

    function montarBlocoAvaliacoes(item) {
        const avals = item.avaliacoes || [];
        let html = '<div style="font-style:normal;margin:4px 0 14px;">';
        if (avals.length) {
            html += '<div style="font-size:14px;color:#2c3e50;margin-bottom:8px;">'
                + '<span style="color:#e8a33d;letter-spacing:1px;">' + estrelasTexto(item.mediaNota) + '</span> '
                + item.mediaNota.toFixed(1) + ' · ' + avals.length + (avals.length === 1 ? ' avaliação' : ' avaliações') + '</div>';
            html += avals.map(function (a) {
                return '<div style="margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid rgba(0,0,0,.08);">'
                    + '<div style="color:#e8a33d;font-size:13px;letter-spacing:1px;">' + estrelasTexto(a.nota) + '</div>'
                    + '<div style="font-size:13px;color:#2c3e50;"><strong>' + (a.nome || 'Leitor') + '</strong>' + (a.comentario ? ' — ' + a.comentario : '') + '</div>'
                    + '</div>';
            }).join('');
        } else {
            html += '<p style="font-size:13px;color:#6b7683;margin-bottom:8px;">Ainda sem avaliações.</p>';
        }
        if (!item.id) {
            html += '</div>';
            return html;
        }
        html += '<button type="button" class="btn-avaliar" style="font-style:normal;font-size:13px;background:none;border:none;color:#2c3e50;text-decoration:underline;cursor:pointer;padding:0;">Avaliar este livro</button>';
        html += '<div class="form-avaliar" style="display:none;margin-top:10px;">'
            + '<div style="font-size:20px;letter-spacing:4px;color:#e8a33d;cursor:pointer;margin-bottom:6px;">'
            + [0, 1, 2, 3, 4].map(function () { return '<span class="estrela-input">☆</span>'; }).join('')
            + '</div>'
            + '<input type="tel" class="input-celular-avaliacao" placeholder="Seu celular (com DDD)" style="width:100%;font-family:sans-serif;font-size:13px;padding:6px;border:1px solid #ccc;border-radius:4px;margin-bottom:6px;">'
            + '<input type="text" class="input-nome-avaliacao" placeholder="Seu nome" style="width:100%;font-family:sans-serif;font-size:13px;padding:6px;border:1px solid #ccc;border-radius:4px;margin-bottom:6px;">'
            + '<input type="number" class="input-idade-avaliacao" placeholder="Idade" min="1" max="120" style="width:100%;font-family:sans-serif;font-size:13px;padding:6px;border:1px solid #ccc;border-radius:4px;margin-bottom:6px;">'
            + '<input type="text" class="input-estado-avaliacao" placeholder="Estado (UF)" maxlength="2" style="width:100%;font-family:sans-serif;font-size:13px;padding:6px;border:1px solid #ccc;border-radius:4px;margin-bottom:6px;text-transform:uppercase">'
            + '<textarea class="input-comentario-avaliacao" placeholder="Comentário (opcional)" rows="2" style="width:100%;font-family:sans-serif;font-size:13px;padding:6px;border:1px solid #ccc;border-radius:4px;margin-bottom:6px;"></textarea>'
            + '<button type="button" class="btn-enviar-avaliacao" style="font-style:normal;font-size:13px;color:#fff;background:#25d366;border:none;padding:8px 14px;border-radius:4px;cursor:pointer;">Enviar avaliação</button>'
            + '<div class="erro-avaliacao" style="color:#a11;font-size:12px;margin-top:6px;"></div>'
            + '</div>';
        html += '</div>';
        return html;
    }

    async function enviarAvaliacao(elAval, item) {
        const nota = Number(elAval.dataset.notaSelecionada || 0);
        const celular = (elAval.querySelector('.input-celular-avaliacao').value || '').replace(/\D/g, '');
        const nome = (elAval.querySelector('.input-nome-avaliacao').value || '').trim();
        const idade = parseInt(elAval.querySelector('.input-idade-avaliacao').value, 10) || null;
        const estado = (elAval.querySelector('.input-estado-avaliacao').value || '').trim().toUpperCase();
        const comentario = (elAval.querySelector('.input-comentario-avaliacao').value || '').trim();
        const erroEl = elAval.querySelector('.erro-avaliacao');
        if (erroEl) erroEl.textContent = '';
        if (!celular || celular.length < 10) { if (erroEl) erroEl.textContent = 'Informe um celular válido (com DDD).'; return; }
        if (!nome) { if (erroEl) erroEl.textContent = 'Informe seu nome.'; return; }
        if (!nota) { if (erroEl) erroEl.textContent = 'Escolha uma nota (estrelas).'; return; }
        if (!item.numWaAvaliacao || !item.id || !sbClient) return;

        const { data: leitor, error: erroLeitor } = await sbClient.from('leitores')
            .upsert({ celular: celular, nome: nome, idade: idade, estado: estado }, { onConflict: 'celular' })
            .select().single();
        if (erroLeitor || !leitor) { if (erroEl) erroEl.textContent = 'Erro ao salvar cadastro: ' + (erroLeitor ? erroLeitor.message : ''); return; }

        const { error: erroAval } = await sbClient.from('avaliacoes').insert({
            livro_id: item.id, leitor_id: leitor.id, nome: nome, nota: nota, comentario: comentario, status: 'pendente'
        });
        if (erroAval) { if (erroEl) erroEl.textContent = 'Erro ao enviar avaliação: ' + erroAval.message; return; }

        const msg = 'Nova avaliação recebida:\nLivro: ' + item.titulo + '\nNota: ' + nota + '/5\nNome: ' + nome
            + (comentario ? '\nComentário: ' + comentario : '') + '\n\n(fica pendente até aprovação no admin)';
        window.open('https://wa.me/' + item.numWaAvaliacao + '?text=' + encodeURIComponent(msg), '_blank');
        const formEl = elAval.querySelector('.form-avaliar');
        if (formEl) formEl.innerHTML = '<p style="color:#1a7a1a;font-size:13px;">Avaliação enviada! Obrigado.</p>';
    }

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

            // Linha "Formato · Preço" logo abaixo do título (só para livros).
            // Quando o livro tem os dois formatos, mostra Físico e E-book em linhas separadas.
            if (elTitulo) {
                const marca = 'meta-formato';
                let meta = elTitulo.parentNode.querySelector('.' + marca);
                const temAmbos = item.formato && item.formato.indexOf('Físico') !== -1 && item.formato.indexOf('E-book') !== -1;
                const soEbook = item.formato && item.formato.indexOf('E-book') !== -1 && item.formato.indexOf('Físico') === -1;
                let linhas = [];
                if (temAmbos) {
                    if (item.preco) linhas.push('Físico · ' + item.preco);
                    if (item.precoEbook) linhas.push('E-book · ' + item.precoEbook);
                } else if (soEbook) {
                    const precoCerto = item.precoEbook || item.preco;
                    if (precoCerto) linhas.push(item.formato + ' · ' + precoCerto);
                } else {
                    const partes = [];
                    if (item.formato) partes.push(item.formato);
                    if (item.preco) partes.push(item.preco);
                    if (partes.length) linhas.push(partes.join(' · '));
                }
                if (linhas.length) {
                    if (!meta) {
                        meta = document.createElement('p');
                        meta.className = marca;
                        meta.style.cssText = 'font-style:normal;font-size:13px;letter-spacing:.5px;text-transform:uppercase;color:#6b7683;margin:-4px 0 10px;';
                        elTitulo.parentNode.insertBefore(meta, elTitulo.nextSibling);
                    }
                    meta.innerHTML = linhas.join('<br>');
                    meta.style.display = 'block';
                } else if (meta) {
                    meta.style.display = 'none';
                }
            }

            if (elTexto) elTexto.textContent = item.texto;

            // Bloco de avaliações + botão "Avaliar este livro" (só para livros, quando o item tem avaliacoes/numWaAvaliacao definidos).
            if (camposIds.avaliacoes) {
                const elAval = document.getElementById(camposIds.avaliacoes);
                if (elAval) {
                    if (item.avaliacoes !== undefined) {
                        elAval.innerHTML = montarBlocoAvaliacoes(item);
                        elAval.style.display = 'block';
                        const btnAvaliar = elAval.querySelector('.btn-avaliar');
                        const formAvaliar = elAval.querySelector('.form-avaliar');
                        if (btnAvaliar && formAvaliar) {
                            btnAvaliar.addEventListener('click', function () {
                                formAvaliar.style.display = formAvaliar.style.display === 'none' ? 'block' : 'none';
                            });
                        }
                        const btnEnviarAval = elAval.querySelector('.btn-enviar-avaliacao');
                        if (btnEnviarAval) {
                            btnEnviarAval.addEventListener('click', function () {
                                enviarAvaliacao(elAval, item);
                            });
                        }
                        let estrelaSel = 0;
                        elAval.querySelectorAll('.estrela-input').forEach(function (est, i) {
                            est.addEventListener('click', function () {
                                estrelaSel = i + 1;
                                elAval.querySelectorAll('.estrela-input').forEach(function (e2, j) {
                                    e2.textContent = j < estrelaSel ? '★' : '☆';
                                });
                                elAval.dataset.notaSelecionada = estrelaSel;
                            });
                        });
                    } else {
                        elAval.style.display = 'none';
                    }
                }
            }

            // Botão de compra: só "Comprar pelo WhatsApp" (ou "Em breve").
            if (elVendas) {
                let html = '';
                if (item.emBreve) {
                    html = '<span style="display:block;text-align:center;font-style:normal;font-size:14px;color:#6b7683;background:#eef0f2;padding:10px 16px;border-radius:4px;">Em breve</span>';
                } else if (item.whatsappLink) {
                    html = '<a href="' + item.whatsappLink + '" target="_blank" rel="noopener"'
                        + ' style="display:block;text-align:center;font-style:normal;font-size:14px;color:#fff;background:#25d366;padding:10px 16px;border-radius:4px;text-decoration:none;margin:4px 0 12px;">'
                        + 'Comprar pelo WhatsApp</a>';
                    if (item.formato && item.formato.indexOf('Físico') !== -1) {
                        html += '<p style="font-style:normal;font-size:12px;line-height:1.5;color:#6b7683;text-align:center;margin:0 0 8px;">'
                            + 'O frete é calculado pelo CEP e informado junto com a chave Pix para pagamento.</p>';
                    }
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

    // ---- Publicações (carrossel de livros) — vem do Supabase (produção),
    // com fallback para conteudo.json se a leitura do banco falhar.

    const SUPABASE_URL = 'https://sesmrschobtglcqxvkyb.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_c4-E0NfPcHXTm3L0p-Zi_g_Fy7RwQya';
    const sbClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

    function mapLivroParaItem(l) {
        const numWa = (C.contato && C.contato.whatsapp) || '';
        // Aceita tanto o formato do Supabase (preco_fisico/preco_ebook/status)
        // quanto o antigo do conteudo.json (formato/preco/precoEbook), para
        // funcionar com os dois durante a transição.
        const doSupabase = l.preco_fisico !== undefined || l.status !== undefined;
        let formato, preco, precoEbook, emBreve, selo;
        if (doSupabase) {
            const temFisico = !!l.preco_fisico;
            const temEbook = !!l.preco_ebook;
            formato = temFisico && temEbook ? 'Físico e E-book' : (temEbook ? 'E-book' : 'Físico');
            preco = l.preco_fisico ? 'R$ ' + Number(l.preco_fisico).toFixed(2).replace('.', ',') : '';
            precoEbook = l.preco_ebook ? 'R$ ' + Number(l.preco_ebook).toFixed(2).replace('.', ',') : '';
            emBreve = l.status === 'em_breve';
            selo = l.selo || (l.status === 'esgotado' ? 'Esgotado' : '');
        } else {
            formato = (l.formato || '').trim();
            preco = l.preco || '';
            precoEbook = l.precoEbook || '';
            emBreve = /^em breve/i.test(formato);
            selo = l.selo || '';
        }
        const ehFisico = /f[íi]sico/i.test(formato);
        const soEbookMsg = /e-?book/i.test(formato) && !ehFisico;
        const precoMsg = soEbookMsg ? (precoEbook || preco || '') : preco;
        let msg = 'Olá! Tenho interesse no livro "' + (l.titulo || '') + '"'
            + (formato ? ' (' + formato + (precoMsg ? ' — ' + precoMsg : '') + ')' : '') + '.\n\nQuantidade: \n';
        msg += ehFisico
            ? 'Endereço completo para envio (rua, número, complemento, bairro, cidade/UF e CEP): '
            : 'Meu e-mail para receber o e-book: ';
        const avals = Array.isArray(l.avaliacoes) ? l.avaliacoes.map(function (a) {
            return { nota: a.nota, comentario: a.comentario, nome: (a.leitores && a.leitores.nome) || a.nome || 'Leitor' };
        }) : [];
        const media = avals.length ? (avals.reduce(function (s, a) { return s + (Number(a.nota) || 0); }, 0) / avals.length) : 0;
        return {
            id: l.id || '',
            titulo: l.titulo || '',
            autor: (l.autores && l.autores.nome) || l.autor || '',
            capa: l.capa_url || l.capa || '',
            texto: l.sinopse || '',
            formato: formato,
            preco: preco,
            precoEbook: precoEbook,
            selo: selo,
            emBreve: emBreve,
            whatsappLink: (!emBreve && numWa) ? 'https://wa.me/' + numWa + '?text=' + encodeURIComponent(msg) : '',
            avaliacoes: avals,
            mediaNota: media,
            numWaAvaliacao: numWa
        };
    }

    async function buscarLivros() {
        try {
            const resp = await fetch(SUPABASE_URL + '/rest/v1/livros?select=*,autores(nome),avaliacoes(nota,comentario,leitores(nome))&avaliacoes.status=eq.aprovada&status=in.(publicado,esgotado,em_breve)&order=criado_em.desc', {
                headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
            });
            if (!resp.ok) throw new Error('HTTP ' + resp.status);
            const dados = await resp.json();
            if (!Array.isArray(dados)) throw new Error('resposta inesperada');
            console.log('[livros] carregados do Supabase:', dados.length);
            return dados;
        } catch (e) {
            console.warn('[livros] falha ao buscar do Supabase, usando conteudo.json como reserva.', e);
            return (C.publicacoes && C.publicacoes.livros) || [];
        }
    }

    (async function iniciarPublicacoes() {
        const brutos = await buscarLivros();
        const DADOS_LIVROS = brutos.map(mapLivroParaItem);

        const painelLivro = criarPainelDetalhe('detalhe-livro', {
            capa: 'detalhe-livro-capa',
            titulo: 'detalhe-livro-titulo',
            texto: 'detalhe-livro-sinopse',
            avaliacoes: 'detalhe-livro-avaliacoes',
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

        window.__painelLivro = painelLivro;
        window.__carrosselPublicacoes = carrosselPublicacoes;
    })();

    // ---- Orçamento de impressão (calculadora) — dados de conteudo.js ----

    function criarOrcamento() {
        const painel = document.getElementById('orcamento-impressao');
        const corpo = document.getElementById('orcamento-corpo');
        const cfg = C.orcamento || {};
        const numWa = (C.contato && C.contato.whatsapp) || '';
        const simbolo = cfg.moeda || 'R$';

        const elTit = document.getElementById('orcamento-titulo');
        if (elTit && cfg.titulo) elTit.textContent = cfg.titulo;

        function fmt(v) { return simbolo + ' ' + (v || 0).toFixed(2).replace('.', ','); }

        function opcoes(lista) {
            var out = [];
            if (Array.isArray(lista)) {
                lista.forEach(function (k) { out.push('<option value="' + k + '">' + k + '</option>'); });
            } else {
                Object.keys(lista || {}).forEach(function (k) { out.push('<option value="' + k + '">' + k + '</option>'); });
            }
            return out.join('');
        }

        function campoSelect(id, rotulo, lista) {
            return '<label class="orc-campo"><span>' + rotulo + '</span>'
                + '<select id="' + id + '">' + opcoes(lista) + '</select></label>';
        }

        function montar() {
            if (!corpo) return;
            var tmin = cfg.tiragemMinima || 1;
            corpo.innerHTML =
                '<label class="orc-campo"><span>Título do livro</span>'
                + '<input type="text" id="orc-titulo" placeholder="Nome da obra"></label>'
                + campoSelect('orc-formato', 'Formato', cfg.formato)
                + campoSelect('orc-papel', 'Papel', cfg.precoPagina)
                + '<label class="orc-campo"><span>Total de páginas</span>'
                + '<input type="number" id="orc-paginas" min="0" step="1" value="0"></label>'
                + '<label class="orc-campo"><span>Tiragem (mínimo ' + tmin + ')</span>'
                + '<input type="number" id="orc-tiragem" min="' + tmin + '" step="1" value="' + tmin + '"></label>'
                + campoSelect('orc-capa', 'Capa', cfg.capa)
                + campoSelect('orc-laminacao', 'Laminação', cfg.laminacao)
                + '<div class="orc-extras-titulo">Serviços extras</div>'
                + '<label class="orc-check"><input type="checkbox" id="orc-isbn"> ISBN</label>'
                + '<label class="orc-check"><input type="checkbox" id="orc-ficha"> Ficha catalográfica</label>'
                + '<label class="orc-check"><input type="checkbox" id="orc-direitos"> Direitos autorais</label>'
                + '<label class="orc-campo"><span>Desconto (R$) — opcional</span>'
                + '<input type="number" id="orc-desconto" min="0" step="0.01" value="0"></label>'
                + '<button type="button" class="orc-btn-calcular" id="orc-calcular">Calcular orçamento</button>'
                + '<div id="orc-resultado"></div>';
            const btn = corpo.querySelector('#orc-calcular');
            if (btn) btn.addEventListener('click', calcular);
        }

        function coletar() {
            function val(id) { var e = document.getElementById(id); return e ? e.value : ''; }
            function num(id) { var e = document.getElementById(id); return e ? (parseFloat(e.value) || 0) : 0; }
            function marc(id) { var e = document.getElementById(id); return !!(e && e.checked); }
            var tmin = cfg.tiragemMinima || 1;
            var tir = parseInt(val('orc-tiragem'), 10) || 0;
            if (tir < tmin) tir = tmin;
            return {
                titulo: val('orc-titulo'),
                formato: val('orc-formato'),
                papel: val('orc-papel'),
                paginas: parseInt(val('orc-paginas'), 10) || 0,
                tiragem: tir,
                capa: val('orc-capa'),
                laminacao: val('orc-laminacao'),
                isbn: marc('orc-isbn'),
                ficha: marc('orc-ficha'),
                direitos: marc('orc-direitos'),
                desconto: num('orc-desconto')
            };
        }

        function calc(d) {
            var exemplar = 0;
            exemplar += ((cfg.precoPagina && cfg.precoPagina[d.papel]) || 0) * d.paginas;
            exemplar += (cfg.capa && cfg.capa[d.capa]) || 0;
            exemplar += (cfg.laminacao && cfg.laminacao[d.laminacao]) || 0;
            var subtotal = exemplar * d.tiragem;
            var extras = 0;
            if (d.isbn) extras += cfg.isbn || 0;
            if (d.ficha) extras += cfg.fichaCatalografica || 0;
            if (d.direitos) extras += cfg.direitosAutorais || 0;
            var tot = subtotal + extras - (d.desconto || 0);
            if (tot < 0) tot = 0;
            var unidade = d.tiragem > 0 ? tot / d.tiragem : tot;
            return { exemplar: exemplar, subtotal: subtotal, extras: extras, total: tot, unidade: unidade };
        }

        function mensagem(d, r, cliente) {
            var L = [];
            if (cliente) {
                L.push('✅ ORÇAMENTO ACEITO — pedido de impressão');
                L.push('');
                L.push('Nome: ' + (cliente.nome || ''));
                L.push('E-mail: ' + (cliente.email || ''));
                L.push('WhatsApp: ' + (cliente.fone || ''));
                L.push('');
                L.push('--- Especificações ---');
            } else {
                L.push('Olá! Gostaria de um orçamento de impressão:');
            }
            if (d.titulo) L.push('Título: ' + d.titulo);
            L.push('Formato: ' + d.formato);
            L.push('Papel: ' + d.papel);
            L.push('Total de páginas: ' + d.paginas);
            L.push('Tiragem: ' + d.tiragem);
            L.push('Capa: ' + d.capa);
            L.push('Laminação: ' + d.laminacao);
            var extras = [];
            if (d.isbn) extras.push('ISBN');
            if (d.ficha) extras.push('Ficha catalográfica');
            if (d.direitos) extras.push('Direitos autorais');
            L.push('Extras: ' + (extras.length ? extras.join(', ') : 'nenhum'));
            if (d.desconto) L.push('Desconto: ' + fmt(d.desconto));
            L.push('');
            L.push('Valor por exemplar: ' + fmt(r.unidade));
            L.push('Valor total (' + d.tiragem + ' un.): ' + fmt(r.total));
            return L.join('\n');
        }

        var ultimoD = null, ultimoR = null;

        function enviarPedido() {
            function val(id) { var e = document.getElementById(id); return e ? e.value.trim() : ''; }
            var cliente = { nome: val('orc-nome'), email: val('orc-email'), fone: val('orc-fone') };
            if (!cliente.nome) { var n = document.getElementById('orc-nome'); if (n) n.focus(); return; }
            if (!numWa) return;
            var url = 'https://wa.me/' + numWa + '?text=' + encodeURIComponent(mensagem(ultimoD, ultimoR, cliente));
            var a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener';
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
        }

        function calcular() {
            ultimoD = coletar();
            ultimoR = calc(ultimoD);
            var res = document.getElementById('orc-resultado');
            if (!res) return;
            var html = '<div class="orc-total"><span class="valor">' + fmt(ultimoR.unidade) + '</span>'
                + '<span class="rotulo">por exemplar</span></div>'
                + '<div class="orc-total-linha">Total (' + ultimoD.tiragem + ' un.): <strong>' + fmt(ultimoR.total) + '</strong></div>';
            html += '<button type="button" class="orc-btn-aceitar" id="orc-aceitar">Aceitar orçamento</button>';
            html += '<div id="orc-dados" style="display:none">'
                + '<div class="orc-extras-titulo">Seus dados</div>'
                + '<label class="orc-campo"><span>Nome</span><input type="text" id="orc-nome"></label>'
                + '<label class="orc-campo"><span>E-mail</span><input type="email" id="orc-email"></label>'
                + '<label class="orc-campo"><span>WhatsApp</span><input type="tel" id="orc-fone" placeholder="(DDD) número"></label>'
                + '<button type="button" class="orc-whatsapp" id="orc-enviar" style="border:none;cursor:pointer;width:100%">Enviar pedido pelo WhatsApp</button>'
                + '</div>';
            res.innerHTML = html;
            var bAce = document.getElementById('orc-aceitar');
            if (bAce) bAce.addEventListener('click', function () {
                var f = document.getElementById('orc-dados');
                if (f) f.style.display = 'block';
                bAce.style.display = 'none';
                var n = document.getElementById('orc-nome'); if (n) n.focus();
            });
            var bEnv = document.getElementById('orc-enviar');
            if (bEnv) bEnv.addEventListener('click', enviarPedido);
        }

        function abrir() { if (painel) painel.classList.add('ativo'); }
        function fechar() { if (painel) painel.classList.remove('ativo'); }

        const bf = painel ? painel.querySelector('.fechar-painel') : null;
        if (bf) bf.addEventListener('click', function (e) { e.stopPropagation(); fechar(); });

        montar();
        return { abrir: abrir, fechar: fechar };
    }

    const orcamentoImpressao = criarOrcamento();

    // ---- Orçamento de conversão para eBook (calculadora) ----

    function criarOrcamentoEbook() {
        const painel = document.getElementById('orcamento-ebook');
        const corpo = document.getElementById('orcamento-ebook-corpo');
        const cfg = C.orcamentoEbook || {};
        const numWa = (C.contato && C.contato.whatsapp) || '';
        const simbolo = cfg.moeda || 'R$';

        const elTit = document.getElementById('orcamento-ebook-titulo');
        if (elTit && cfg.titulo) elTit.textContent = cfg.titulo;

        function fmt(v) { return simbolo + ' ' + (v || 0).toFixed(2).replace('.', ','); }

        function montar() {
            if (!corpo) return;
            corpo.innerHTML =
                '<label class="orc-campo"><span>Título do livro</span>'
                + '<input type="text" id="orce-titulo" placeholder="Nome da obra"></label>'
                + '<label class="orc-campo"><span>Formato original do manuscrito</span>'
                + '<select id="orce-formato"><option value="Word">Word</option><option value="PDF">PDF</option></select></label>'
                + '<label class="orc-campo"><span>Total de páginas</span>'
                + '<input type="number" id="orce-paginas" min="0" step="1" value="0"></label>'
                + '<label class="orc-campo"><span>Número de figuras/imagens</span>'
                + '<input type="number" id="orce-figuras" min="0" step="1" value="0"></label>'
                + '<label class="orc-campo"><span>Número de tabelas</span>'
                + '<input type="number" id="orce-tabelas" min="0" step="1" value="0"></label>'
                + '<div class="orc-extras-titulo">Serviços extras</div>'
                + '<label class="orc-check"><input type="checkbox" id="orce-capa"> Criação de capa</label>'
                + '<label class="orc-check"><input type="checkbox" id="orce-isbn"> ISBN</label>'
                + '<label class="orc-campo"><span>Desconto (R$) — opcional</span>'
                + '<input type="number" id="orce-desconto" min="0" step="0.01" value="0"></label>'
                + '<button type="button" class="orc-btn-calcular" id="orce-calcular">Calcular orçamento</button>'
                + '<div id="orce-resultado"></div>';
            const btn = corpo.querySelector('#orce-calcular');
            if (btn) btn.addEventListener('click', calcular);
        }

        function coletar() {
            function val(id) { var e = document.getElementById(id); return e ? e.value : ''; }
            function num(id) { var e = document.getElementById(id); return e ? (parseFloat(e.value) || 0) : 0; }
            function marc(id) { var e = document.getElementById(id); return !!(e && e.checked); }
            return {
                titulo: val('orce-titulo'),
                formato: val('orce-formato'),
                paginas: parseInt(val('orce-paginas'), 10) || 0,
                figuras: parseInt(val('orce-figuras'), 10) || 0,
                tabelas: parseInt(val('orce-tabelas'), 10) || 0,
                capa: marc('orce-capa'),
                isbn: marc('orce-isbn'),
                desconto: num('orce-desconto')
            };
        }

        function calc(d) {
            var total = 0;
            total += (cfg.precoPagina || 0) * d.paginas;
            total += (cfg.precoFigura || 0) * d.figuras;
            total += (cfg.precoTabela || 0) * d.tabelas;
            if (d.capa) total += cfg.capa || 0;
            if (d.isbn) total += cfg.isbn || 0;
            total -= (d.desconto || 0);
            if (total < 0) total = 0;
            return { total: total };
        }

        function mensagem(d, r, cliente) {
            var L = [];
            if (cliente) {
                L.push('✅ ORÇAMENTO ACEITO — pedido de conversão para eBook');
                L.push('');
                L.push('Nome: ' + (cliente.nome || ''));
                L.push('E-mail: ' + (cliente.email || ''));
                L.push('WhatsApp: ' + (cliente.fone || ''));
                L.push('');
                L.push('--- Especificações ---');
            } else {
                L.push('Olá! Gostaria de um orçamento de conversão de manuscrito para eBook:');
            }
            if (d.titulo) L.push('Título: ' + d.titulo);
            L.push('Formato original do manuscrito: ' + d.formato);
            L.push('Total de páginas: ' + d.paginas);
            L.push('Figuras/imagens: ' + d.figuras);
            L.push('Tabelas: ' + d.tabelas);
            var extras = [];
            if (d.capa) extras.push('Criação de capa');
            if (d.isbn) extras.push('ISBN');
            L.push('Extras: ' + (extras.length ? extras.join(', ') : 'nenhum'));
            if (d.desconto) L.push('Desconto: ' + fmt(d.desconto));
            L.push('');
            L.push('Entrega em: EPUB e PDF');
            L.push('Valor total: ' + fmt(r.total));
            return L.join('\n');
        }

        var ultimoD = null, ultimoR = null;

        function enviarPedido() {
            function val(id) { var e = document.getElementById(id); return e ? e.value.trim() : ''; }
            var cliente = { nome: val('orce-nome'), email: val('orce-email'), fone: val('orce-fone') };
            if (!cliente.nome) { var n = document.getElementById('orce-nome'); if (n) n.focus(); return; }
            if (!numWa) return;
            var url = 'https://wa.me/' + numWa + '?text=' + encodeURIComponent(mensagem(ultimoD, ultimoR, cliente));
            var a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener';
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
        }

        function calcular() {
            ultimoD = coletar();
            ultimoR = calc(ultimoD);
            var res = document.getElementById('orce-resultado');
            if (!res) return;
            var html = '<div class="orc-total"><span class="valor">' + fmt(ultimoR.total) + '</span>'
                + '<span class="rotulo">valor total</span></div>';
            html += '<button type="button" class="orc-btn-aceitar" id="orce-aceitar">Aceitar orçamento</button>';
            html += '<div id="orce-dados" style="display:none">'
                + '<div class="orc-extras-titulo">Seus dados</div>'
                + '<label class="orc-campo"><span>Nome</span><input type="text" id="orce-nome"></label>'
                + '<label class="orc-campo"><span>E-mail</span><input type="email" id="orce-email"></label>'
                + '<label class="orc-campo"><span>WhatsApp</span><input type="tel" id="orce-fone" placeholder="(DDD) número"></label>'
                + '<button type="button" class="orc-whatsapp" id="orce-enviar" style="border:none;cursor:pointer;width:100%">Enviar pedido pelo WhatsApp</button>'
                + '</div>';
            res.innerHTML = html;
            var bAce = document.getElementById('orce-aceitar');
            if (bAce) bAce.addEventListener('click', function () {
                var f = document.getElementById('orce-dados');
                if (f) f.style.display = 'block';
                bAce.style.display = 'none';
                var n = document.getElementById('orce-nome'); if (n) n.focus();
            });
            var bEnv = document.getElementById('orce-enviar');
            if (bEnv) bEnv.addEventListener('click', enviarPedido);
        }

        function abrir() { if (painel) painel.classList.add('ativo'); }
        function fechar() { if (painel) painel.classList.remove('ativo'); }

        const bf = painel ? painel.querySelector('.fechar-painel') : null;
        if (bf) bf.addEventListener('click', function (e) { e.stopPropagation(); fechar(); });

        montar();
        return { abrir: abrir, fechar: fechar };
    }

    const orcamentoEbook = criarOrcamentoEbook();

    // ---- Serviços (carrossel de cards) — dados de conteudo.js ----

    const DADOS_SERVICOS = ((C.servicos && C.servicos.itens) || []).map(function (s) {
        return {
            titulo: s.titulo || '',
            capa: s.capa || '',
            texto: s.descricao || '',
            tipo: s.tipo || ''
        };
    });

    const painelServico = criarPainelDetalhe('detalhe-servico', {
        capa: 'detalhe-servico-capa',
        titulo: 'detalhe-servico-titulo',
        texto: 'detalhe-servico-descricao',
    });

    function abrirServico(item) {
        painelServico.fechar();
        orcamentoImpressao.fechar();
        orcamentoEbook.fechar();
        if (item.tipo === 'orcamento') {
            orcamentoImpressao.abrir();
        } else if (item.tipo === 'orcamento-ebook') {
            orcamentoEbook.abrir();
        } else {
            painelServico.abrir(item);
        }
    }

    // ---- Marcadores de Serviços: círculos coloridos + rótulo + seta,
    // cada um apontando para um prédio da silhueta, como se indicasse
    // onde aquele serviço "mora" na cidade. Posições em % do artboard
    // (2634x1482), convertidas para a área real da imagem (mesmo cálculo
    // usado pelos hotspots das placas). ----

    const PONTOS_SERVICOS = [
        { cor: '#c0392b', cx: 1968.6, cy: 1339.3, tx: 1684.5, ty: 1202.7 }, // Impressão
        { cor: '#1f6f5c', cx: 1225.2, cy: 1268.1, tx: 1322.1, ty: 1171.2 }, // Análise Crítica
        { cor: '#8e44ad', cx: 1240.3, cy: 807.6,  tx: 1055.5, ty: 1034.5 }, // Conversão / EPUB
        { cor: '#d68910', cx: 1707.9, cy: 949,    tx: 1544.8, ty: 1192.5 }  // Clube de Leitura
    ];

    const containerMarcadores = document.getElementById('marcadores-servicos');

    function montarMarcadores() {
        if (!containerMarcadores) return;
        containerMarcadores.innerHTML = '';
        const area = calcularAreaRealDaImagem();
        function paraTela(x, y) {
            return {
                x: area.offsetX + (x / ARTBOARD_WIDTH) * area.larguraReal,
                y: area.offsetY + (y / ARTBOARD_HEIGHT) * area.alturaReal
            };
        }
        const NS = 'http://www.w3.org/2000/svg';
        const svgLinhas = document.createElementNS(NS, 'svg');
        svgLinhas.setAttribute('style', 'position:absolute;top:0;left:0;width:100%;height:100%;overflow:visible;pointer-events:none;');
        containerMarcadores.appendChild(svgLinhas);
        const entradas = [];

        DADOS_SERVICOS.forEach(function (item, i) {
            const p = PONTOS_SERVICOS[i % PONTOS_SERVICOS.length];
            const c = paraTela(p.tx, p.ty);
            const t = paraTela(p.cx, p.cy);

            const linha = document.createElementNS(NS, 'line');
            linha.setAttribute('x1', t.x); linha.setAttribute('y1', t.y);
            linha.setAttribute('x2', c.x); linha.setAttribute('y2', c.y);
            linha.setAttribute('stroke', p.cor);
            linha.setAttribute('stroke-width', '3');
            linha.setAttribute('opacity', '0.85');
            svgLinhas.appendChild(linha);

            const ponto = document.createElement('span');
            ponto.className = 'marcador-servico-ponto';
            ponto.style.left = c.x + 'px';
            ponto.style.top = c.y + 'px';
            ponto.style.background = p.cor;
            ponto.style.boxShadow = '0 0 0 4px ' + p.cor + '33';
            containerMarcadores.appendChild(ponto);

            const marcador = document.createElement('button');
            marcador.type = 'button';
            marcador.className = 'marcador-servico';
            marcador.style.left = t.x + 'px';
            marcador.style.top = t.y + 'px';
            marcador.setAttribute('aria-label', item.titulo);

            const rotulo = document.createElement('span');
            rotulo.className = 'marcador-servico-rotulo';
            rotulo.textContent = item.titulo;
            rotulo.style.borderColor = p.cor;

            marcador.appendChild(rotulo);
            marcador.addEventListener('click', function (e) {
                e.stopPropagation();
                abrirServico(item);
            });
            containerMarcadores.appendChild(marcador);
            entradas.push({ marcador: marcador, linha: linha });
        });

        // Evita sobreposição entre rótulos cujas pontas de seta ficaram
        // próximas: empilha verticalmente, mantendo cada seta ligada ao
        // seu respectivo círculo na cidade.
        const comRect = entradas.map(function (e) {
            return { marcador: e.marcador, linha: e.linha, rect: e.marcador.getBoundingClientRect() };
        });
        comRect.sort(function (a, b) { return a.rect.top - b.rect.top; });
        const gap = 10;
        let ultimoFundo = -Infinity;
        comRect.forEach(function (e) {
            let topo = e.rect.top;
            if (topo < ultimoFundo + gap) {
                const delta = (ultimoFundo + gap) - topo;
                const topoAtual = parseFloat(e.marcador.style.top) || 0;
                e.marcador.style.top = (topoAtual + delta) + 'px';
                e.linha.setAttribute('y1', parseFloat(e.linha.getAttribute('y1')) + delta);
                topo += delta;
            }
            ultimoFundo = topo + e.rect.height;
        });
    }

    const botaoServicos = document.getElementById('btn-servicos');
    function toggleMarcadores() {
        if (!containerMarcadores) return;
        const abrindo = !containerMarcadores.classList.contains('ativo');
        fecharTodosPaineis();
        if (abrindo) {
            montarMarcadores();
            containerMarcadores.classList.add('ativo');
            if (botaoServicos) botaoServicos.setAttribute('aria-expanded', 'true');
        } else {
            containerMarcadores.classList.remove('ativo');
            if (botaoServicos) botaoServicos.setAttribute('aria-expanded', 'false');
        }
    }
    if (botaoServicos) {
        botaoServicos.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleMarcadores();
        });
    }
    let resizeTimeoutServicos;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeoutServicos);
        resizeTimeoutServicos = setTimeout(function () {
            if (containerMarcadores && containerMarcadores.classList.contains('ativo')) montarMarcadores();
        }, 100);
    });
    const carrosselServicos = { fechar: function () { if (containerMarcadores) containerMarcadores.classList.remove('ativo'); } };

    // ---- MODO CALIBRAÇÃO (temporário): adicione ?calibrar na URL para
    // clicar na ilustração e ver as coordenadas exatas (sistema 2634x1482)
    // no console e num aviso na tela. Use para me passar os pontos certos. ----
    if (window.location.search.indexOf('calibrar') !== -1) {
        const aviso = document.createElement('div');
        aviso.style.cssText = 'position:fixed;top:8px;left:8px;z-index:999;background:#000;color:#0f0;font:12px monospace;padding:8px 12px;border-radius:4px;max-width:90vw;white-space:pre-wrap;';
        aviso.textContent = 'MODO CALIBRAÇÃO: clique na imagem para ver as coordenadas (px, py).';
        document.body.appendChild(aviso);
        document.addEventListener('click', function (e) {
            const area = calcularAreaRealDaImagem();
            const px = ((e.clientX - area.offsetX) / area.larguraReal) * ARTBOARD_WIDTH;
            const py = ((e.clientY - area.offsetY) / area.alturaReal) * ARTBOARD_HEIGHT;
            const linha = 'px: ' + Math.round(px) + ',  py: ' + Math.round(py);
            aviso.textContent = 'MODO CALIBRAÇÃO — último clique:\n' + linha + '\n\n(clique em outro ponto para atualizar)';
            console.log(linha);
        }, true);
    }

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

    // ---- Contato — e-mail exibido como link (sem formulário/provedor) ----
    // O endereço vem de conteudo.js (contato.email) e é aplicado em
    // preencherTextos(). Nada a processar aqui.

    // Clique fora fecha tudo.
    document.addEventListener('click', function (evento) {
        const cliqueDentroDePainel = evento.target.closest('.painel-info');
        const cliqueDentroDaFaixa = evento.target.closest('.faixa-carrossel');
        const cliqueEmHotspot = evento.target.closest('#hotspots');
        const cliqueEmGatilhoLogo = evento.target.closest('#gatilho-logo');
        if (!cliqueDentroDePainel && !cliqueDentroDaFaixa && !cliqueEmHotspot && !cliqueEmGatilhoLogo) {
            fecharTodosPaineis();
            if (window.__carrosselPublicacoes) window.__carrosselPublicacoes.fechar();
            carrosselServicos.fechar();
            if (window.__painelLivro) window.__painelLivro.fechar();
            painelServico.fechar();
            orcamentoImpressao.fechar();
            orcamentoEbook.fechar();
            fecharTextoLogo();
        }
    });

    // ESC fecha tudo.
    document.addEventListener('keydown', function (evento) {
        if (evento.key === 'Escape') {
            fecharTodosPaineis();
            if (window.__carrosselPublicacoes) window.__carrosselPublicacoes.fechar();
            carrosselServicos.fechar();
            if (window.__painelLivro) window.__painelLivro.fechar();
            painelServico.fechar();
            orcamentoImpressao.fechar();
            orcamentoEbook.fechar();
            fecharTextoLogo();
        }
    });
})();
