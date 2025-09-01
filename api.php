<?php
// api.php — basic PHP API for Storyboard App

// ===== CONFIG =====
$host = "localhost";      // or Hostinger DB host later
$db   = "storyboarder_db";  // change to your actual DB name
$user = "root";           // your MySQL username
$pass = "";               // your MySQL password (empty if none)

// ===== CONNECT =====
header("Content-Type: application/json");
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "DB connection failed"]);
    exit;
}

// ===== ROUTING =====
$method = $_SERVER['REQUEST_METHOD'];
$path   = $_GET['path'] ?? '';

switch ($path) {
    case "boards":
        if ($method === "GET") {
            // fetch all boards
            $sql = "SELECT * FROM boards";
            $result = $conn->query($sql);
            $boards = [];
            while ($row = $result->fetch_assoc()) {
                $boards[] = $row;
            }
            echo json_encode($boards);
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(["error" => "Invalid endpoint"]);
}
$conn->close();
