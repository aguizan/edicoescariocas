console.log("Projeto iniciado.");

/**
 * Posicionamento dinâmico dos hotspots sobre as placas.
 *
 * Problema que este script resolve:
 * A imagem #poste-interativo usa object-fit: contain dentro de uma área
 * de 100vw x 100vh. Quando a proporção da tela do usuário é diferente da
 * proporção do artboard original (2634 x 1482), sobram faixas vazias
 * (letterboxing) nas laterais ou em cima/embaixo da imagem.
 *
 * Hotspots posicionados em % fixo da tela (100vw/100vh) ficam desalinhados
 * nesses casos, porque não consideram essas faixas vazias.
 *
 * Este script calcula a área real onde a imagem está desenhada na tela
 * (descontando o letterboxing) e posiciona cada <a> proporcionalmente
 * a essa área real, não à tela inteira.
 */

(function () {
    'use strict';

    // Dimensões originais do artboard (Affinity), em pixels.
    const ARTBOARD_WIDTH = 2634;
    const ARTBOARD_HEIGHT = 1482;

    // Coordenadas de cada placa no artboard original: { x, y, largura, altura }
    // Extraídas diretamente dos paths do arquivo Placas.svg (bounding box real
    // de cada placa), não de medição manual no Affinity — isso elimina o
    // desalinhamento causado por imprecisão na régua/guia usada para medir.
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

    /**
     * Calcula a área real (em pixels da tela) onde a imagem está sendo
     * desenhada, considerando object-fit: contain e object-position:
     * bottom center.
     */
    function calcularAreaRealDaImagem() {
        const containerWidth = imagem.clientWidth;   // 100vw
        const containerHeight = imagem.clientHeight; // 100vh

        const proporcaoImagem = ARTBOARD_WIDTH / ARTBOARD_HEIGHT;
        const proporcaoContainer = containerWidth / containerHeight;

        let larguraReal, alturaReal, offsetX, offsetY;

        if (proporcaoContainer > proporcaoImagem) {
            // Container mais largo que a imagem: sobra espaço nas laterais.
            alturaReal = containerHeight;
            larguraReal = alturaReal * proporcaoImagem;
            offsetX = (containerWidth - larguraReal) / 2; // centralizado
            offsetY = 0; // object-position: bottom -> imagem encosta embaixo
        } else {
            // Container mais alto/estreito que a imagem: sobra espaço em cima/embaixo.
            larguraReal = containerWidth;
            alturaReal = larguraReal / proporcaoImagem;
            offsetX = 0; // object-position: center (horizontal)
            offsetY = containerHeight - alturaReal; // encostada embaixo (bottom)
        }

        return { larguraReal, alturaReal, offsetX, offsetY };
    }

    /**
     * Reposiciona todos os hotspots com base na área real da imagem.
     */
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
            const width = (placa.l / ARTBOARD_WIDTH) * area.larguraReal;
            const height = (placa.a / ARTBOARD_HEIGHT) * area.alturaReal;

            elemento.style.left = left + 'px';
            elemento.style.top = top + 'px';
            elemento.style.width = width + 'px';
            elemento.style.height = height + 'px';
        });
    }

    // Recalcula assim que a imagem terminar de carregar (garante que
    // clientWidth/clientHeight já estejam corretos).
    if (imagem.complete) {
        atualizarHotspots();
    } else {
        imagem.addEventListener('load', atualizarHotspots);
    }

    // Recalcula sempre que a janela for redimensionada, com debounce leve
    // para não recalcular a cada pixel durante o resize.
    let resizeTimeout;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(atualizarHotspots, 100);
    });
})();