import { Request, Response } from "express";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { getConnection, queryDatabase } from "../services/databaseServices";
import { createGameFormModel } from "@shared/formModels/CreateGameFormModel";
import { createMerchFormModel } from "@shared/formModels/CreateMerchFormModel";
import { createNewsFormModel } from "@shared/formModels/CreateNewsFormModel";
import { createUserFormModel } from "@shared/formModels/CreateUserFormModel";
import bcrypt from "bcryptjs";
// import { DeactivatedData } from "@shared/types/DeactivatedData";
// import multer from "multer";

// const upload:any = multer({ dest: "uploads/" });

export class AdminController {
    

    // ------------------------------ functions to get all objects from database ------------------------------
    /**
     * Gets all merch items from database
     * 
     * @param req Request object
     * @param res Response object
     */
    public async getAllMerch(_req: Request, res: Response): Promise<void> {
        let connection: PoolConnection | undefined = undefined;
    
        try {
            connection = await getConnection();
            await connection.beginTransaction();
            console.log("Begin transaction");
    
            // Query to retrieve all columns from merchandise and specific columns from product
            const merch: any = await queryDatabase(
                connection,
                `SELECT merchandise.*, product.name, product.price, product.status 
                FROM merchandise 
                INNER JOIN product ON merchandise.product_id = product.id`
            );
    
            await connection.commit();
            console.log("Commit");
    
            res.status(200).json(merch);
        } catch (error) {
            console.error(error);
    
            if (connection) await connection.rollback();
    
            res.status(500).send("Internal Server Error");
        } finally {
            if (connection) {
                connection.release();
                console.log("Connection released");
            }
        }
    }

    public async getAllGames(_req: Request, res: Response): Promise<void> {
        let connection: PoolConnection | undefined = undefined;
    
        try {
            connection = await getConnection();
            await connection.beginTransaction();
            console.log("Begin transaction");
    
            // Query to retrieve all columns from game and status from product
            const games: any = await queryDatabase(
                connection,
                `SELECT game.*, product.status 
                 FROM game 
                 INNER JOIN product ON game.product_id = product.id`
            );
    
            await connection.commit();
            console.log("Commit");
    
            res.status(200).json(games);
        } catch (error) {
            console.error(error);
    
            if (connection) await connection.rollback();
    
            res.status(500).send("Internal Server Error");
        } finally {
            if (connection) {
                connection.release();
                console.log("Connection released");
            }
        }
    }

    public async getAllSales(_req: Request, res: Response): Promise<void> {

        // Initialize database connection
        let connection: PoolConnection | undefined = undefined;

        try {

            // Get a database connection
            connection = await getConnection();

            // Begin a transaction
            await connection.beginTransaction();
            console.log("Begin transaction");

            // Query to retrieve four random games with product details using inner join
            const sales: any = await queryDatabase(connection,
                "SELECT * FROM bill_products"
            );

            // Commit the transaction
            await connection.commit();
            console.log("Commit");

            // Return the retrieved games
            res.status(200).json(sales);
        } catch (error) {

            console.error(error);

            // Rollback the transaction and handle errors
            if (connection) await connection.rollback();

            // Send a 500 response
            res.status(500).send("Internal Server Error");

        } finally {

            if (connection) {

                // Release the database connection after all operations are done
                connection.release();
                console.log("Connection released");

            }

        }
    }

    public async getAllBills(_req: Request, res: Response): Promise<void> {

        // Initialize database connection
        let connection: PoolConnection | undefined = undefined;

        try {

            // Get a database connection
            connection = await getConnection();

            // Begin a transaction
            await connection.beginTransaction();
            console.log("Begin transaction");

            // Query to retrieve four random games with product details using inner join
            const bills: any = await queryDatabase(connection, 
                `SELECT b.id AS bill_id, 
                b.user_id, 
                b.created_at,
                b.shipping_street, 
                b.shipping_house_number, 
                b.shipping_house_number_addition, 
                b.shipping_zip, 
                b.shipping_city, 
                b.shipping_country, 
                b.billing_street, 
                b.billing_house_number, 
                b.billing_house_number_addition, 
                b.billing_zip, 
                b.billing_city, 
                b.billing_country, 
                b.total_price_excl_VAT, 
                b.total_price_excl_VAT, 
                b.VAT_price, 
                b.total_price_incl_VAT, 
                u.first_name, 
                u.last_name, 
                u.email, 
                bp.id AS bill_product_id, 
                bp.bill_id, 
                bp.product_title, 
                bp.product_price, 
                bp.quantity 
                FROM bill b 
                INNER JOIN users u ON b.user_id = u.id 
                LEFT JOIN bill_products bp ON b.id = bp.bill_id;`
            );

            // Commit the transaction
            await connection.commit();
            console.log("Commit");

            // Return the retrieved games
            res.status(200).json(bills);
        } catch (error) {

            console.error(error);

            // Rollback the transaction and handle errors
            if (connection) await connection.rollback();

            // Send a 500 response
            res.status(500).send("Internal Server Error");

        } finally {

            if (connection) {

                // Release the database connection after all operations are done
                connection.release();
                console.log("Connection released");

            }

        }
    }

    public async getAllUsers(_req: Request, res: Response): Promise<void> {
        let connection: PoolConnection | undefined = undefined;

        try {

            // Get a database connection
            connection = await getConnection();

            // Begin a transaction
            await connection.beginTransaction();
            console.log("Begin transaction");

            // Query to retrieve four random games with product details using inner join
            const users: any = await queryDatabase(connection,
                "SELECT * FROM users WHERE authorization_level='user'"
            );

            // Commit the transaction
            await connection.commit();
            console.log("Commit");

            // Return the retrieved games
            res.status(200).json(users);
        } catch (error) {

            console.error(error);

            // Rollback the transaction and handle errors
            if (connection) await connection.rollback();

            // Send a 500 response
            res.status(500).send("Internal Server Error");

        } finally {

            if (connection) {

                // Release the database connection after all operations are done
                connection.release();
                console.log("Connection released");

            }

        }
    }

    public async getAllAdmins(_req: Request, res: Response): Promise<void> {
        let connection: PoolConnection | undefined = undefined;

        try {
            // Get a database connection
            connection = await getConnection();

            // Begin a transaction
            await connection.beginTransaction();
            console.log("Begin transaction");

            // Query to retrieve four random games with product details using inner join
            const admins: any = await queryDatabase(connection,
                "SELECT * FROM users WHERE authorization_level='admin'"
            );

            // Commit the transaction
            await connection.commit();
            console.log("Commit");

            // Return the retrieved games
            res.status(200).json(admins);
        } catch (error) {

            console.error(error);

            // Rollback the transaction and handle errors
            if (connection) await connection.rollback();

            // Send a 500 response
            res.status(500).send("Internal Server Error");

        } finally {

            if (connection) {

                // Release the database connection after all operations are done
                connection.release();
                console.log("Connection released");

            }

        }
    }

    public async getAllEmployees(_req: Request, res: Response): Promise<void> {
        let connection: PoolConnection | undefined = undefined;

        try {
            // Get a database connection
            connection = await getConnection();

            // Begin a transaction
            await connection.beginTransaction();
            console.log("Begin transaction");

            // Query to retrieve four random games with product details using inner join
            const employees: any = await queryDatabase(connection,
                "SELECT * FROM users WHERE authorization_level='employee'"
            );

            // Commit the transaction
            await connection.commit();
            console.log("Commit");

            // Return the retrieved games
            res.status(200).json(employees);
        } catch (error) {

            console.error(error);

            // Rollback the transaction and handle errors
            if (connection) await connection.rollback();

            // Send a 500 response
            res.status(500).send("Internal Server Error");

        } finally {

            if (connection) {

                // Release the database connection after all operations are done
                connection.release();
                console.log("Connection released");

            }

        }
    }

    public async getAllNewsItems(_req: Request, res: Response): Promise<void> {

        // Initialize database connection
        let connection: PoolConnection | undefined = undefined;

        try {

            // Get a database connection
            connection = await getConnection();

            // Begin a transaction
            await connection.beginTransaction();
            console.log("Begin transaction");

            // Query to retrieve four random games with product details using inner join
            const news: any = await queryDatabase(connection,
                "SELECT * FROM news"
            );

            // Commit the transaction
            await connection.commit();
            console.log("Commit");

            // Return the retrieved games
            res.status(200).json(news);
        } catch (error) {

            console.error(error);

            // Rollback the transaction and handle errors
            if (connection) await connection.rollback();

            // Send a 500 response
            res.status(500).send("Internal Server Error");

        } finally {

            if (connection) {

                // Release the database connection after all operations are done
                connection.release();
                console.log("Connection released");

            }

        }
    }
    

    // ------------------------------ functions to create objects ------------------------------

    /**
     * adds new game to database
     * 
     * @param req Request object containing the game inforamtion form data
     * @param res Response object
     * @returns Sends a response indicating the success or failure of game import
     */
    public async createGame(req: Request, res: Response): Promise<void> {

        // Get the form data from the request body
        const formModel: createGameFormModel = req.body as createGameFormModel;

        // Validate empty email/username/password
        if (!formModel.gameTitle || !formModel.Thumbnail || !formModel.price) {

            // Send a 400 response if any field is missing
            res.status(400).send("gameTitle, Thumbnail, and price are required fields.");
            return;

        }

        // Initialize the database connection variable
        let connection: PoolConnection | undefined = undefined;

        try {

            // Get a connection to the database
            connection = await getConnection();

            // Begin a new transaction
            await connection.beginTransaction();
            console.log("Begin transaction");

            // Insert the new user into the database
            const addGameToProducts: ResultSetHeader = await queryDatabase(connection,
                "INSERT INTO product (name, thumbnail, price, item_type) VALUES (?, ?, ?, ?)",
                formModel.gameTitle,
                formModel.Thumbnail,
                formModel.price,
                "game"
            );

            console.log(addGameToProducts);

            const addGameToGames: ResultSetHeader = await queryDatabase(connection,
                "INSERT INTO game (product_id, title, thumbnail, descriptionMarkdown, descriptionHTML, url, authors_text, tags_text) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                addGameToProducts.insertId,
                formModel.gameTitle,
                formModel.Thumbnail,
                formModel.Description,
                "<p>"+formModel.Description+"<p>",
                formModel.url,
                formModel.authors,
                formModel.tags
            );

            console.log(addGameToGames);


            // Commit the transaction if no errors
            await connection.commit();
            console.log("Commit");

            // Send a 200 response if successful
            res.status(200).json({ message: "Successfully added game" });

        } catch (error) {

            console.error(error);

            // Rollback the transaction in case of error
            if (connection) await connection.rollback();

            // Send a 500 response
            res.status(500).send("Internal Server Error");

        } finally {

            if (connection) {

                // Release the database connection after all operations are done
                connection.release();
                console.log("Connection released");

            }

        }
    }

    /**
     * adds new merch to database
     * 
     * @param req Request object containing the merch inforamtion form data
     * @param res Response object
     * @returns Sends a response indicating the success or failure of merch import
     */
    public async createMerch(req: Request, res: Response): Promise<void> {

        // Get the form data from the request body
        const formModel: createMerchFormModel = req.body as createMerchFormModel;

        // Initialize the database connection variable
        let connection: PoolConnection | undefined = undefined;


        try {

            // Get a connection to the database
            connection = await getConnection();

            // Begin a new transaction
            await connection.beginTransaction();
            console.log("Begin transaction");

            // Insert the new user into the database
            const addMerchToProducts: ResultSetHeader = await queryDatabase(connection,
                "INSERT INTO product (name, thumbnail, price, item_type) VALUES (?, ?, ?, ?)",
                formModel.name,
                formModel.Thumbnail,
                formModel.price,
                "merchandise"
            );

            console.log(addMerchToProducts);

            const addMerchToMerch: ResultSetHeader = await queryDatabase(connection,
                "INSERT INTO merchandise (product_id, type, quantity, thumbnail) VALUES (?, ?, ?, ?)",
                addMerchToProducts.insertId,
                formModel.type,
                formModel.quantity,
                formModel.Thumbnail,
            );

            console.log(addMerchToMerch);


            // Commit the transaction if no errors
            await connection.commit();
            console.log("Commit");

            // Send a 200 response if successful
            res.status(200).json({ message: "Successfully added game" });

        } catch (error) {

            console.error(error);

            // Rollback the transaction in case of error
            if (connection) await connection.rollback();

            // Send a 500 response
            res.status(500).send("Internal Server Error");

        } finally {

            if (connection) {

                // Release the database connection after all operations are done
                connection.release();
                console.log("Connection released");

            }

        }
    }

    /**
     * Register a new user in the database
     * 
     * @param req Request object containing the user registration form data
     * @param res Response object
     * @returns Sends a response indicating the success or failure of the registration
     */
    public async createAccount(req: Request, res: Response): Promise<void> {

        // Get the form data from the request body
        const formModel: createUserFormModel = req.body as createUserFormModel;

        // Validate empty email/username/password
        if (!formModel.email || !formModel.username || !formModel.password) {

            // Send a 400 response if any field is missing
            res.status(400).send("email, name, password are required.");
            return;

        }

        // Initialize the database connection variable
        let connection: PoolConnection | undefined = undefined;

        try {

            // Get a connection to the database
            connection = await getConnection();

            // Begin a new transaction
            await connection.beginTransaction();
            console.log("Begin transaction");

            // Hash the password
            const hashedPassword: string = bcrypt.hashSync(formModel.password, 10);

            // Insert the new user into the database
            const addUser: ResultSetHeader = await queryDatabase(connection,
                "INSERT INTO users (username, email, password, authorization_level, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?)",
                formModel.username,
                formModel.email,
                hashedPassword,
                formModel.auth_level,
                formModel.firstName,
                formModel.lastName,
            );

            console.log(addUser);

            // Commit the transaction if no errors
            await connection.commit();
            console.log("Commit");

            // Send a 200 response if successful
            res.status(200).json({ message: "Successfully registered user." });

        } catch (error) {

            console.error(error);

            // Rollback the transaction in case of error
            if (connection) await connection.rollback();

            // Send a 500 response
            res.status(500).send("Internal Server Error");

        } finally {

            if (connection) {

                // Release the database connection after all operations are done
                connection.release();
                console.log("Connection released");

            }

        }
    }

    /**
     * adds new news item to database
     * 
     * @param req Request object containing the news item inforamtion form data
     * @param res Response object
     * @returns Sends a response indicating the success or failure of news item import
     */
    public async createNews (req: Request, res: Response): Promise<void> {

        // Get the form data from the request body
        const formModel: createNewsFormModel = req.body as createNewsFormModel;

        // Initialize the database connection variable
        let connection: PoolConnection | undefined = undefined;


        try {

            // Get a connection to the database
            connection = await getConnection();

            // Begin a new transaction
            await connection.beginTransaction();
            console.log("Begin transaction");

            // Insert the new user into the database
            const addNewstoNews: ResultSetHeader = await queryDatabase(connection,
                "INSERT INTO news (title, thumbnail, description, introduction, content) VALUES (?, ?, ?, ?, ?)",
                formModel.title,
                formModel.thumbnail,
                formModel.description,
                formModel.introduction,
                formModel.content
            );

            console.log(addNewstoNews);


            // Commit the transaction if no errors
            await connection.commit();
            console.log("Commit");

            // Send a 200 response if successful
            res.status(200).json({ message: "Successfully added game" });

        } catch (error) {

            console.error(error);

            // Rollback the transaction in case of error
            if (connection) await connection.rollback();

            // Send a 500 response
            res.status(500).send("Internal Server Error");

        } finally {

            if (connection) {

                // Release the database connection after all operations are done
                connection.release();
                console.log("Connection released");

            }

        }
    }

    // ------------------------------ functions to GET objects by ID ------------------------------
    /**
     * Gets a user profile by ID.
     * 
     * @param req Request object
     * @param res Response object
     */
    public async getUserProfile(req: Request, res: Response): Promise<void> {
        const userId: string = req.params.userId;

        let connection: PoolConnection | undefined = undefined;

        try {
            connection = await getConnection();
            await connection.beginTransaction();
            console.log("Begin transaction");

            const userDataResults: any = await queryDatabase(connection, 
                "SELECT id, username, email, authorization_level, first_name, last_name FROM users WHERE id = ?", userId);

            if (userDataResults.length === 0) {
                console.log("No profile data found for user ID:", userId);
                res.status(404).send("Profile not found.");
                return;
            }

            const userProfile : any = {
                id: userDataResults[0].id,
                username: userDataResults[0].username,
                email: userDataResults[0].email,
                birth_date: userDataResults[0].birth_date,
                authorization_level: userDataResults[0].authorization_level,
                phonenumber: userDataResults[0].phonenumber,
                first_name: userDataResults[0].first_name,
                last_name: userDataResults[0].last_name,
            };

            await connection.commit();
            console.log("Profile data fetched successfully:", userProfile);

            res.status(200).json(userProfile);
        } catch (error) {
            if (connection) await connection.rollback();
            console.error("Failed to get profile:", error);
            res.status(500).send("Internal Server Error");
        } finally {
            if (connection) {
                connection.release();
                console.log("Connection released");
            }
        }
    }

    /**
     * Get a specific game by its ID from the database with product details
     * 
     * @param req Request object
     * @param res Response object
     * @returns Sends the game details or a 404 error if not found
     */
    public async  getNewsById(req: Request, res: Response): Promise<void> {
        console.log("initializing");
        // Initialize database connection
        let connection: PoolConnection | undefined = undefined;

        try {

            // Get a database connection
            connection = await getConnection();

            // Get the game ID from the request parameters
            const newsId: string = req.params.id;

            // Query to retrieve a game by its ID with product details using inner join
            const news: any = await queryDatabase(connection,
                "SELECT * FROM news WHERE id = ?",
                newsId);

            // If game not found, return 404
            if (news.length === 0) {
                res.status(404).send("News not found");
                return;
            }

            // Send response 200 with retrieved game
            res.status(200).json(news[0]);

        } catch (error) {

            console.error(error);

            // Rollback the transaction and handle errors
            if (connection) await connection.rollback();

            // Send a 500 response
            res.status(500).send("Internal Server Error");

        } finally {

            if (connection) {

                // Release the database connection after all operations are done
                connection.release();
                console.log("Connection released");

            }

        }
    }

    public async getGameById(req: Request, res: Response): Promise<void> {
        console.log("initializing");
        let connection: PoolConnection | undefined = undefined;
    
        try {
            connection = await getConnection();
            const gameId: string = req.params.id;
    
            const game: any = await queryDatabase(connection,
                "SELECT p.*, g.* " +
                "FROM game g " +
                "INNER JOIN product p ON g.product_id = p.id " +
                "WHERE g.id = ?",
                gameId
            );
    
            if (game.length === 0) {
                res.status(404).send("Game not found");
                return;
            }
    
            res.status(200).json(game[0]);
        } catch (error) {
            console.error(error);
    
            if (connection) await connection.rollback();
    
            res.status(500).send("Internal Server Error");
        } finally {
            if (connection) {
                connection.release();
                console.log("Connection released");
            }
        }
    }

    public async getBillById(req: Request, res: Response): Promise<void> {
        const billId:number = parseInt(req.params.billId);
        console.log("billId: " + billId);
        
        // Initialize database connection
        let connection: PoolConnection | undefined = undefined;

        try {

            // Get a database connection
            connection = await getConnection();

            // Begin a transaction
            await connection.beginTransaction();
            console.log("Begin transaction");

            // Query to retrieve four random games with product details using inner join
            const bills: any = await queryDatabase(connection, 
                `SELECT b.id AS bill_id, 
                b.user_id, 
                b.created_at,
                b.shipping_street, 
                b.shipping_house_number, 
                b.shipping_house_number_addition, 
                b.shipping_zip, 
                b.shipping_city, 
                b.shipping_country, 
                b.billing_street, 
                b.billing_house_number, 
                b.billing_house_number_addition, 
                b.billing_zip, 
                b.billing_city, 
                b.billing_country, 
                b.total_price_excl_VAT, 
                b.total_price_excl_VAT, 
                b.VAT_price, 
                b.total_price_incl_VAT, 
                u.first_name, 
                u.last_name, 
                u.email, 
                bp.id AS bill_product_id, 
                bp.bill_id, 
                bp.product_title, 
                bp.product_price, 
                bp.quantity 
                FROM bill b 
                INNER JOIN users u ON b.user_id = u.id 
                LEFT JOIN bill_products bp ON b.id = bp.bill_id
                WHERE bill_id = ?`,
                billId
            );

            console.log("bills:" +  bills);

            // Commit the transaction
            await connection.commit();
            console.log("Commit");

            // Return the retrieved games
            res.status(200).json(bills);
        } catch (error) {

            console.error(error);

            // Rollback the transaction and handle errors
            if (connection) await connection.rollback();

            // Send a 500 response
            res.status(500).send("Internal Server Error");

        } finally {

            if (connection) {

                // Release the database connection after all operations are done
                connection.release();
                console.log("Connection released");

            }

        }
    }

    
    

    public async getMerchById(req: Request, res: Response): Promise<void> {
        console.log("initializing");
        let connection: PoolConnection | undefined = undefined;
    
        try {
            connection = await getConnection();
            const merchId: string = req.params.id;
    
            const merch: any = await queryDatabase(connection,
                "SELECT p.*, m.* " +
                "FROM merchandise m " +
                "INNER JOIN product p ON m.product_id = p.id " +
                "WHERE m.id = ?",
                merchId
            );
    
            if (merch.length === 0) {
                res.status(404).send("Merchandise not found");
                return;
            }
    
            res.status(200).json(merch[0]);
        } catch (error) {
            console.error(error);
    
            if (connection) await connection.rollback();
    
            res.status(500).send("Internal Server Error");
        } finally {
            if (connection) {
                connection.release();
                console.log("Connection released");
            }
        }
    }
    



    // ------------------------------ functions to Update objects/profiles by ID ------------------------------

    /**
 * Updates the profile data of a given user.
 * 
 * @param req Request object
 * @param res Response object
 */
    public async updateUserProfile(req: Request, res: Response): Promise<void> {
        const userId: string = req.params.userId;
        const { username, email, authorization_level, first_name, last_name } = req.body;
    
        // Validate input
        if (!username || !email) {
            res.status(400).send("Username and email are required.");
            return;
        }
    
        let connection: PoolConnection | undefined = undefined;
    
        try {
            console.log("Received update request for user ID:", userId);
            console.log("Update data:", { username, email, authorization_level, first_name, last_name });
    
            connection = await getConnection();
            await connection.beginTransaction();
            console.log("Begin transaction");
    
            const updateResult: any = await queryDatabase(
                connection,
                "UPDATE users SET username = ?, email = ?, authorization_level = ?, first_name = ?, last_name = ? WHERE id = ?",
                username, email, authorization_level, first_name, last_name, userId
            );
            console.log("Update result:", updateResult);
    
            if (updateResult.affectedRows === 0) {
                console.log("No profile data found for user ID:", userId);
                res.status(404).send("Profile not found.");
                return;
            }
    
            await connection.commit();
            console.log("Profile updated successfully for user ID:", userId);
    
            res.status(200).send("Profile updated successfully.");
        } catch (error) {
            if (connection) await connection.rollback();
    
            if (error instanceof Error) {
                console.error("Failed to update profile:", error.message);
                console.error("Stack trace:", error.stack);
                res.status(500).send("Internal Server Error: " + error.message);
            } else {
                console.error("Failed to update profile:", error);
                res.status(500).send("Internal Server Error");
            }
        } finally {
            if (connection) {
                connection.release();
                console.log("Connection released");
            }
        }
    }


    public async deactivateUserProfile(req: Request, res: Response): Promise<void> {
        const userId: string = req.params.userId;
        const { username, email, authorization_level, first_name, last_name } = req.body;
    
        // Validate input
        if (!username || !email) {
            res.status(400).send("Username and email are required.");
            return;
        }
    
        let connection: PoolConnection | undefined = undefined;
        try {
            console.log("Received deactivate request for user ID:", userId);

            connection = await getConnection();
            await connection.beginTransaction();
            console.log("Begin transaction");

            const updateResult: any = await queryDatabase(
                connection,
                "UPDATE users SET username = ?, email = ?, authorization_level = ?, first_name = ?, last_name = ? WHERE id = ?",
                username, email, authorization_level, first_name, last_name, userId
            );
            console.log("Deactivate result:",  updateResult);

            if ( updateResult.affectedRows === 0) {
                console.log("No profile data found for user ID:", userId);
                res.status(404).send("Profile not found.");
                return;
            }

            await connection.commit();
            console.log("Profile deactivated successfully for user ID:", userId);

            res.status(200).send("Profile deactivated successfully.");
        } catch (error) {
            if (connection) await connection.rollback();

            if (error instanceof Error) {
                console.error("Failed to deactivate profile:", error.message);
                console.error("Stack trace:", error.stack);
                res.status(500).send("Internal Server Error: " + error.message);
            } else {
                console.error("Failed to deactivate profile:", error);
                res.status(500).send("Internal Server Error");
            }
        } finally {
            if (connection) {
                connection.release();
                console.log("Connection released");
            }
        }
    }

    public async updateNews(req: Request, res: Response): Promise<void> {
        const newsId: string = req.params.id;
        const formModel: createNewsFormModel = req.body as createNewsFormModel;

        let connection: PoolConnection | undefined = undefined;

        try {
            connection = await getConnection();
            await connection.beginTransaction();
            console.log("Begin transaction");

            const updateNewsResult: ResultSetHeader = await queryDatabase(connection,
                "UPDATE news SET title = ?, thumbnail = ?, description = ?, introduction = ?, content = ? WHERE id = ?",
                formModel.title,
                formModel.thumbnail,
                formModel.description,
                formModel.introduction,
                formModel.content,
                newsId
            );

            console.log(updateNewsResult);

            await connection.commit();
            console.log("Commit");

            res.status(200).json({ message: "Successfully updated news" });
        } catch (error) {
            console.error(error);

            if (connection) await connection.rollback();

            res.status(500).send("Internal Server Error");
        } finally {
            if (connection) {
                connection.release();
                console.log("Connection released");
            }
        }
    }

    public async updateGame(req: Request, res: Response): Promise<void> {
    const gameId: string = req.params.id;
    const formModel: createGameFormModel = req.body as createGameFormModel;

    let connection: PoolConnection | undefined = undefined;

    try {
        connection = await getConnection();
        await connection.beginTransaction();
        console.log("Begin transaction");

        // Fetch the product_id using the gameId
        const gameResult: any = await queryDatabase(connection,
            "SELECT product_id FROM game WHERE id = ?",
            gameId
        );

        if (gameResult.length === 0) {
            res.status(404).send("Game not found");
            return;
        }

        const productId:any = gameResult[0].product_id;

        const updateProductResult: ResultSetHeader = await queryDatabase(connection,
            "UPDATE product SET name = ?, thumbnail = ?, price = ?, status = ? WHERE id = ?",
            formModel.gameTitle,
            formModel.Thumbnail,
            formModel.price,
            formModel.status,
            productId
        );

        const updateGameResult: ResultSetHeader = await queryDatabase(connection,
            "UPDATE game SET title = ?, thumbnail = ?, descriptionMarkdown = ?, descriptionHTML = ?, url = ?, authors_text = ?, tags_text = ? WHERE id = ?",
            formModel.gameTitle,
            formModel.Thumbnail,
            formModel.Description,
            "<p>"+formModel.Description+"<p>",
            formModel.url,
            formModel.authors,
            formModel.tags,
            gameId
        );

        console.log(updateProductResult);
        console.log(updateGameResult);

        await connection.commit();
        console.log("Commit");

        res.status(200).json({ message: "Successfully updated game" });
    } catch (error) {
        console.error(error);

        if (connection) await connection.rollback();

        res.status(500).send("Internal Server Error");
    } finally {
        if (connection) {
            connection.release();
            console.log("Connection released");
        }
    }
}


    public async updateMerch(req: Request, res: Response): Promise<void> {
        const merchId: string = req.params.id;
        const formModel: createMerchFormModel = req.body as createMerchFormModel;
    
        let connection: PoolConnection | undefined = undefined;
    
        try {
            connection = await getConnection();
            await connection.beginTransaction();
            console.log("Begin transaction");
    
            // Fetch the product_id using the merchId
            const merchResult: any = await queryDatabase(connection,
                "SELECT product_id FROM merchandise WHERE id = ?",
                merchId
            );
    
            if (merchResult.length === 0) {
                res.status(404).send("Merchandise not found");
                return;
            }
    
            const productId: any = merchResult[0].product_id;
    
            const updateProductResult: ResultSetHeader = await queryDatabase(connection,
                "UPDATE product SET name = ?, thumbnail = ?, price = ?, status = ? WHERE id = ?",
                formModel.name,
                formModel.Thumbnail,
                formModel.price,
                formModel.status,
                productId
            );
    
            const updateMerchResult: ResultSetHeader = await queryDatabase(connection,
                "UPDATE merchandise SET type = ?, quantity = ?, thumbnail = ? WHERE id = ?",
                formModel.type,
                formModel.quantity,
                formModel.Thumbnail,
                merchId
            );
    
            console.log(updateProductResult);
            console.log(updateMerchResult);
    
            await connection.commit();
            console.log("Commit");
    
            res.status(200).json({ message: "Successfully updated merchandise" });
        } catch (error) {
            console.error(error);
    
            if (connection) await connection.rollback();
    
            res.status(500).send("Internal Server Error");
        } finally {
            if (connection) {
                connection.release();
                console.log("Connection released");
            }
        }
    }
    

    

    // ------------------------------ functions to Delete/Deactivate objects/profiles by ID ------------------------------
    /**
     * Deletes a user profile by ID.
     * 
     * @param req Request object
     * @param res Response object
     */
    public async deleteUserProfile(req: Request, res: Response): Promise<void> {
        const userId: string = req.params.userId;
        let connection: PoolConnection | undefined = undefined;
    
        try {
            connection = await getConnection();
            await connection.beginTransaction();
            console.log("Begin transaction");
    
            const deleteResult: any = await queryDatabase(connection, "DELETE FROM users WHERE id = ?", userId);
    
            if (deleteResult.affectedRows === 0) {
                console.log("No profile data found for user ID:", userId);
                res.status(404).send("Profile not found.");
                return;
            }
    
            await connection.commit();
            console.log("Profile deleted successfully:", userId);
    
            res.status(200).send("Profile deleted successfully.");
        } catch (error) {
            if (connection) await connection.rollback();
            console.error("Failed to delete profile:", error);
            res.status(500).send("Internal Server Error");
        } finally {
            if (connection) {
                connection.release();
                console.log("Connection released");
            }
        }
    }

    



    public async deleteNews(req: Request, res: Response): Promise<void> {
        const newsId: string = req.params.id;
        let connection: PoolConnection | undefined = undefined;
    
        try {
            connection = await getConnection();
            await connection.beginTransaction();
            console.log("Begin transaction");
    
            const deleteResult: any = await queryDatabase(connection, "DELETE FROM news WHERE id = ?", newsId);
    
            if (deleteResult.affectedRows === 0) {
                console.log("No news item found with ID:", newsId);
                res.status(404).send("News item not found.");
                return;
            }
    
            await connection.commit();
            console.log("News item deleted successfully:", newsId);
    
            res.status(200).send("News item deleted successfully.");
        } catch (error) {
            if (connection) await connection.rollback();
            console.error("Failed to delete news item:", error);
            res.status(500).send("Internal Server Error");
        } finally {
            if (connection) {
                connection.release();
                console.log("Connection released");
            }
        }
    }

    public async deleteGame(req: Request, res: Response): Promise<void> {
        const gameId: string = req.params.id;
        let connection: PoolConnection | undefined = undefined;
    
        try {
            connection = await getConnection();
            await connection.beginTransaction();
            console.log("Begin transaction");
    
            // Fetch the product_id using the gameId
            const gameResult: any = await queryDatabase(connection,
                "SELECT product_id FROM game WHERE id = ?",
                gameId
            );
    
            if (gameResult.length === 0) {
                res.status(404).send("Game not found");
                return;
            }
    
            const productId: any = gameResult[0].product_id;
    
            // Delete from game table
            const deleteGameResult: ResultSetHeader = await queryDatabase(connection,
                "DELETE FROM game WHERE id = ?",
                gameId
            );
    
            // Delete from product table
            const deleteProductResult: ResultSetHeader = await queryDatabase(connection,
                "DELETE FROM product WHERE id = ?",
                productId
            );
    
            console.log(deleteGameResult);
            console.log(deleteProductResult);
    
            await connection.commit();
            console.log("Commit");
    
            res.status(200).json({ message: "Successfully deleted game" });
        } catch (error) {
            console.error(error);
    
            if (connection) await connection.rollback();
    
            res.status(500).send("Internal Server Error");
        } finally {
            if (connection) {
                connection.release();
                console.log("Connection released");
            }
        }
    }

    public async deleteMerch(req: Request, res: Response): Promise<void> {
        const merchId: string = req.params.id;
        let connection: PoolConnection | undefined = undefined;
    
        try {
            connection = await getConnection();
            await connection.beginTransaction();
            console.log("Begin transaction");
    
            // Fetch the product_id using the merchId
            const merchResult: any = await queryDatabase(connection,
                "SELECT product_id FROM merchandise WHERE id = ?",
                merchId
            );
    
            if (merchResult.length === 0) {
                res.status(404).send("Merchandise not found");
                return;
            }
    
            const productId: any = merchResult[0].product_id;
    
            // Delete from merchandise table
            const deleteMerchResult: ResultSetHeader = await queryDatabase(connection,
                "DELETE FROM merchandise WHERE id = ?",
                merchId
            );
    
            // Delete from product table
            const deleteProductResult: ResultSetHeader = await queryDatabase(connection,
                "DELETE FROM product WHERE id = ?",
                productId
            );
    
            console.log(deleteMerchResult);
            console.log(deleteProductResult);
    
            await connection.commit();
            console.log("Commit");
    
            res.status(200).json({ message: "Successfully deleted merchandise" });
        } catch (error) {
            console.error(error);
    
            if (connection) await connection.rollback();
    
            res.status(500).send("Internal Server Error");
        } finally {
            if (connection) {
                connection.release();
                console.log("Connection released");
            }
        }
    }
}
