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
    doctor TEXT NULL,
    boosters TEXT NULL
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
    consultation_prescription TEXT NULL,
    consultation_instructions TEXT NULL, 
    consultation_findings TEXT NULL, 
    consultation_doctor TEXT NULL, 
    consultation_date_of_visit TEXT NOT NULL,     
    consultation_date_of_next_visit TEXT NULL,
    consultation_image_file TEXT NULL,   
    child_id INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS child_schedule(
    child_id INTEGER NOT NULL,
    schedule_id INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS booster(
    booster_id INTEGER PRIMARY KEY AUTOINCREMENT,
    booster_name TEXT NOT NULL,
    booster_stat INT NOT NULL,
    booster_type INT NOT NULL
);

INSERT INTO booster(booster_name, booster_stat, booster_type) VALUES ('Hepatitis A', 0, 0);
INSERT INTO booster(booster_name, booster_stat, booster_type) VALUES ('Hepatitis B', 0, 0);
INSERT INTO booster(booster_name, booster_stat, booster_type) VALUES ('Diphtheria, tetanus, and whooping cough (pertussis) (DTaP)', 0, 0);
INSERT INTO booster(booster_name, booster_stat, booster_type) VALUES ('Haemophilus influenzae type b (Hib)', 0, 0);
INSERT INTO booster(booster_name, booster_stat, booster_type) VALUES ('Polio (IPV)', 0, 0);
INSERT INTO booster(booster_name, booster_stat, booster_type) VALUES ('Pneumococcal (PCV)', 0, 0);
INSERT INTO booster(booster_name, booster_stat, booster_type) VALUES ('Rotavirus (RV)', 0, 0);
INSERT INTO booster(booster_name, booster_stat, booster_type) VALUES ('Influenza (flu)', 0, 0);
INSERT INTO booster(booster_name, booster_stat, booster_type) VALUES ('Chickenpox (Varicella)', 0, 0);
INSERT INTO booster(booster_name, booster_stat, booster_type) VALUES ('Measles, mumps and rubella (MMR)', 0, 0);

