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

GO
INSERT INTO Images(imageName, imageMIME, imageBin) VALUES ('Missing', 'image/jpeg', 0x00);

GO 
CREATE TABLE People (
	id INT IDENTITY(1,1),
	fname VARCHAR(32) CHECK (len(fname) > 1),
	lname VARCHAR(32) CHECK (len(lname) > 1),
	gender CHAR(1) DEFAULT '-' CHECK (gender in ('M', 'F', '-')),
	dob DATE DEFAULT sysdatetime(),

	CONSTRAINT pk_people PRIMARY KEY (id)
);

GO 
CREATE TABLE Genre(
	id INT IDENTITY(1,1),
	gname VARCHAR(64) NOT NULL,

	CONSTRAINT pk_genre PRIMARY KEY (id)
);

GO 
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

GO 
CREATE TABLE Movie_Genres (
	movie INT,
	genre INT,

	CONSTRAINT pk_movie_genre PRIMARY KEY(movie, genre),
	CONSTRAINT fk_movie_genre_movie FOREIGN KEY (movie) REFERENCES Movies(id),
	CONSTRAINT fk_movie_genre_genre FOREIGN KEY (genre) REFERENCES Genre(id),
);

GO 
CREATE TABLE Actors (
	person INT,
	movie INT,
	appearsAs VARCHAR(64),

	CONSTRAINT pk_actor PRIMARY KEY (person, movie),
	CONSTRAINT fk_actor_person FOREIGN KEY (person) REFERENCES People(id),
	CONSTRAINT fk_actor_movie FOREIGN KEY (movie) REFERENCES Movies(id),
);

-- AUTH
GO 
CREATE TABLE Users(
	id INT IDENTITY(1,1),
	email VARCHAR(32) CHECK (
		email LIKE '%@%.%' AND 
		email NOT LIKE '%@.%' AND
		email NOT LIKE '%@%@%'		
	),
	username VARCHAR(64) CHECK (username is NOT NULL),
	pw VARCHAR(64) NOT NULL,
	isAdmin CHAR(1) DEFAULT 'N' CHECK (isAdmin IN ('Y', 'N')),

	CONSTRAINT pk_user PRIMARY KEY (id)
);

-- REVIEWS

GO 
CREATE TABLE Reviews (
	movie INT,
	id INT,
	rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
	msg VARCHAR(MAX),

	CONSTRAINT pk_review PRIMARY KEY(movie, id),
	CONSTRAINT fk_review_movie FOREIGN KEY(movie) REFERENCES Movies(id),
	CONSTRAINT fk_review_id FOREIGN KEY(id) REFERENCES Users(id)
);