from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/puzzle/<int:puzzle_id>")
def puzzle(puzzle_id):

    image_name = f"puzzle{puzzle_id}.jpg"

    return render_template(
        "puzzle.html",
        image_name=image_name
    )

if __name__ == "__main__":
    app.run(debug=True)