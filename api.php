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
// ---------- Fetch single board ----------
if ($path === "board" && isset($_GET["id"])) {
  $boardId = $conn->real_escape_string($_GET["id"]);

  $boardRes = $conn->query("SELECT * FROM boards WHERE id='$boardId'");
  if (!$boardRes || $boardRes->num_rows === 0) {
    echo json_encode(["error" => "Board not found"]);
    exit;
  }
  $board = $boardRes->fetch_assoc();

  // Fetch headers
  $colsRes = $conn->query("SELECT * FROM columns WHERE board_id='$boardId' ORDER BY position ASC");
  $columns = [];
  while ($col = $colsRes->fetch_assoc()) {
    $colId = $col["id"];
    // Fetch subbers
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
// ---------- Save board (with 7×7 seeding) ----------
if ($path === "saveBoard" && $_SERVER["REQUEST_METHOD"] === "POST") {
  $data = json_decode(file_get_contents("php://input"), true);

  // Safe ID assignment
  $boardId = isset($data["id"]) && $data["id"] !== ""
               ? $conn->real_escape_string($data["id"])
               : uniqid("board_");

  $title       = $conn->real_escape_string($data["title"] ?? "Untitled");
  $description = $conn->real_escape_string($data["description"] ?? "");
  $parentId    = isset($data["parent_id"])
                   ? "'".$conn->real_escape_string($data["parent_id"])."'"
                   : "NULL";

  // Save board
  $conn->query("
    INSERT INTO boards (id, title, description, parent_id)
    VALUES ('$boardId', '$title', '$description', $parentId)
    ON DUPLICATE KEY UPDATE 
      title='$title',
      description='$description',
      parent_id=$parentId
  ");

  // Ensure board always has 7 headers × 7 subbers
  for ($i = 1; $i <= 7; $i++) {
    $colId = "col-$boardId-$i";

    // Insert header if missing
    $colCheck = $conn->query("SELECT COUNT(*) as cnt FROM columns WHERE id='$colId'");
    $existsCol = $colCheck ? (int)$colCheck->fetch_assoc()["cnt"] : 0;
    if ($existsCol === 0) {
      $colTitle = "Header $i";
      $conn->query("
        INSERT INTO columns (id, board_id, title, description, position)
        VALUES ('$colId', '$boardId', '$colTitle', '', $i)
      ");
    }

    // Ensure subbers
    for ($j = 1; $j <= 7; $j++) {
      $cardId = "card-$boardId-$i-$j";
      $cardCheck = $conn->query("SELECT COUNT(*) as cnt FROM cards WHERE id='$cardId'");
      $existsCard = $cardCheck ? (int)$cardCheck->fetch_assoc()["cnt"] : 0;
      if ($existsCard === 0) {
        $conn->query("
          INSERT INTO cards (id, column_id, title, description, position)
          VALUES ('$cardId', '$colId', '', '', $j)
        ");
      }
    }
  }

  // Save edits from payload
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
// ---------- Delete board (cascade) ----------
if ($path === "deleteBoard" && isset($_GET["id"])) {
  $boardId = $conn->real_escape_string($_GET["id"]);

  // Delete subbers
  $conn->query("
    DELETE c FROM cards c
    INNER JOIN columns col ON c.column_id = col.id
    WHERE col.board_id = '$boardId'
  ");

  // Delete headers
  $conn->query("DELETE FROM columns WHERE board_id='$boardId'");

  // Delete board
  $conn->query("DELETE FROM boards WHERE id='$boardId'");

  echo json_encode(["success" => true]);
  exit;
}

//
// ---------- List all boards ----------
if ($path === "boards") {
  $res = $conn->query("SELECT * FROM boards ORDER BY title ASC");
  $boards = [];
  while ($row = $res->fetch_assoc()) {
    $boards[] = $row;
  }
  echo json_encode($boards);
  exit;
}

//
// ---------- Fallback ----------
echo json_encode(["error" => "Unknown path"]);
$conn->close();
