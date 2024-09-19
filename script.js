// Inicializar eventos
document.getElementById('iniciar').addEventListener('click', function () {
    const nome = document.getElementById('nome').value.trim(); // Remover espaços em branco

    if (nome) {
        localStorage.setItem('nomeCompleto', nome);  // Armazenar nome no localStorage com a chave "nomeCompleto"
        console.log('Nome salvo no localStorage:', nome); // Verificar se o nome foi salvo

        // Esconder a tela de inserção de nome
        document.getElementById('form-nome').style.display = 'none';

        // Mostrar a tela de presentes
        document.getElementById('tela-presentes').style.display = 'block';
    } else {
        alert('Por favor, insira seu nome completo!');
    }
});

// Armazenar presentes selecionados
let presentesSelecionados = [];

// Adicionar presentes à lista e alterar o botão para "Selecionado"
document.querySelectorAll('.escolher').forEach(button => {
    button.addEventListener('click', function () {
        const presente = this.getAttribute('data-presente');

        // Evitar que o presente seja selecionado mais de uma vez
        if (presentesSelecionados.includes(presente)) {
            alert('Este presente já foi selecionado!');
            return;
        }

        presentesSelecionados.push(presente);
        alert(`${presente} foi adicionado à sua lista!`);
        console.log('Presentes selecionados:', presentesSelecionados); // Verificar presentes

        // Alterar o texto do botão para "Selecionado" e mudar a cor
        this.textContent = 'Selecionado';
        this.classList.add('selecionado');  // Adiciona a classe CSS para mudar o estilo
        this.disabled = true;  // Desabilitar o botão para evitar seleção repetida
    });
});

// Enviar dados para Google Sheets
document.getElementById('enviar').addEventListener('click', function () {
    const nome = localStorage.getItem('nomeCompleto');  // Recuperar nome do localStorage com a chave "nomeCompleto"
    const dataHora = new Date().toLocaleString();  // Data e hora atual

    // Verificação de depuração
    console.log('Nome:', nome);
    console.log('DataHora:', dataHora);
    console.log('Presentes Selecionados:', presentesSelecionados);

    if (!nome || nome === "") {
        alert('Nome não encontrado. Por favor, insira seu nome novamente.');
        return;
    }

    if (presentesSelecionados.length === 0) {
        alert('Por favor, selecione ao menos um presente.');
        return;
    }

    // Dados a serem enviados (campos correspondem exatamente às colunas da planilha)
    const sheetData = {
        "data": [
            {
                "data": dataHora,  // Nome da coluna "data" na planilha
                "nomeCompleto": nome.trim(),  // Nome da coluna "nomeCompleto" na planilha
                "presentes": presentesSelecionados.join(', ')  // Nome da coluna "presentes" na planilha
            }
        ]
    };

    // Verificação de depuração para garantir que os dados estão corretos
    console.log('Dados a serem enviados:', sheetData);

    // Fazer a requisição POST para o SheetDB
    fetch('https://sheetdb.io/api/v1/lilmqffgjyxmh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sheetData),  // Enviar os dados no formato correto
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao criar registro no Google Sheets');
        }
        return response.json();
    })
    .then(data => {
        alert('Lista enviada com sucesso! Obrigado por participar do nosso Chá de Panela!');
        console.log('Sucesso:', data);
        // Limpar lista de presentes selecionados
        presentesSelecionados = [];
    })
    .catch((error) => {
        console.error('Erro:', error);
        alert('Houve um erro ao enviar sua lista. Detalhes do erro: ' + error.message);
    });
});

// Definir o limite de quantidade para cada presente (exemplo: 2 para "Conjunto de Panelas")
const limitesPresentes = {
    "Abridor de garrafas e latas": 1,
    "Açucareiro": 1,
    "Afiador de facas": 1,
    "Air fryer 2 em 1 - 11L (Philco)": 1,
    "Aspirador de pó (Preto)": 1,
    "Assadeiras antiaderentes": 1,
    "Bacia plástica": 1,
    "Balde dobrável (10L)": 1,
    "Bandeja": 1,
    "Batedor de ovos": 1,
    "Bowls": 1,
    "Cesto de lixo p/ banheiro (Inox)": 1,
    "Cobertor": 2,
    "Colheres de silicone": 1,
    "Concha para molho": 1,
    "Concha para sorvete": 1,
    "Conjunto de peneiras": 1,
    "Conjunto de potes herméticos (10 peças)": 1,
    "Conjunto de pratos (rasos, fundos e sobremesa)": 1,
    "Conjunto de tapete p/ cozinha": 3,
    "Copos de medidas": 1,
    "Copos para água (6 copos)": 1,
    "Cuscuzeira": 1,
    "Cutelo": 1,
    "Descanso de panela (4 peças)": 1,
    "Edredom p/ cama casal": 1,
    "Escorredor de macarrão (Inox)": 1,
    "Escorredor de pratos (Inox)": 1,
    "Espátula": 1,
    "Espremedor de alho (Inox)": 1,
    "Espremedor de batatas (Inox)": 1,
    "Espremedor de limão (Inox)": 1,
    "Extrator de escama": 1,
    "Faqueiro (Inox)": 1,
    "Ferro de passar roupa (Black & Deck)": 1,
    "Formas de bolo": 2
};


// Substitua por seu ID da planilha (da URL da planilha) e API key gerada no Google Cloud
const spreadsheetId = '1ybA0mg-t5aC_60pW3JqwQ7bKXK-QKj8rUhwHvg2knpQ';
const apiKey = 'AIzaSyBYSJFlWRuvhdgdSgEeDZyON3zdEUTNfq4';

// Função para buscar os dados da planilha usando a API do Google Sheets
function verificarDisponibilidadePresentesGoogleSheets() {
    const range = 'Sheet1!A:C';  // Defina o intervalo que você quer ler na planilha (por exemplo, A1 até C100)
    
    // URL da API para acessar a planilha
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const rows = data.values;
            if (rows.length) {
                // Mapeamento para contar presentes
                const contagemPresentes = {};

                rows.forEach(row => {
                    const presentesSelecionados = row[2] ? row[2].split(', ') : [];
                    presentesSelecionados.forEach(presente => {
                        if (!contagemPresentes[presente]) {
                            contagemPresentes[presente] = 1;
                        } else {
                            contagemPresentes[presente]++;
                        }
                    });
                });

                // Atualizar a interface com a quantidade e limites dos presentes
                document.querySelectorAll('.escolher').forEach(button => {
                    const presente = button.getAttribute('data-presente');
                    const quantidade = contagemPresentes[presente] || 0;
                    const limite = limitesPresentes[presente];

                    if (quantidade >= limite) {
                        button.textContent = 'Indisponível';
                        button.disabled = true;
                        button.classList.add('indisponivel');
                    } else {
                        button.textContent = 'Escolher';
                        button.disabled = false;
                        button.classList.remove('indisponivel');
                    }
                });
            }
        })
        .catch(error => {
            console.error('Erro ao acessar a planilha do Google Sheets:', error);
        });
}

// Função para verificar a disponibilidade dos presentes ao carregar a página
window.addEventListener('load', verificarDisponibilidadePresentesGoogleSheets);

// Verificar disponibilidade após selecionar um presente
document.querySelectorAll('.escolher').forEach(button => {
    button.addEventListener('click', verificarDisponibilidadePresentesGoogleSheets);
});


