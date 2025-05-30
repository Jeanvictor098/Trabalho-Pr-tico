const pedidos = [];

document.getElementById("formPedido").addEventListener("submit", function(event) {
    event.preventDefault();
    cadastrarPedido();
});

document.getElementById("campoBusca").addEventListener("input", function() {
    buscarPedido(this.value);
});

function cadastrarPedido() {
    const nome = document.getElementById("nomeCliente").value.trim();
    const numero = document.getElementById("numeroPedido").value;
    const itens = Array.from(document.querySelectorAll('input[name="itens"]:checked')).map(item => item.value);
    const observacoes = document.getElementById("observacoes").value.trim();
    const pagamento = document.getElementById("formaPagamento").value;
    const status = document.getElementById("statusPedido").value;

    if (!nome || !numero || itens.length === 0) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    if (pedidos.some(p => p.numero === numero)) {
        alert("Número do pedido já existe.");
        return;
    }

    const pedido = { nome, numero, itens, observacoes, pagamento, status };
    pedidos.push(pedido);
    atualizarLista();
}

function atualizarLista() {
    const lista = document.getElementById("listaPedidos");
    lista.innerHTML = pedidos.map((p, index) => `
        <div class="pedido-card">
            <p><strong>Cliente:</strong> ${p.nome}</p>
            <p><strong>Número:</strong> ${p.numero}</p>
            <p><strong>Status:</strong> ${p.status}</p>
            <button onclick="visualizarPedido(${index})">Ver Detalhes</button>
            <button onclick="atualizarStatus(${index})">Atualizar Status</button>
            <button onclick="cancelarPedido(${index})">Cancelar Pedido</button>
        </div>
    `).join("");
}

function visualizarPedido(index) {
    const pedido = pedidos[index];
    const modal = document.getElementById("modal");
    const modalInfo = document.getElementById("modalInfo");

    modalInfo.innerHTML = `
        <p><strong>Nome do Cliente:</strong> ${pedido.nome}</p>
        <p><strong>Número do Pedido:</strong> ${pedido.numero}</p>
        <p><strong>Itens:</strong> ${pedido.itens.join(", ")}</p>
        <p><strong>Observações:</strong> ${pedido.observacoes}</p>
        <p><strong>Forma de Pagamento:</strong> ${pedido.pagamento}</p>
        <p><strong>Status:</strong> ${pedido.status}</p>
    `;

    modal.style.display = "block";
}

document.querySelector(".close").addEventListener("click", function() {
    document.getElementById("modal").style.display = "none";
});

function atualizarStatus(index) {
    const statusOptions = ["Pendente", "Em preparo", "Pronto", "Entregue"];
    const novoStatus = prompt(`Novo status (${statusOptions.join(", ")}):`);

    if (statusOptions.includes(novoStatus)) {
        pedidos[index].status = novoStatus;
        atualizarLista();
    } else {
        alert("Status inválido.");
    }
}

function cancelarPedido(index) {
    const confirmar = confirm("Tem certeza que deseja cancelar este pedido?");
    if (confirmar) {
        pedidos.splice(index, 1);
        atualizarLista();
    }
}

function buscarPedido(nome) {
    const lista = document.getElementById("listaPedidos");
    lista.innerHTML = pedidos
        .filter(p => p.nome.toLowerCase().includes(nome.toLowerCase()))
        .map((p, index) => `
            <div class="pedido-card">
                <p><strong>Cliente:</strong> ${p.nome}</p>
                <p><strong>Número:</strong> ${p.numero}</p>
                <p><strong>Status:</strong> ${p.status}</p>
                <button onclick="visualizarPedido(${index})">Ver Detalhes</button>
                <button onclick="atualizarStatus(${index})">Atualizar Status</button>
                <button onclick="cancelarPedido(${index})">Cancelar Pedido</button>
            </div>
        `).join("");
}