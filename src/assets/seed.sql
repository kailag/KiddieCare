CREATE TABLE IF NOT EXISTS parent(
    parent_id INTEGER PRIMARY KEY AUTOINCREMENT, 
    first_name TEXT NOT NULL, 
    middle_name TEXT NOT NULL, 
    last_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS child(
    child_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL, 
    middle_name TEXT NULL, 
    last_name TEXT NOT NULL, 
    birth_date TEXT NOT NULL, 
    gender TEXT NOT NULL,
    doctor TEXT NULL
);

CREATE TABLE IF NOT EXISTS schedule(
    schedule_id INTEGER PRIMARY KEY AUTOINCREMENT, 
    schedule_date DATETIME NOT NULL, 
    schedule_end DATETIME NOT NULL, 
    schedule_description TEXT NOT NULL, 
    child_id INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS consultation(
    consultation_id INTEGER PRIMARY KEY AUTOINCREMENT, 
    consultation_type TEXT NOT NULL, 
    consultation_prescription TEXT NOT NULL,
    consultation_instructions TEXT NOT NULL, 
    consultation_findings TEXT NOT NULL, 
    consultation_doctor TEXT NOT NULL, 
    consultation_date_of_visit TEXT NOT NULL,     
    consultation_date_of_next_visit TEXT NOT NULL,
    consultation_image_path TEXT NULL,   
    child_id INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS child_schedule(
    child_id INTEGER NOT NULL,
    schedule_id INTEGER NOT NULL
);
