from flask import Flask, render_template

app = Flask(__name__)

import os

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
    return render_template(
        "index.html",
        puzzles=PUZZLES
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

if __name__ == "__main__":
    app.run(debug=True)