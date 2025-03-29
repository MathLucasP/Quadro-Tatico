<?php
session_start(); // Inicia a sessão
include 'connect.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    // Verifica se os campos estão presentes
    if (!isset($_POST['username']) || !isset($_POST['password']) || !isset($_POST['termsCheckbox'])) {
        throw new Exception("Preencha todos os campos e aceite os Termos de Uso!");
    }

    // Valida os campos para evitar dados inválidos
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);
    $termsAccepted = $_POST['termsCheckbox']; // Checa se o checkbox foi enviado

    if (empty($username) || empty($password)) {
        throw new Exception("Preencha todos os campos!");
    }

    if ($termsAccepted !== 'on') { // Verifica se o checkbox está marcado
        throw new Exception("Você deve aceitar os Termos de Uso para se cadastrar.");
    }

    // Funções de validação
    function validateUsername($username) {
        if (!preg_match('/[A-Z]/', $username)) {
            return "O nome de usuário deve conter pelo menos uma letra maiúscula.";
        }
        if (!preg_match('/[-_.]/', $username)) {
            return "O nome de usuário deve conter pelo menos um caractere especial (-, _, ou .).";
        }
        if (strlen($username) < 6 || strlen($username) > 16) {
            return "O nome de usuário deve ter entre 6 e 16 caracteres.";
        }
        return null;
    }

    function validatePassword($password) {
        if (!preg_match('/[A-Z]/', $password)) {
            return "A senha deve conter pelo menos uma letra maiúscula.";
        }
        if (!preg_match('/[-_.]/', $password)) {
            return "A senha deve conter pelo menos um caractere especial (-, _, ou .).";
        }
        if (strlen($password) < 6 || strlen($password) > 16) {
            return "A senha deve ter entre 6 e 16 caracteres.";
        }
        return null;
    }

    // Validação do usuário e senha
    $usernameError = validateUsername($username);
    $passwordError = validatePassword($password);

    if ($usernameError) {
        throw new Exception($usernameError);
    }
    if ($passwordError) {
        throw new Exception($passwordError);
    }

    // Verifica se o nome de usuário já existe
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
    if (!$stmt) {
        throw new Exception("Erro ao preparar consulta.");
    }
    
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        throw new Exception("O nome de usuário já está em uso.");
    }

    // Insere o novo usuário
    $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    if (!$stmt) {
        throw new Exception("Erro ao preparar consulta de inserção.");
    }

    $stmt->bind_param("ss", $username, $password);
    if ($stmt->execute()) {
        echo json_encode([
            "status" => "success",
            "message" => "Cadastro realizado com sucesso! Faça login."
        ]);
    } else {
        throw new Exception("Erro ao cadastrar o usuário.");
    }
} catch (Exception $e) {
    // Lidar com erros e enviar mensagem para o cliente
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
} finally {
    // Fecha os recursos e a conexão
    if (isset($stmt)) {
        $stmt->close();
    }
    $conn->close();
}
?>
