
// =================================
// PLANIFICAÇÃO INTERATIVA 2D
// =================================

// ELEMENTOS DO HTML
const seletorPlanificacao =
    document.getElementById("tipo-planificacao");

const desenhoPlanificacao =
    document.getElementById("desenho-planificacao");

const botaoFaces2D =
    document.getElementById("planificacao-botao-faces");

const botaoArestas2D =
    document.getElementById("planificacao-botao-arestas");

const botaoVertices2D =
    document.getElementById("planificacao-botao-vertices");

const namespaceSVG = "http://www.w3.org/2000/svg";

let modoPlanificacao = "faces";

// CRIAR ELEMENTOS SVG
function criarElementoSVG(tipo, atributos) {

    const elemento =
        document.createElementNS(namespaceSVG, tipo);

    Object.entries(atributos).forEach(([nome, valor]) => {
        elemento.setAttribute(nome, valor);
    });

    return elemento;
}

// DESENHAR PLANIFICAÇÃO
function desenharPlanificacao() {

    const lados = Number(seletorPlanificacao.value);

    desenhoPlanificacao.replaceChildren();

    const centroX = 200;
    const centroY = 200;
    const raioBase = 70;
    const alturaTriangulo = 75;

    const vertices = [];
    const pontas = [];

    // VÉRTICES DA BASE
    for (let i = 0; i < lados; i++) {

        const angulo =
            -Math.PI / 2 + (2 * Math.PI * i) / lados;

        vertices.push({
            x: centroX + raioBase * Math.cos(angulo),
            y: centroY + raioBase * Math.sin(angulo)
        });
    }

    // CALCULAR PONTAS DOS TRIÂNGULOS
    for (let i = 0; i < lados; i++) {

        const atual = vertices[i];
        const proximo = vertices[(i + 1) % lados];

        const meioX = (atual.x + proximo.x) / 2;
        const meioY = (atual.y + proximo.y) / 2;

        const distancia = Math.hypot(
            meioX - centroX,
            meioY - centroY
        );

        pontas.push({
            x: meioX +
                ((meioX - centroX) / distancia) *
                alturaTriangulo,

            y: meioY +
                ((meioY - centroY) / distancia) *
                alturaTriangulo
        });
    }

    const destacarFaces = modoPlanificacao === "faces";
    const destacarArestas = modoPlanificacao === "arestas";
    const destacarVertices = modoPlanificacao === "vertices";

    // FACES LATERAIS
    for (let i = 0; i < lados; i++) {

        const atual = vertices[i];
        const proximo = vertices[(i + 1) % lados];
        const ponta = pontas[i];

        desenhoPlanificacao.appendChild(
            criarElementoSVG("polygon", {
                points:
                    `${atual.x},${atual.y} ` +
                    `${proximo.x},${proximo.y} ` +
                    `${ponta.x},${ponta.y}`,

                fill: destacarFaces
                    ? (i % 2 === 0 ? "#6366f1" : "#818cf8")
                    : "#292f50",

                stroke: destacarArestas
                    ? "#facc15"
                    : "#818cf8",

                "stroke-width": destacarArestas ? 3.5 : 1.5
            })
        );
    }

    // BASE
    desenhoPlanificacao.appendChild(
        criarElementoSVG("polygon", {
            points: vertices
                .map(p => `${p.x},${p.y}`)
                .join(" "),

            fill: destacarFaces ? "#3730a3" : "#292f50",

            stroke: destacarArestas ? "#facc15" : "#818cf8",

            "stroke-width": destacarArestas ? 3.5 : 1.5
        })
    );

    // LINHAS DE DOBRA
    for (let i = 0; i < lados; i++) {

        const atual = vertices[i];
        const proximo = vertices[(i + 1) % lados];

        desenhoPlanificacao.appendChild(
            criarElementoSVG("line", {
                x1: atual.x,
                y1: atual.y,
                x2: proximo.x,
                y2: proximo.y,
                stroke: destacarArestas
                    ? "#facc15"
                    : "#a5b4fc",
                "stroke-width": destacarArestas ? 3 : 1.5,
                "stroke-dasharray": "6 5"
            })
        );
    }

    // VÉRTICES DA PLANIFICAÇÃO
    if (destacarVertices) {

        const pontos = [...vertices, ...pontas];

        pontos.forEach(ponto => {

            desenhoPlanificacao.appendChild(
                criarElementoSVG("circle", {
                    cx: ponto.x,
                    cy: ponto.y,
                    r: 6,
                    fill: "#f43f5e",
                    stroke: "#fecdd3",
                    "stroke-width": 1.5
                })
            );
        });
    }

    // TEXTO CENTRAL
    if (destacarFaces) {

        const texto = criarElementoSVG("text", {
            x: centroX,
            y: centroY + 5,
            fill: "#ffffff",
            "font-size": 16,
            "font-weight": 600,
            "text-anchor": "middle"
        });

        texto.textContent = "Base";
        desenhoPlanificacao.appendChild(texto);
    }

    // ATUALIZAR INDICADORES
    document.getElementById("planificacao-faces")
        .textContent = lados + 1;

    document.getElementById("planificacao-arestas")
        .textContent = lados * 2;

    document.getElementById("planificacao-vertices")
        .textContent = lados + 1;

    // ATUALIZAR BOTÕES
    botaoFaces2D.classList.toggle(
        "ativo", destacarFaces
    );

    botaoArestas2D.classList.toggle(
        "ativo", destacarArestas
    );

    botaoVertices2D.classList.toggle(
        "ativo", destacarVertices
    );
}

// EVENTOS
botaoFaces2D.addEventListener("click", () => {
    modoPlanificacao = "faces";
    desenharPlanificacao();
});

botaoArestas2D.addEventListener("click", () => {
    modoPlanificacao = "arestas";
    desenharPlanificacao();
});

botaoVertices2D.addEventListener("click", () => {
    modoPlanificacao = "vertices";
    desenharPlanificacao();
});

seletorPlanificacao.addEventListener(
    "change",
    desenharPlanificacao
);

// INICIALIZAÇÃO
desenharPlanificacao();
