CREATE TABLE IF NOT EXISTS parent(parent_id INTEGER PRIMARY KEY AUTOINCREMENT, first_name TEXT NOT NULL, middle_name TEXT NOT NULL, last_name TEXT NOT NULL);
INSERT INTO parent(first_name, middle_name, last_name) VALUES ('Mylene', 'Kismod', 'Natividad');

CREATE TABLE IF NOT EXISTS child(child_id INTEGER PRIMARY KEY AUTOINCREMENT,first_name TEXT NOT NULL, middle_name TEXT NOT NULL, last_name TEXT NOT NULL, birth_date TEXT NOT NULL);
INSERT INTO child(first_name, last_name, middle_name, birth_date) VALUES ('Leah', 'Kismod', 'Natividad', '2015-12-03');

CREATE TABLE IF NOT EXISTS schedule(schedule_id INTEGER PRIMARY KEY AUTOINCREMENT, schedule_date DATETIME NOT NULL, schedule_end DATETIME NOT NULL, schedule_description TEXT NOT NULL, child_id INTEGER NOT NULL);

CREATE TABLE IF NOT EXISTS consultation(consultation_id INTEGER PRIMARY KEY AUTOINCREMENT, consultation_type TEXT NOT NULL, consultation_description TEXT NOT NULL, consultation_date TEXT NOT NULL, consultation_doctor TEXT NOT NULL, child_id INTEGER NOT NULL);
INSERT INTO consultation(consultation_type, consultation_description, consultation_date, consultation_doctor, child_id) VALUES ('Type', 'Description', 'Date', 'Doctor', 1);

CREATE TABLE IF NOT EXISTS child_schedule(child_id INTEGER NOT NULL,schedule_id INTEGER NOT NULL);
