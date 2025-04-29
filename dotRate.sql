USE master;
GO
--DROP DATABASE dotRate;
GO
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
	msg VARCHAR(MAX),

	CONSTRAINT pk_review PRIMARY KEY(movie, id),
	CONSTRAINT fk_review_movie FOREIGN KEY(movie) REFERENCES Movies(id),
	CONSTRAINT fk_review_id FOREIGN KEY(id) REFERENCES Users(id)
);



GO

-- ----------------------------

-- Inserts a new person into the People table
-- Parameters: fname, lname (required), gender (defaults to '-'), dob (defaults to current date)
CREATE PROCEDURE sp_InsertPerson
    @fname VARCHAR(32),
    @lname VARCHAR(32),
    @gender CHAR(1) = '-',
    @dob DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO People (fname, lname, gender, dob)
    VALUES (@fname, @lname, @gender, COALESCE(@dob, SYSDATETIME()));
END;
GO

-- Inserts a new movie into the Movies table, along with its image in the Images table
-- Parameters: title, director, releasedOn, synopsis for the movie; imageType, imageBin for the image
-- Output: Returns the ID of the inserted image

CREATE PROCEDURE sp_InsertMovie
    @title VARCHAR(64),
    @director INT,
    @releasedOn DATE,
    @synopsis TEXT,
    @imageName VARCHAR(32),
    @imageType VARCHAR(32),
    @imageBin VARBINARY(MAX),
    @movieID INT OUTPUT
AS
BEGIN
	DECLARE @imageId INT;

    SET NOCOUNT ON;
    -- Insert the image into the Images table and capture the generated ID
    INSERT INTO Images (imageName, imageMIME, imageBin)
    VALUES (@imageName, @imageType, @imageBin);
    SET @imageId = SCOPE_IDENTITY();

    -- Insert the movie into the Movies table, including the coverArt (imageId)
    INSERT INTO Movies (title, director, releasedOn, synopsis, coverArt)
    VALUES (@title, @director, @releasedOn, @synopsis, @imageId);
	SET @movieID = SCOPE_IDENTITY();
END;
GO

-- Insert Genre
CREATE PROCEDURE sp_InsertGenre
	@name VARCHAR(64)
AS
BEGIN
	INSERT INTO Genre
	VALUES(@name);
END;

GO
-- Adds an actor to a specific movie in the Actors table
-- Parameters: person (actor's ID), movie (movie's ID), appearsAs (role of the actor)
CREATE PROCEDURE sp_InsertActor
    @person INT,
    @movie INT,
    @appearsAs VARCHAR(64)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Actors (person, movie, appearsAs)
    VALUES (@person, @movie, @appearsAs);
END;
GO

-- Asigns a genre to a movie
CREATE PROCEDURE sp_AssignGenre
	@movieID INT,
	@genreID INT
AS
BEGIN
	INSERT INTO Movie_Genres(movie, genre)
	VALUES (@movieID, @genreID);
END;
GO

-- Adds a review for a specific movie in the Reviews table
-- Parameters: movie (movie's ID), id (user's ID), rating (1 to 5)
CREATE PROCEDURE sp_InsertReview
    @movie INT,
    @id INT,
    @rating INT,
	@msg VARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Reviews (movie, id, rating, msg)
    VALUES (@movie, @id, @rating, @msg);
END;
GO

-- Retrieval Procedures

-- Retrieves all people with their IDs, first names, last names, and average movie rating
-- Joins People, Actors, and Reviews to calculate the mean rating of movies each person is involved in
CREATE PROCEDURE sp_GetPeople
AS
BEGIN
    SET NOCOUNT ON;
    SELECT p.id, p.fname, p.lname, AVG(CAST(r.rating AS FLOAT)) as meanRating
    FROM People p
    LEFT JOIN Actors a ON p.id = a.person
    LEFT JOIN Reviews r ON a.movie = r.movie
    GROUP BY p.id, p.fname, p.lname;
END;
GO

-- Retrieves all details for a specific person by their ID
-- Parameter: id (person's ID)
CREATE PROCEDURE sp_GetPersonById
    @id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM People WHERE id = @id;
END;
GO

-- Retrieves all movies with their titles, cover image, and average rating
-- Joins Movies, Images, and Reviews to get the image and calculate the mean rating
CREATE PROCEDURE sp_GetMovies
AS
BEGIN
    SET NOCOUNT ON;
    SELECT m.id, m.title, i.imageBin, AVG(CAST(r.rating AS FLOAT)) as meanRating
    FROM Movies m
    LEFT JOIN Images i ON m.coverArt = i.id
    LEFT JOIN Reviews r ON m.id = r.movie
    GROUP BY m.id, m.title, i.imageBin;
END;
GO

-- Retrieves detailed info for a specific movie, including title, image, synopsis, and director's name
-- Parameter: id (movie's ID)
CREATE PROCEDURE sp_GetMovieById
    @id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT m.*, i.imageBin, i.imageMIME, p.fname as directorFname, p.lname as directorLname
    FROM Movies m
    LEFT JOIN Images i ON m.coverArt = i.id
    JOIN People p ON m.director = p.id
    WHERE m.id = @id;
END;
GO

-- Retrieves the list of actors for a specific movie, including their names and roles
-- Parameter: id (movie's ID)
CREATE PROCEDURE sp_GetActorsByMovieId
    @id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT p.id, p.fname, p.lname, a.appearsAs
    FROM Actors a
    JOIN People p ON a.person = p.id
    WHERE a.movie = @id;
END;
GO

-- Get Genres for a Movie
CREATE PROCEDURE sp_GetGenresByMovieID 
	@id INT
AS	
BEGIN
	SELECT * FROM Movie_Genres
	WHERE movie = @id;
END;
GO

-- Retrieves all reviews for a specific movie
-- Parameter: movie (movie's ID)
CREATE PROCEDURE sp_GetReviewsByMovieId
    @movie INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Reviews WHERE movie = @movie;
END;
GO

-- Update Procedures

-- Updates a person's details (first name, last name, gender, date of birth)
-- Parameters: id (person's ID), fname, lname, gender, dob (all optional)
CREATE PROCEDURE sp_UpdatePerson
    @id INT,
    @fname VARCHAR(32) = NULL,
    @lname VARCHAR(32) = NULL,
    @gender CHAR(1) = NULL,
    @dob DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE People
    SET fname = COALESCE(@fname, fname),
        lname = COALESCE(@lname, lname),
        gender = COALESCE(@gender, gender),
        dob = COALESCE(@dob, dob)
    WHERE id = @id;
END;
GO

-- Updates a movie's details (title, director, release date, synopsis) and optionally adds a new image
-- Parameters: id (movie's ID), title, director, releasedOn, synopsis, imageName, imageType, imageBin (all optional)
CREATE PROCEDURE sp_UpdateMovie
    @id INT,
    @title VARCHAR(64) = NULL,
    @director INT = NULL,
    @releasedOn DATE = NULL,
    @synopsis TEXT = NULL,
    @imageName VARCHAR(32) = NULL,
    @imageType VARCHAR(5) = NULL,
    @imageBin VARBINARY(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @newImageId INT;

    -- If a new image is provided, insert it into the Images table and capture the new ID
    IF @imageName IS NOT NULL AND @imageType IS NOT NULL AND @imageBin IS NOT NULL
    BEGIN
        INSERT INTO Images (imageName, imageMIME, imageBin)
        VALUES (@imageName, @imageType, @imageBin);
        SET @newImageId = SCOPE_IDENTITY();
    END

    -- Update the movie's details, including the new coverArt (imageId) if applicable
    UPDATE Movies
    SET title = COALESCE(@title, title),
        director = COALESCE(@director, director),
        releasedOn = COALESCE(@releasedOn, releasedOn),
        synopsis = COALESCE(@synopsis, synopsis),
        coverArt = COALESCE(@newImageId, coverArt)
    WHERE id = @id;
END;
GO

-- Updates an actor's role (appearsAs) for a specific movie
-- Parameters: movie (movie's ID), person (actor's ID), appearsAs (new role)
CREATE PROCEDURE sp_UpdateActor
    @movie INT,
    @person INT,
    @appearsAs VARCHAR(64)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Actors
    SET appearsAs = @appearsAs
    WHERE movie = @movie AND person = @person;
END;
GO

-- Updates a review's rating for a specific movie
-- Parameters: movie (movie's ID), id (user's ID), rating (new rating)
CREATE PROCEDURE sp_UpdateReview
    @movie INT,
    @id INT,
    @rating INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Reviews
    SET rating = @rating
    WHERE movie = @movie AND id = @id;
END;
GO

-- Deletion Procedures

-- Deletes a person from the People table
-- Parameter: id (person's ID)
CREATE PROCEDURE sp_DeletePerson
    @id INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM People WHERE id = @id;
END;
GO

-- Deletes a movie from the Movies table
-- Parameter: id (movie's ID)
CREATE PROCEDURE sp_DeleteMovie
    @id INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM Movies WHERE id = @id;
END;
GO

-- Removes an actor from a specific movie in the Actors table
-- Parameters: movie (movie's ID), person (actor's ID)
CREATE PROCEDURE sp_DeleteActor
    @movie INT,
    @person INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM Actors
    WHERE movie = @movie AND person = @person;
END;
GO

-- Deletes a review for a specific movie
-- Parameters: movie (movie's ID), id (user's ID)
CREATE PROCEDURE sp_DeleteReview
    @movie INT,
    @id INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM Reviews
    WHERE movie = @movie AND id = @id;
END;

GO
CREATE PROCEDURE sp_GetMoviesByGenre
    @GenreId INT
AS
BEGIN
    -- First get movie info with director and image binary
    SELECT 
        m.id AS movieId,
        m.title,
        m.synopsis,
        img.imageBin,
        m.releasedOn,
        d.id AS directorId,
        d.fname AS directorFname,
        d.lname AS directorLname
    FROM 
        Movies m
    INNER JOIN 
        Movie_Genres mg ON m.id = mg.movie
    INNER JOIN 
        People d ON m.director = d.id
    INNER JOIN
        Images img ON m.coverArt = img.id
    WHERE 
        mg.genre = @GenreId;
END
