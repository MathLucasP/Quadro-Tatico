<?php
$servername = "localhost"; // Nome do servidor
$username = "root"; // Nome do usuário
$password = ""; // Senha do usuário
$dbname = "site_futebol"; // Nome do banco de dados

// Conecta com o banco de dados "site_futebol"
$conn = new mysqli($servername, $username, $password, $dbname);

//Caso a conexão falhe (Não existe banco de dados "site_futebol")
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}
?>

