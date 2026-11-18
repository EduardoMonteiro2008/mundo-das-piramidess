
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// =================================
// 1. ELEMENTOS DO HTML
// =================================

const area = document.getElementById("visualizador-3d");
const seletor = document.getElementById("tipo-piramide");

const quantidadeFaces = document.getElementById("quantidade-faces");
const quantidadeArestas = document.getElementById("quantidade-arestas");
const quantidadeVertices = document.getElementById("quantidade-vertices");

const botaoFaces = document.getElementById("botao-faces");
const botaoArestas = document.getElementById("botao-arestas");
const botaoVertices = document.getElementById("botao-vertices");

// =================================
// 2. CENA E CÂMERA
// =================================

const cena = new THREE.Scene();
cena.background = new THREE.Color(0x0f172a);

const camera = new THREE.PerspectiveCamera(
    60,
    area.clientWidth / area.clientHeight,
    0.1,
    1000
);

camera.position.set(5, 4, 6);

// =================================
// 3. RENDERIZADOR
// =================================

const renderizador = new THREE.WebGLRenderer({
    antialias: true
});

renderizador.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderizador.setSize(
    area.clientWidth,
    area.clientHeight
);

area.appendChild(renderizador.domElement);

// =================================
// 4. CONTROLES DO MOUSE
// =================================

const controles = new OrbitControls(
    camera,
    renderizador.domElement
);

controles.enableDamping = true;
controles.dampingFactor = 0.05;

controles.enableZoom = true;
controles.enablePan = true;

controles.minDistance = 3;
controles.maxDistance = 12;

// =================================
// 5. MATERIAIS
// =================================

const materialFaces = new THREE.MeshStandardMaterial({
    color: 0x818cf8,
    roughness: 0.4,
    metalness: 0.1,
    flatShading: true,
    side: THREE.DoubleSide
});

const materialArestas = new THREE.LineBasicMaterial({
    color: 0xfacc15
});

const materialVertices = new THREE.MeshBasicMaterial({
    color: 0xf43f5e
});

// =================================
// 6. GRUPO DA PIRÂMIDE
// =================================

let grupoPiramide = null;
let modoVisualizacao = "faces";

function criarPiramide(lados) {

    // Remove o modelo anterior
    if (grupoPiramide !== null) {
        cena.remove(grupoPiramide);

        grupoPiramide.traverse((objeto) => {
            if (objeto.geometry) {
                objeto.geometry.dispose();
            }
        });
    }

    grupoPiramide = new THREE.Group();

    const raio = 2;
    const altura = 3;
    const baseY = -altura / 2;
    const topoY = altura / 2;

    const verticesBase = [];

    // Cria os vértices da base
    for (let i = 0; i < lados; i++) {

        const angulo =
            (i * Math.PI * 2) / lados;

        const x = raio * Math.cos(angulo);
        const z = raio * Math.sin(angulo);

        verticesBase.push(
            new THREE.Vector3(x, baseY, z)
        );
    }

    const topo = new THREE.Vector3(
        0,
        topoY,
        0
    );

    // =================================
    // 7. FACES
    // =================================

    const posicoes = [];

    // Faces laterais
    for (let i = 0; i < lados; i++) {

        const atual = verticesBase[i];
        const proximo = verticesBase[
            (i + 1) % lados
        ];

        posicoes.push(
            topo.x, topo.y, topo.z,
            atual.x, atual.y, atual.z,
            proximo.x, proximo.y, proximo.z
        );
    }

    // Base da pirâmide
    for (let i = 1; i < lados - 1; i++) {

        const primeiro = verticesBase[0];
        const atual = verticesBase[i];
        const proximo = verticesBase[i + 1];

        posicoes.push(
            primeiro.x, primeiro.y, primeiro.z,
            atual.x, atual.y, atual.z,
            proximo.x, proximo.y, proximo.z
        );
    }

    const geometria = new THREE.BufferGeometry();

    geometria.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
            posicoes,
            3
        )
    );

    geometria.computeVertexNormals();

    const faces = new THREE.Mesh(
        geometria,
        materialFaces
    );

    faces.name = "faces";
    grupoPiramide.add(faces);

    // =================================
    // 8. ARESTAS
    // =================================

    const pontosArestas = [];

    for (let i = 0; i < lados; i++) {

        const atual = verticesBase[i];
        const proximo = verticesBase[
            (i + 1) % lados
        ];

        // Aresta da base
        pontosArestas.push(atual, proximo);

        // Aresta lateral
        pontosArestas.push(atual, topo);
    }

    const geometriaArestas =
        new THREE.BufferGeometry().setFromPoints(
            pontosArestas
        );

    const arestas = new THREE.LineSegments(
        geometriaArestas,
        materialArestas
    );

    arestas.name = "arestas";
    grupoPiramide.add(arestas);

    // =================================
    // 9. VÉRTICES
    // =================================

    const todosVertices = [
        ...verticesBase,
        topo
    ];

    const grupoVertices = new THREE.Group();
    grupoVertices.name = "vertices";

    todosVertices.forEach((posicao) => {

        const esfera = new THREE.Mesh(
            new THREE.SphereGeometry(
                0.09,
                12,
                12
            ),
            materialVertices
        );

        esfera.position.copy(posicao);

        grupoVertices.add(esfera);
    });

    grupoPiramide.add(grupoVertices);

    // Adiciona o modelo à cena
    cena.add(grupoPiramide);

    // Atualiza os indicadores
    quantidadeFaces.textContent = lados + 1;
    quantidadeArestas.textContent = lados * 2;
    quantidadeVertices.textContent = lados + 1;

    atualizarVisualizacao();
}

// =================================
// 10. MODOS DE VISUALIZAÇÃO
// =================================

function atualizarVisualizacao() {

    if (!grupoPiramide) return;

    const faces = grupoPiramide.getObjectByName("faces");
    const arestas = grupoPiramide.getObjectByName("arestas");
    const vertices = grupoPiramide.getObjectByName("vertices");

    // Mantém as faces visíveis como referência
    faces.visible = true;

    // Destaca o elemento escolhido
    arestas.visible = modoVisualizacao === "arestas";
    vertices.visible = modoVisualizacao === "vertices";

    materialFaces.color.set(
        modoVisualizacao === "faces"
            ? 0x818cf8
            : 0x433d78
    );

    // Atualiza os botões
    botaoFaces.classList.toggle(
        "ativo",
        modoVisualizacao === "faces"
    );

    botaoArestas.classList.toggle(
        "ativo",
        modoVisualizacao === "arestas"
    );

    botaoVertices.classList.toggle(
        "ativo",
        modoVisualizacao === "vertices"
    );
}

// =================================
// 11. EVENTOS DOS BOTÕES
// =================================

botaoFaces.addEventListener("click", () => {
    modoVisualizacao = "faces";
    atualizarVisualizacao();
});

botaoArestas.addEventListener("click", () => {
    modoVisualizacao = "arestas";
    atualizarVisualizacao();
});

botaoVertices.addEventListener("click", () => {
    modoVisualizacao = "vertices";
    atualizarVisualizacao();
});

// =================================
// 12. SELETOR DE PIRÂMIDES
// =================================

seletor.addEventListener("change", () => {
    criarPiramide(Number(seletor.value));
});

criarPiramide(Number(seletor.value));

// =================================
// 13. ILUMINAÇÃO
// =================================

const luz = new THREE.DirectionalLight(
    0xffffff,
    3
);

luz.position.set(3, 5, 4);
cena.add(luz);

const luzAmbiente = new THREE.AmbientLight(
    0xffffff,
    1
);

cena.add(luzAmbiente);

// =================================
// 14. GRADE DE REFERÊNCIA
// =================================

const grade = new THREE.GridHelper(
    10,
    10,
    0x64748b,
    0x334155
);

grade.position.y = -1.52;
cena.add(grade);

// =================================
// 15. REDIMENSIONAMENTO
// =================================

function ajustarTamanho() {

    const largura = area.clientWidth;
    const altura = area.clientHeight;

    camera.aspect = largura / altura;
    camera.updateProjectionMatrix();

    renderizador.setSize(largura, altura);
}

window.addEventListener(
    "resize",
    ajustarTamanho
);

// =================================
// 16. ANIMAÇÃO
// =================================

function animar() {

    requestAnimationFrame(animar);

    controles.update();

    renderizador.render(cena, camera);
}

animar();
