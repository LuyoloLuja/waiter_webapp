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
-- inner njoin
-- SELECT waiter_names.waiter_name, days_of_work.day_working FROM working_days INNER JOIN days_of_work ON working_days.days_working  = days_of_work.id INNER JOIN waiter_names ON working_days.waiter_name = waiter_names.id;
SELECT DISTINCT waiter_names.id AS waiter_id, waiter_name, working_days.id AS day_id, day_working FROM working_days JOIN waiter_names ON working_days.waiter_id = waiter_names.id JOIN days_of_work ON working_days.days_working = days_of_work.id;