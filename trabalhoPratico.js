document.addEventListener("DOMContentLoaded", () => {
    let pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
    let termoBusca = '';

    const form = document.getElementById('formCadastro');
    const listaPacientes = document.getElementById('listaPacientes');
    const campoBusca = document.getElementById('campoBusca');
    const modal = document.getElementById("modal");
    const modalInfo = document.getElementById("modalInfo");
    const closeBtn = document.querySelector(".close");

    function validarCPF(cpf) {
        return /^\d{11}$/.test(cpf);
    }

    function validarDataNasc(dataNascimento) {
        const regex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!regex.test(dataNascimento)) {
            return false;
        }

        const [dia, mes, ano] = dataNascimento.split("/").map(Number);
        const data = new Date(ano, mes - 1, dia);
    
        return data.getFullYear() === ano && data.getMonth() + 1 === mes && data.getDate() === dia;
    }


    function calcularIdade(dataNascimento) {
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        if (hoje.getMonth() < nascimento.getMonth() || 
           (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        
        return idade;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault(); 

        const nome = document.getElementById("nome").value.trim();
        const dataNascimento = document.getElementById("dataNascimento").value;
        const cpf = document.getElementById("cpf").value.trim();
        const sexo = document.querySelector('input[name="sexo"]:checked')?.value;
        const sintomas = document.getElementById("sintomas").value.trim();
        const diagnostico = document.getElementById("diagnostico").value.trim();

        if (!nome || !dataNascimento || !cpf || !sexo || !sintomas || !diagnostico) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        if (!validarCPF(cpf)) {
            alert("CPF inválido! Certifique-se de que contém apenas 11 números.");
            return;
        }

        if (!validarDataNasc(dataNascimento)){
            alert("Data inválida, digite uma data de até quatro digitos");
            return;
        }

        if (pacientes.some(paciente => paciente.cpf === cpf)) {
            alert("Este CPF já está cadastrado! Verifique a lista de pacientes.");
            return;
        }

        pacientes.push({ nome, dataNascimento, cpf, sexo, sintomas, diagnostico });
        localStorage.setItem("pacientes", JSON.stringify(pacientes));

        form.reset();
        renderizarTabela();
    });

    campoBusca.addEventListener("input", () => {
        termoBusca = campoBusca.value.trim().toLowerCase();
        renderizarTabela();
    });

    function renderizarTabela() {
        listaPacientes.innerHTML = `<h2>Lista de Pacientes</h2>
            <button onclick="limparLista()">🗑 Limpar Lista</button>
            <table border="1">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Idade</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody id="corpoTabela"></tbody>
            </table>`;

        const corpoTabela = document.getElementById("corpoTabela");
        const pacientesFiltrados = pacientes.filter(p => p.nome.toLowerCase().includes(termoBusca));

        if (pacientesFiltrados.length === 0) {
            corpoTabela.innerHTML = `<tr><td colspan="3">Nenhum paciente encontrado.</td></tr>`;
            return;
        }

        pacientesFiltrados.forEach((paciente, index) => {
            const idade = calcularIdade(paciente.dataNascimento);
            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td>${paciente.nome}</td>
                <td>${idade} anos</td>
                <td>
                    <button onclick="verDetalhes(${index})">Ver Detalhes</button>
                    <button onclick="editarPaciente(${index})">Editar</button>
                </td>
            `;

            corpoTabela.appendChild(linha);
        });
    }

    window.verDetalhes = (index) => {
        const paciente = pacientes[index];

        modalInfo.innerHTML = `
            <h2>${paciente.nome}</h2>
            <p><strong>CPF:</strong> ${paciente.cpf}</p>
            <p><strong>Data de Nascimento:</strong> ${paciente.dataNascimento}</p>
            <p><strong>Sexo:</strong> ${paciente.sexo}</p>
            <p><strong>Sintomas:</strong> ${paciente.sintomas}</p>
            <p><strong>Diagnóstico:</strong> ${paciente.diagnostico}</p>
        `;
        modal.style.display = "block";
    };

    closeBtn.onclick = () => { modal.style.display = "none"; };
    window.onclick = (event) => { if (event.target === modal) modal.style.display = "none"; };

    window.limparLista = () => {
        if (confirm("Tem certeza que deseja excluir todos os pacientes?")) {
            pacientes = [];
            localStorage.removeItem("pacientes");
            renderizarTabela();
        }
    };

    document.addEventListener("DOMContentLoaded", renderizarTabela);

    window.editarPaciente = (index) => {
        const paciente = pacientes[index];
        const novoNome = prompt("Novo nome:", paciente.nome);
        const novaDataNascimento = prompt("Nova data de nascimento (AAAA-MM-DD):", paciente.dataNascimento);
        const novoSexo = prompt("Novo sexo (M/F/Outro):", paciente.sexo);
        const novosSintomas = prompt("Novos sintomas:", paciente.sintomas);
        const novoDiagnostico = prompt("Novo diagnóstico:", paciente.diagnostico);
    
        if (novoNome && novaDataNascimento && novoSexo && novosSintomas && novoDiagnostico) {
            pacientes[index] = {
                ...paciente, 
                nome: novoNome,
                dataNascimento: novaDataNascimento,
                sexo: novoSexo,
                sintomas: novosSintomas,
                diagnostico: novoDiagnostico
            };
    
            localStorage.setItem("pacientes", JSON.stringify(pacientes));
    
            renderizarTabela();
            alert("Paciente atualizado com sucesso!");
        } else {
            alert("Edição cancelada ou campos inválidos.");
        }
    };
});