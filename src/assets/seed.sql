CREATE TABLE IF NOT EXISTS parent(parent_id INTEGER PRIMARY KEY AUTOINCREMENT, first_name TEXT NOT NULL, middle_name TEXT NOT NULL, last_name TEXT NOT NULL, passcode TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS child(child_id INTEGER PRIMARY KEY AUTOINCREMENT,first_name TEXT NOT NULL, middle_name TEXT NOT NULL, last_name TEXT NOT NULL, birth_date TEXT NOT NULL);
INSERT INTO child(first_name, last_name, middle_name, birth_date) VALUES ('Test', 'Baby', 'Boy', '2019-12-10');
INSERT INTO child(first_name, last_name, middle_name, birth_date) VALUES ('Test', 'Baby', 'Girl', '2019-12-01');
INSERT INTO child(first_name, last_name, middle_name, birth_date) VALUES ('Test', 'Baby', 'Bi', '2019-12-03');

CREATE TABLE IF NOT EXISTS schedule(schedule_id INTEGER PRIMARY KEY AUTOINCREMENT,schedule_date DATETIME NOT NULL);

CREATE TABLE IF NOT EXISTS consultation(consultation_id INTEGER PRIMARY KEY AUTOINCREMENT, consultation_type TEXT NOT NULL, consultation_description TEXT NOT NULL, consultation_date DATETIME NOT NULL, consultation_location TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS child_schedule(child_id INTEGER NOT NULL,schedule_id INTEGER NOT NULL);

CREATE TABLE IF NOT EXISTS child_consultation(child_id INTEGER NOT NULL,consultation_id INTEGER NOT NULL);
