from flask import Flask, render_template

app = Flask(__name__)

import os
import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "leaderboard.db")
from flask import Flask, render_template, request, jsonify

images_folder = os.path.join(app.static_folder, "images")

image_files = sorted([
    file for file in os.listdir(images_folder)
    if file.lower().endswith((".jpg", ".jpeg", ".png"))
])

PUZZLES = [
    {
        "id": index + 1,
        "image": image
    }
    for index, image in enumerate(image_files)
]

@app.route("/")
def home():

    import os

    print("Current working directory:", os.getcwd())
    print("Database path:", os.path.abspath("leaderboard.db"))

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT player_name, time, moves
        FROM leaderboard
        ORDER BY time ASC, moves ASC
        LIMIT 10
    """)

    leaderboard = cursor.fetchall()
    print(leaderboard)

    conn.close()

    return render_template(
        "index.html",
        puzzles=PUZZLES,
        leaderboard=leaderboard
    )

@app.route("/puzzle/<int:puzzle_id>")
def puzzle(puzzle_id):

    if puzzle_id < 1 or puzzle_id > len(PUZZLES):
        return "Puzzle not found", 404

    image_name = PUZZLES[puzzle_id - 1]["image"]

    return render_template(
        "puzzle.html",
        image_name=image_name
    )

@app.route("/save-score", methods=["POST"])
def save_score():

    data = request.get_json()

    conn = sqlite3.connect("leaderboard.db")

    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO leaderboard
        (player_name, puzzle, time, moves)
        VALUES (?, ?, ?, ?)
    """, (
        data["player_name"],
        data["puzzle"],
        data["time"],
        data["moves"]
    ))

    conn.commit()
    conn.close()

    return jsonify({"success": True})

if __name__ == "__main__":
    app.run(debug=True)