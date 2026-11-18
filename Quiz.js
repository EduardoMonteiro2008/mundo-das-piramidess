
// =================================
// QUIZ INTERATIVO DAS PIRÂMIDES
// =================================

// 1. BANCO DE PERGUNTAS

const perguntasQuiz = [
    {
        pergunta: "Quantas faces possui uma pirâmide quadrangular?",
        alternativas: ["4 faces", "5 faces", "6 faces", "8 faces"],
        correta: 1,
        explicacao: "Ela possui 4 faces laterais e 1 base, totalizando 5 faces."
    },
    {
        pergunta: "Qual é a fórmula do volume de uma pirâmide?",
        alternativas: [
            "V = Ab × h",
            "V = (Ab × h) ÷ 3",
            "V = Ab + h",
            "V = 2 × Ab × h"
        ],
        correta: 1,
        explicacao: "O volume é calculado multiplicando a área da base pela altura e dividindo por 3."
    },
    {
        pergunta: "Quantos vértices possui uma pirâmide hexagonal?",
        alternativas: ["6", "8", "7", "12"],
        correta: 2,
        explicacao: "São 6 vértices na base e 1 ápice, totalizando 7."
    },
    {
        pergunta: "Qual é o formato das faces laterais de uma pirâmide?",
        alternativas: ["Quadrados", "Círculos", "Retângulos", "Triângulos"],
        correta: 3,
        explicacao: "As faces laterais das pirâmides são sempre triangulares."
    },
    {
        pergunta: "Quantas arestas possui uma pirâmide pentagonal?",
        alternativas: ["10", "5", "6", "12"],
        correta: 0,
        explicacao: "Ela possui 5 arestas na base e 5 laterais."
    },
    {
        pergunta: "Como se chama o vértice onde as faces laterais se encontram?",
        alternativas: ["Centro", "Ápice", "Base", "Diagonal"],
        correta: 1,
        explicacao: "Esse vértice é chamado de ápice."
    },
    {
        pergunta: "Uma pirâmide possui área da base de 18 cm² e altura de 6 cm. Qual é seu volume?",
        alternativas: ["108 cm³", "24 cm³", "36 cm³", "18 cm³"],
        correta: 2,
        explicacao: "V = (18 × 6) ÷ 3 = 36 cm³."
    },
    {
        pergunta: "Qual é a base de uma pirâmide triangular?",
        alternativas: ["Um triângulo", "Um quadrado", "Um pentágono", "Um círculo"],
        correta: 0,
        explicacao: "Uma pirâmide triangular possui um triângulo como base."
    },
    {
        pergunta: "Quantas faces possui uma pirâmide hexagonal?",
        alternativas: ["6", "12", "8", "7"],
        correta: 3,
        explicacao: "São 6 faces laterais e 1 base."
    },
    {
        pergunta: "O que representa a altura de uma pirâmide?",
        alternativas: [
            "Uma aresta lateral",
            "A distância perpendicular do ápice ao plano da base",
            "O perímetro da base",
            "A largura de uma face"
        ],
        correta: 1,
        explicacao: "A altura é a distância perpendicular entre o ápice e o plano da base."
    }
];

// =================================
// 2. ELEMENTOS DO HTML
// =================================

const quizPergunta = document.getElementById("quiz-pergunta");
const quizAlternativas = document.getElementById("quiz-alternativas");
const quizContador = document.getElementById("quiz-contador");
const quizPontos = document.getElementById("quiz-pontos");
const quizBarra = document.getElementById("quiz-barra-preenchimento");
const quizFeedback = document.getElementById("quiz-feedback");
const quizProxima = document.getElementById("quiz-proxima");

const quizJogo = document.getElementById("quiz-jogo");
const quizResultado = document.getElementById("quiz-resultado");
const quizResultadoTexto = document.getElementById("quiz-resultado-texto");
const quizResultadoPontos = document.getElementById("quiz-resultado-pontos");
const quizReiniciar = document.getElementById("quiz-reiniciar");

// =================================
// 3. CONTROLE DO JOGO
// =================================

let perguntaAtual = 0;
let pontuacao = 0;
let respondeu = false;

// =================================
// 4. EXIBIR PERGUNTA
// =================================

function mostrarPergunta() {

    respondeu = false;

    const pergunta = perguntasQuiz[perguntaAtual];

    quizPergunta.textContent = pergunta.pergunta;
    quizAlternativas.innerHTML = "";

    quizContador.textContent =
        `Pergunta ${perguntaAtual + 1} de ${perguntasQuiz.length}`;

    quizPontos.textContent = `Pontos: ${pontuacao}`;

    quizBarra.style.width =
        `${(perguntaAtual / perguntasQuiz.length) * 100}%`;

    quizFeedback.hidden = true;
    quizFeedback.textContent = "";

    quizProxima.disabled = true;

    quizProxima.textContent =
        perguntaAtual === perguntasQuiz.length - 1
            ? "Ver resultado"
            : "Próxima pergunta";

    pergunta.alternativas.forEach((alternativa, indice) => {

        const botao = document.createElement("button");

        botao.type = "button";
        botao.className = "quiz-alternativa";

        botao.textContent =
            `${String.fromCharCode(65 + indice)}. ${alternativa}`;

        botao.addEventListener("click", () => {
            verificarResposta(indice);
        });

        quizAlternativas.appendChild(botao);
    });
}

// =================================
// 5. VERIFICAR RESPOSTA
// =================================

function verificarResposta(indiceSelecionado) {

    if (respondeu) return;

    respondeu = true;

    const pergunta = perguntasQuiz[perguntaAtual];

    const botoes = quizAlternativas.querySelectorAll(
        ".quiz-alternativa"
    );

    const acertou = indiceSelecionado === pergunta.correta;

    if (acertou) {
        pontuacao++;
    }

    botoes.forEach((botao, indice) => {

        botao.disabled = true;

        if (indice === pergunta.correta) {
            botao.classList.add("correta");
        } else if (indice === indiceSelecionado) {
            botao.classList.add("incorreta");
        }
    });

    quizPontos.textContent = `Pontos: ${pontuacao}`;

    quizFeedback.hidden = false;

    quizFeedback.textContent =
        (acertou ? "✓ Resposta correta! " : "✗ Resposta incorreta. ")
        + pergunta.explicacao;

    quizProxima.disabled = false;
}

// =================================
// 6. PRÓXIMA PERGUNTA
// =================================

quizProxima.addEventListener("click", () => {

    if (!respondeu) return;

    perguntaAtual++;

    if (perguntaAtual < perguntasQuiz.length) {
        mostrarPergunta();
    } else {
        mostrarResultado();
    }
});

// =================================
// 7. RESULTADO FINAL
// =================================

function mostrarResultado() {

    quizJogo.hidden = true;
    quizResultado.hidden = false;

    quizResultadoPontos.textContent =
        `${pontuacao} de ${perguntasQuiz.length} pontos`;

    if (pontuacao >= 8) {
        quizResultadoTexto.textContent =
            "Excelente! Você domina o conteúdo sobre pirâmides!";
    } else if (pontuacao >= 5) {
        quizResultadoTexto.textContent =
            "Muito bem! Continue estudando para melhorar ainda mais.";
    } else {
        quizResultadoTexto.textContent =
            "Continue praticando! Revise o conteúdo e tente novamente.";
    }
}

// =================================
// 8. REINICIAR QUIZ
// =================================

quizReiniciar.addEventListener("click", () => {

    perguntaAtual = 0;
    pontuacao = 0;
    respondeu = false;

    quizResultado.hidden = true;
    quizJogo.hidden = false;

    mostrarPergunta();
});

// =================================
// 9. INICIAR QUIZ
// =================================

mostrarPergunta();
