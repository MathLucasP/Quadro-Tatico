document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const unifiedModal = document.getElementById('unifiedModal');
    const closeModalButton = document.getElementById('closeModal');
    const switchToLogin = document.getElementById('switchToLogin');
    const switchToRegister = document.getElementById('switchToRegister');
    const registerForm = document.getElementById('registerFormElement');
    const loginForm = document.getElementById('loginFormElement');
    const loginErrorDiv = document.getElementById('loginError');
    const registerErrorDiv = document.getElementById('registerError');
    const profileIcon = document.getElementById('profileIcon'); // Ícone para abrir o modal

    // Funções auxiliares
    const showModal = () => {
        unifiedModal.style.display = 'flex';
        unifiedModal.classList.add('show');
    };

    const hideModal = () => {
        unifiedModal.classList.remove('show');
        setTimeout(() => unifiedModal.style.display = 'none', 300);
    };

    const showError = (errorDiv, message) => {
        errorDiv.innerText = message;
        errorDiv.style.display = 'block';
    };

    const clearErrors = () => {
        loginErrorDiv.style.display = 'none';
        registerErrorDiv.style.display = 'none';
    };

    // Abrir o modal ao clicar no ícone do perfil
    if (profileIcon) {
        profileIcon.onclick = () => showModal();
    }

    // Fechar o modal ao clicar no botão de fechar
    closeModalButton.onclick = () => hideModal();

    // Alternar entre login e registro
    switchToLogin.onclick = () => {
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
        clearErrors();
    };

    switchToRegister.onclick = () => {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
        clearErrors();
    };

    // Fechar modal ao clicar fora dele
    window.onclick = (event) => {
        if (event.target === unifiedModal) {
            hideModal();
        }
    };

    // Validação e envio do formulário de registro
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        registerErrorDiv.style.display = 'none';

        const formData = new FormData(registerForm);

        try {
            const response = await fetch('php/register.php', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();

            if (result.status === 'success') {
                alert('Cadastro realizado com sucesso! Faça login.');
                switchToLogin.click(); // Troca para o formulário de login
            } else {
                showError(registerErrorDiv, result.message);
            }
        } catch (error) {
            showError(registerErrorDiv, 'Erro ao conectar ao servidor.');
        }
    });

    // Validação e envio do formulário de login
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        loginErrorDiv.style.display = 'none';

        const formData = new FormData(loginForm);

        try {
            const response = await fetch('php/login.php', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();

            if (result.status === 'success') {
                window.location.href = 'quadro-tatico.html'; // Redireciona ao sucesso
            } else {
                showError(loginErrorDiv, result.message);
            }
        } catch (error) {
            showError(loginErrorDiv, 'Erro ao conectar ao servidor.');
        }
    });
});


// Seleciona todos os itens do menu lateral com a classe 'item-menu'
var menuItem = document.querySelectorAll('.item-menu');

// Função para ativar um link do menu quando selecionado
function selectLink() {
    // Remove a classe 'ativo' de todos os itens do menu
    menuItem.forEach((item) => item.classList.remove('ativo'));

    // Adiciona a classe 'ativo' ao item que foi clicado
    this.classList.add('ativo');
}


// Adiciona um evento de clique a cada item do menu para executar a função selectLink
menuItem.forEach((item) =>
    item.addEventListener('click', selectLink)
);

// Seleciona o botão de expandir/recolher o menu lateral pelo ID 'btn-exp'
var btnExp = document.querySelector('#btn-exp');

// Seleciona o menu lateral pela classe 'menu-lateral'
var menuSide = document.querySelector('.menu-lateral');


// Adiciona um evento de clique ao botão de expandir/recolher o menu lateral
btnExp.addEventListener('click', function() {
    // Alterna a classe 'expandir' no menu lateral para expandi-lo ou recolhê-lo
    menuSide.classList.toggle('expandir');

    // Verifica se o menu está expandido
    if (menuSide.classList.contains('expandir')) {
        // Se o menu estiver expandido, permite rolagem interna
        menuSide.style.overflow = 'auto';
    } else {
        // Se o menu estiver recolhido, desativa a rolagem interna
        menuSide.style.overflow = 'hidden';
    }

    // Alterna a classe 'open' no elemento com ID 'toolbar'
    // Mostra ou esconde a seleção de jogadores
    document.getElementById('toolbar').classList.toggle('open');
});
