// Armazenar presentes selecionados
let presentesSelecionados = [];

// Inicializar o evento ao clicar no botão "iniciar"
document.getElementById('iniciar').addEventListener('click', function () {
    const nome = document.getElementById('nome').value.trim(); // Remover espaços em branco
    
    if (nome) {
        localStorage.setItem('nome', nome);  // Armazenar nome no localStorage
        
        // Esconder a tela de inserção de nome
        document.getElementById('form-nome').style.display = 'none';
        
        // Mostrar a tela de presentes
        document.getElementById('tela-presentes').style.display = 'block';
    } else {
        alert('Por favor, insira seu nome completo!');
    }
});

// Adicionar presentes à lista
document.querySelectorAll('.escolher').forEach(button => {
    button.addEventListener('click', function () {
        const presente = this.getAttribute('data-presente');
        presentesSelecionados.push(presente);
        alert(`${presente} foi adicionado à sua lista!`);
    });
});

// Enviar dados para o Google Sheets via SheetDB
document.getElementById('enviar').addEventListener('click', function () {
    const nome = localStorage.getItem('nome');  // Recuperar nome do localStorage
    const data = new Date().toLocaleString();

    if (!nome) {
        alert('Nome não encontrado. Por favor, insira seu nome novamente.');
        document.getElementById('form-nome').style.display = 'block';
        document.getElementById('tela-presentes').style.display = 'none';
        return;
    }

    if (presentesSelecionados.length === 0) {
        alert('Por favor, selecione ao menos um presente.');
        return;
    }

    // Formatar os dados corretamente
    const sheetData = [
        {
            "nome": nome,  // Certificar que o nome está correto
            "data": data,
            "presentes": presentesSelecionados.join(', ')
        }
    ];

    // Fazer a requisição POST para o SheetDB
    fetch('https://sheetdb.io/api/v1/lilmqffgjyxmh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sheetData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao criar registro no Google Sheets');
        }
        return response.json();
    })
    .then(data => {
        alert('Lista enviada com sucesso! Obrigado por participar do nosso Chá de Panela!');
        console.log('Success:', data);
        // Limpar lista de presentes selecionados
        presentesSelecionados = [];
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Houve um erro ao enviar sua lista. Detalhes do erro: ' + error.message);
    });
});
