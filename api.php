<?php
// ==== CORS headers ====
$allowed_origin = "http://localhost:3005";  // React dev server origin
header("Access-Control-Allow-Origin: $allowed_origin");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}




// ==== CONFIG ====
$host = "localhost";
$db   = "storyboarder_db";
$user = "root";
$pass = "";

// ==== CONNECT ====
header("Content-Type: application/json");
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "DB connection failed"]);
    exit;
}

// ==== ROUTER ====
$path = $_GET['path'] ?? '';

/**
 * Get list of boards (id + title only)
 */
if ($path === 'boards') {
    $sql = "SELECT id, title, parent_id FROM boards";
    $result = $conn->query($sql);

    $boards = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $boards[] = $row;
        }
    }

    echo json_encode($boards);
    exit;
}

/**
 * Get a single board (id, title, description + scaffold columns/cards)
 */
if ($path === 'board' && isset($_GET['id'])) {
    $id = $conn->real_escape_string($_GET['id']);
    $sql = "SELECT id, title, description FROM boards WHERE id='$id'";
    $result = $conn->query($sql);

    if ($row = $result->fetch_assoc()) {
        // Build 7x7 scaffold
        $columnTitles = [
            "Setup", "Conflict", "Rising Action", "Climax",
            "Falling Action", "Resolution", "Epilogue"
        ];

        $columns = [];
        foreach ($columnTitles as $i => $title) {
            $cards = [];
            for ($j = 1; $j <= 7; $j++) {
                $cards[] = [
                    "id" => "col-".($i+1)."-card".$j,
                    "title" => "",
                    "description" => "",
                    "children" => []
                ];
            }

            $columns[] = [
                "id" => "column-".($i+1),
                "title" => $title,
                "description" => "",
                "cards" => $cards
            ];
        }

        $row['columns'] = $columns;
        echo json_encode($row);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Board not found"]);
    }
    exit;
}

/**
 * Save or update a board (+ its columns/cards)
 */
if ($path === 'saveBoard' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || !isset($data['title'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Invalid board data"]);
        exit;
    }

    try {
        $id = isset($data['id']) && $data['id'] !== ''
            ? $conn->real_escape_string($data['id'])
            : uniqid("board-");

        $title = $conn->real_escape_string($data['title']);
        $description = $conn->real_escape_string($data['description'] ?? '');

        $sql = "INSERT INTO boards (id, title, description)
                VALUES ('$id', '$title', '$description')
                ON DUPLICATE KEY UPDATE title='$title', description='$description'";
        $conn->query($sql);

        echo json_encode(["success" => true, "id" => $id]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
    exit;   // ✅ last line
}           // ✅ closes the if


    // ==== DEFAULT ====
    http_response_code(404);
    echo json_encode(["error" => "Unknown path"]);
