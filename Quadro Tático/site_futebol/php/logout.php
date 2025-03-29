<?php
session_start();

if (isset($_SESSION['user_id'])) {
    session_unset(); // Limpa todas as variáveis de sessão
    session_destroy(); // Destroi a sessão
    header("Location: /site_futebol/index.html?logout=success"); // Redireciona para a página inicial com mensagem de sucesso
    exit;
} else {
    // Caso não haja uma sessão ativa
    header("Location: /site_futebol/index.html"); // Redireciona para a página inicial
    exit;
}
?>
