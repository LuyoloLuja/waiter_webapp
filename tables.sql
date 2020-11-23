CREATE TABLE waiter_names (
    id SERIAL NOT NULL PRIMARY KEY,
    waiter_name TEXT NOT NULL
);

CREATE TABLE days_of_work (
    id SERIAL NOT NULL PRIMARY KEY,
    day_working TEXT NOT NULL
);
INSERT INTO days_of_work (day_working) VALUES ('Monday');
INSERT INTO days_of_work (day_working) VALUES ('Tuesday');
INSERT INTO days_of_work (day_working) VALUES ('Wednesday');
INSERT INTO days_of_work (day_working) VALUES ('Thursday');
INSERT INTO days_of_work (day_working) VALUES ('Friday');
INSERT INTO days_of_work (day_working) VALUES ('Saturday');
INSERT INTO days_of_work (day_working) VALUES ('Sunday');

CREATE TABLE working_days (
    id SERIAL NOT NULL PRIMARY KEY,
    waiter_id INT NOT NULL,
    FOREIGN KEY (waiter_id) REFERENCES waiter_names(id),
    days_working INT,
    FOREIGN KEY (days_working) REFERENCES days_of_work(id)
);