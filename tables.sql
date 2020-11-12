CREATE TABLE waiter_names (
    id SERIAL NOT NULL PRIMARY KEY,
    waiter_name TEXT NOT NULL
);

CREATE TABLE waiter_days (
    id SERIAL NOT NULL PRIMARY KEY,
    day_working TEXT NOT NULL
);
INSERT INTO waiter_days (day_working) VALUES ("Monday");
INSERT INTO waiter_days (day_working) VALUES ("Tuesday");
INSERT INTO waiter_days (day_working) VALUES ("Wednesday");
INSERT INTO waiter_days (day_working) VALUES ("Thursday");
INSERT INTO waiter_days (day_working) VALUES ("Friday");
INSERT INTO waiter_days (day_working) VALUES ("Saturday");
INSERT INTO waiter_days (day_working) VALUES ("Sunday");

CREATE TABLE working_days (
    id SERIAL NOT NULL PRIMARY KEY,
    shift TEXT NOT NULL,
    waiter_name INT NOT NULL,
    FOREIGN KEY (waiter_name) REFERENCES waiter_names(id),
    days_working INT NOT NULL,
    FOREIGN KEY (days_working) REFERENCES waiter_days(id)
);