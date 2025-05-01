USE dotRate;
SELECT * FROM Reviews;
-- ============ Insertion Procedures ============ 

-- Inserts a new person into the People table
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

-- ============  Retrieval Procedures ============ 

-- Retrieves all people with their IDs, first names, last names, and average movie rating
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
CREATE PROCEDURE sp_GetPersonById
    @id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM People WHERE id = @id;
END;
GO

-- Retrieves all movies with their titles, cover image, and average rating
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
	SELECT G.* 
	FROM Movie_Genres M
	JOIN Genre G
	ON G.id = M.genre
	WHERE movie = @id;
END;
GO

-- Retrieves all reviews for a specific movie
CREATE PROCEDURE sp_GetReviewsByMovieId
    @movie INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT U.id as author, U.username, rating, msg
	FROM Reviews R
	JOIN Users U
	ON R.id = U.id
	WHERE movie = @movie;
END;
GO

-- ============  Update Procedures ============ 

-- Updates a person's details (first name, last name, gender, date of birth)
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

-- Removes all Actor Relationships to a Movie
CREATE PROCEDURE sp_WipeMovieActors
	@movie int
AS
BEGIN
	DELETE FROM Actors
	WHERE movie = @movie;
END;
GO

-- Removes all Genre Tags from a Movie
CREATE PROCEDURE sp_WipeMovieGenres
	@movie int
AS
BEGIN
	DELETE FROM Movie_Genres
	WHERE movie = @movie;
END;

GO

-- Updates an actor's role (appearsAs) for a specific movie
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

-- ============ Deletion Procedures ============ 

-- Deletes a person from the People table
CREATE PROCEDURE sp_DeletePerson
    @id INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM People WHERE id = @id;
END;
GO

-- Deletes a movie from the Movies table
CREATE PROCEDURE sp_DeleteMovie
    @id INT
AS
BEGIN
	DELETE FROM Movie_Genres WHERE movie = @id;
	DELETE FROM Actors WHERE movie = @id;
    SET NOCOUNT ON;
    DELETE FROM Movies WHERE id = @id;
END;
GO

-- Removes an actor from a specific movie in the Actors table
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
