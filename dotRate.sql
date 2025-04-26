CREATE DATABASE dotRate;
GO
USE dotRate;
GO

-- CORE

CREATE TABLE Images (
	id INT IDENTITY(0,1),
	imageName VARCHAR(32) NOT NULL,
	imageMIME VARCHAR(32) NOT NULL,
	imageBin VARBINARY(MAX) NOT NULL,
	uploadedAt DATETIME DEFAULT GETDATE(), 

	CONSTRAINT pk_images PRIMARY KEY (id)
);

INSERT INTO Images(imageName, imageMIME, imageBin) VALUES ('Missing', 'image/jpeg', 0x00);

CREATE TABLE People (
	id INT IDENTITY(1,1),
	fname VARCHAR(32) CHECK (len(fname) > 1),
	lname VARCHAR(32) CHECK (len(lname) > 1),
	gender CHAR(1) DEFAULT '-' CHECK (gender in ('M', 'F', '-')),
	dob DATE DEFAULT sysdatetime(),

	CONSTRAINT pk_people PRIMARY KEY (id)
);

CREATE TABLE Genre(
	id INT IDENTITY(1,1),
	gname VARCHAR(64) NOT NULL,

	CONSTRAINT pk_genre PRIMARY KEY (id)
);

CREATE TABLE Movies (
	id int IDENTITY(1,1),
	title varchar(64) NOT NULL,
	director int,
	releasedOn date,
	synopsis text,
	coverArt int DEFAULT 0,

	CONSTRAINT pk_movie PRIMARY KEY (id),
	CONSTRAINT fk_movie_director FOREIGN KEY (director) REFERENCES People(id),
	CONSTRAINT fk_movie_image FOREIGN KEY (coverArt) REFERENCES Images(id)
);

CREATE TABLE Movie_Genres (
	movie INT,
	genre INT,

	CONSTRAINT pk_movie_genre PRIMARY KEY(movie, genre),
	CONSTRAINT fk_movie_genre_movie FOREIGN KEY (movie) REFERENCES Movies(id),
	CONSTRAINT fk_movie_genre_genre FOREIGN KEY (genre) REFERENCES Genre(id),
);

CREATE TABLE Actors (
	person INT,
	movie INT,
	appearsAs VARCHAR(64),

	CONSTRAINT pk_actor PRIMARY KEY (person, movie),
	CONSTRAINT fk_actor_person FOREIGN KEY (person) REFERENCES People(id),
	CONSTRAINT fk_actor_movie FOREIGN KEY (movie) REFERENCES Movies(id),
);

-- AUTH

CREATE TABLE Users(
	id INT IDENTITY(1,1),
	email VARCHAR(32) CHECK (
		email LIKE '%@%.%' AND 
		email NOT LIKE '%@.%' AND
		email NOT LIKE '%@%@%'		
	),
	pw VARCHAR(64) NOT NULL,
	isAdmin CHAR(1) DEFAULT 'N' CHECK (isAdmin IN ('Y', 'N')),

	CONSTRAINT pk_user PRIMARY KEY (id)
);

-- REVIEWS

CREATE TABLE Reviews (
	movie INT,
	id INT,
	rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),

	CONSTRAINT pk_review PRIMARY KEY(movie, id),
	CONSTRAINT fk_review_movie FOREIGN KEY(movie) REFERENCES Movies(id),
	CONSTRAINT fk_review_id FOREIGN KEY(id) REFERENCES Users(id)
);


-- !! MOCK DATA

-- PEOPLE
INSERT INTO People (fname, lname, gender, dob) VALUES
('John', 'Doe', 'M', '1980-05-12'),
('Jane', 'Smith', 'F', '1990-08-23'),
('Alan', 'Smithee', '-', '1975-03-15'),
('Emily', 'Stone', 'F', '1985-06-17'),
('Robert', 'Lang', 'M', '1978-02-25');

-- GENRES
INSERT INTO Genre (gname) VALUES
('Action'),
('Sci-Fi'),
('Drama'),
('Thriller'),
('Horror'),
('Comedy'),
('Romance'),
('Fantasy');

-- MOVIES
INSERT INTO Movies (title, director, releasedOn, synopsis) VALUES
('Explosive Escape', 1, '2020-07-04', 'An action-packed thriller.'),
('Galaxy Bound', 2, '2022-11-12', 'A sci-fi space adventure.'),
('Quiet Storm', 3, '2019-01-22', 'A subtle drama about life.'),
('Haunted Echoes', 4, '2021-10-30', 'A chilling horror tale.'),
('Love & Lattes', 5, '2023-02-14', 'A romantic comedy.'),
('Chrono Knights', 1, '2024-03-01', 'Fantasy warriors through time.');


-- MOVIE_GENRES
INSERT INTO Movie_Genres (movie, genre) VALUES
(1, 1), -- Action
(1, 4), -- Thriller
(2, 2), -- Sci-Fi
(2, 8), -- Fantasy
(3, 3), -- Drama
(4, 5), -- Horror
(5, 7), -- Romance
(5, 6), -- Comedy
(6, 8), -- Fantasy
(6, 1); -- Action

-- ACTORS
INSERT INTO Actors (person, movie, appearsAs) VALUES
(1, 1, 'Agent Blaze'),
(2, 1, 'Captain Heat'),
(2, 2, 'Zara Flux'),
(3, 3, 'Mr. Grey'),
(4, 4, 'Emily Wraith'),
(5, 5, 'Ryan Latte'),
(4, 5, 'Ella Heart'),
(1, 6, 'Sir Chronos'),
(3, 6, 'The Oracle');


-- USERS
INSERT INTO Users (email, pw, isAdmin) VALUES
('user1@example.com', 'hashed_pw_1', 'N'),
('admin@example.com', 'hashed_pw_2', 'Y'),
('critic@example.com', 'hashed_pw_3', 'N'),
('viewer@example.com', 'hashed_pw_4', 'N'),
('reviewer@example.com', 'hashed_pw_5', 'N');

-- REVIEWS
INSERT INTO Reviews (movie, id, rating) VALUES
(1, 1, 4),
(1, 2, 5),
(1, 3, 3),
(2, 3, 4),
(2, 4, 5),
(3, 1, 4),
(4, 2, 3),
(5, 5, 5),
(5, 3, 4),
(6, 4, 5),
(6, 1, 5);