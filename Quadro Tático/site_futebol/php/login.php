<?php
session_start(); // Inicia a sessão
include 'connect.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    // Verifica se os campos estão presentes
    if (!isset($_POST['username']) || !isset($_POST['password'])) {
        throw new Exception("Preencha todos os campos!");
    }

    // Valida os campos para evitar dados inválidos
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    if (empty($username) || empty($password)) {
        throw new Exception("Preencha todos os campos!");
    }

    // Consulta usando prepared statements para prevenir SQL Injection
    $stmt = $conn->prepare("SELECT id, username, password FROM users WHERE username = ?");
    if (!$stmt) {
        throw new Exception("Erro ao preparar consulta.");
    }

    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        // Verifica a senha diretamente (senhas não hashadas)
        if ($password === $user['password']) { // Comparação simples
            // Salva as informações na sessão
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];

            echo json_encode([
                "status" => "success",
                "redirect" => "quadro-tatico.html" // Indica a URL de redirecionamento
            ]);
        } else {
            throw new Exception("Usuário ou senha incorretos!");
        }
    } else {
        throw new Exception("Usuário ou senha incorretos!");
    }
} catch (Exception $e) {
    // Lida com erros e envia mensagem para o cliente
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
