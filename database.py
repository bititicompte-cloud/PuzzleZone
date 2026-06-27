import sqlite3

conn = sqlite3.connect("leaderboard.db")

cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS leaderboard (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    player_name TEXT NOT NULL,

    puzzle INTEGER NOT NULL,

    time INTEGER NOT NULL,

    moves INTEGER NOT NULL

)
""")

conn.commit()

conn.close()

print("Database created successfully!")