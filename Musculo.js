
console.log("Mundo das Pirâmides iniciado!");

/* =================================
   MENU RESPONSIVO
================================= */

const botaoMenu = document.getElementById("menu-toggle");

const menu = document.getElementById("menu");

botaoMenu.addEventListener("click", function () {

    menu.classList.toggle("ativo");

});


/* FECHAR MENU AO CLICAR EM UM LINK */

const linksMenu = document.querySelectorAll(".menu a");

linksMenu.forEach(function (link) {

    link.addEventListener("click", function () {

        menu.classList.remove("ativo");

    });

});


/* MENSAGEM DE INICIALIZAÇÃO */

console.log("Mundo das Pirâmides iniciado com sucesso!");


// =================================
// CALCULADORA DE VOLUME
// =================================

const botaoCalcular = document.getElementById("calcular-volume");

if (botaoCalcular) {

    const campoTipo = document.getElementById("calc-tipo");
    const campoLado = document.getElementById("calc-lado");
    const campoAltura = document.getElementById("calc-altura");
    const resultado = document.getElementById("resultado-volume");

    const formatarNumero = (numero) => {
        return Number(numero.toFixed(3)).toLocaleString("pt-BR");
    };

    botaoCalcular.addEventListener("click", () => {

        const lados = Number(campoTipo.value);
        const lado = Number(campoLado.value);
        const altura = Number(campoAltura.value);

        if (
            campoLado.value.trim() === "" ||
            campoAltura.value.trim() === "" ||
            !Number.isFinite(lado) ||
            !Number.isFinite(altura) ||
            lado <= 0 ||
            altura <= 0
        ) {
            resultado.hidden = false;
            resultado.textContent =
                "Informe um lado e uma altura maiores que zero.";
            return;
        }

        // Área de um polígono regular
        const areaBase = (
            lados * Math.pow(lado, 2)
        ) / (
            4 * Math.tan(Math.PI / lados)
        );

        // Volume da pirâmide
        const volume = (areaBase * altura) / 3;

        // Exibe a resolução
        resultado.hidden = false;

        resultado.innerHTML = `
            <h4>Resultado do cálculo</h4>

            <p>
                <strong>1. Fórmula geral:</strong>
                V = (Ab × h) ÷ 3
            </p>

            <p>
                <strong>2. Área da base:</strong>
                Ab = [${lados} × (${formatarNumero(lado)})²]
                ÷ [4 × tan(π/${lados})]
            </p>

            <p>
                Ab ≈ ${formatarNumero(areaBase)} cm²
            </p>

            <p>
                <strong>3. Substituindo os valores:</strong>
                V = (${formatarNumero(areaBase)} ×
                ${formatarNumero(altura)}) ÷ 3
            </p>

            <p>
                <strong>Volume final:</strong>
                ${formatarNumero(volume)} cm³
            </p>
        `;
    });

    // Esconde resultados antigos ao mudar os valores
    [campoTipo, campoLado, campoAltura].forEach((campo) => {
        campo.addEventListener("input", () => {
            resultado.hidden = true;
        });
    });
}
