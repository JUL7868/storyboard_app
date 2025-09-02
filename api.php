<?php
// api.php – Storyboarder backend
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username   = "root";
$password   = "";
$dbname     = "storyboarder_db";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["error" => "DB connection failed"]);
  exit;
}

$path = $_GET["path"] ?? "";

//
// ---------- Fetch single Title ----------
if ($path === "board" && isset($_GET["id"])) {
  $boardId = $conn->real_escape_string($_GET["id"]);

  $boardRes = $conn->query("SELECT * FROM boards WHERE id='$boardId'");
  if (!$boardRes || $boardRes->num_rows === 0) {
    echo json_encode(["error" => "Board not found"]);
    exit;
  }
  $board = $boardRes->fetch_assoc();

  // Fetch Headers
  $colsRes = $conn->query("SELECT * FROM columns WHERE board_id='$boardId' ORDER BY position ASC");
  $columns = [];
  while ($col = $colsRes->fetch_assoc()) {
    $colId = $col["id"];
    // Fetch Subbers for this Header
    $cardsRes = $conn->query("SELECT * FROM cards WHERE column_id='$colId' ORDER BY position ASC");
    $cards = [];
    while ($card = $cardsRes->fetch_assoc()) {
      $cards[] = $card;
    }
    $col["cards"] = $cards;
    $columns[] = $col;
  }
  $board["columns"] = $columns;

  echo json_encode($board);
  exit;
}

//
// ---------- Save Title (with Headers + Subbers) ----------
if ($path === "saveBoard" && $_SERVER["REQUEST_METHOD"] === "POST") {
  $data = json_decode(file_get_contents("php://input"), true);

  // Debug: log payload
  error_log("SAVE BOARD PAYLOAD:\n" . print_r($data, true));

  $boardId     = $conn->real_escape_string($data["id"] ?? uniqid("board_"));
  $title       = $conn->real_escape_string($data["title"] ?? "Untitled");
  $description = $conn->real_escape_string($data["description"] ?? "");
  $parentId    = isset($data["parent_id"])
                   ? "'".$conn->real_escape_string($data["parent_id"])."'"
                   : "NULL";

  // Save Title
  $conn->query("
    INSERT INTO boards (id, title, description, parent_id)
    VALUES ('$boardId', '$title', '$description', $parentId)
    ON DUPLICATE KEY UPDATE 
      title='$title',
      description='$description',
      parent_id=$parentId
  ");

  // Save Headers
  if (!empty($data["columns"])) {
    foreach ($data["columns"] as $colIndex => $col) {
      $colId    = $conn->real_escape_string($col["id"]);
      $colTitle = $conn->real_escape_string($col["title"] ?? "Untitled");
      $colDesc  = $conn->real_escape_string($col["description"] ?? "");

      $conn->query("
        INSERT INTO columns (id, board_id, title, description, position)
        VALUES ('$colId', '$boardId', '$colTitle', '$colDesc', $colIndex)
        ON DUPLICATE KEY UPDATE 
          title='$colTitle',
          description='$colDesc',
          position=$colIndex,
          board_id='$boardId'
      ");

      // Save Subbers
      if (!empty($col["cards"])) {
        foreach ($col["cards"] as $cardIndex => $card) {
          $cardId    = $conn->real_escape_string($card["id"]);
          $cardTitle = $conn->real_escape_string($card["title"] ?? "");
          $cardDesc  = $conn->real_escape_string($card["description"] ?? "");

          $conn->query("
            INSERT INTO cards (id, column_id, title, description, position)
            VALUES ('$cardId', '$colId', '$cardTitle', '$cardDesc', $cardIndex)
            ON DUPLICATE KEY UPDATE 
              title='$cardTitle',
              description='$cardDesc',
              position=$cardIndex,
              column_id='$colId'
          ");
        }
      }
    }
  }

  echo json_encode(["success" => true, "id" => $boardId]);
  exit;
}

//
// ---------- List all Titles ----------
if ($path === "boards") {
  $res = $conn->query("SELECT * FROM boards ORDER BY title ASC");
  $boards = [];
  while ($row = $res->fetch_assoc()) {
    $boards[] = $row;
  }
  echo json_encode($boards);
  exit;
}

echo json_encode(["error" => "Unknown path"]);
$conn->close();
