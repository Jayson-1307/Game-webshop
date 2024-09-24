import { Request, Response } from "express";
import { orderItems } from "../fakeDatabase";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { getConnection, queryDatabase } from "../services/databaseServices";
import { CustomJwtPayload } from "../types/jwt";
import jwt from "jsonwebtoken";
// import { arrayBuffer } from "stream/consumers";

/**
 * Handles all endpoints related to the Order Item resource
 */
export class OrderItemController {

    /**
     * Get all order items
     * 
     * @param _ Request object (unused)
     * @param res Response object
     */
    public getAll(_: Request, res: Response): void {

        // Return all order items from the fake database
        res.json(orderItems);

    }

    /**
     * Get all games from the database with an inner join with the product table.
     * 
     * @param req Request object
     * @param res Response object
     */
    public async getAllGames(req: Request, res: Response): Promise<void> {
        const sortby: any = req.params.sort;
        const order: any = req.params.order;
    
        console.log(sortby, order);
    
        const sortByQuery: any = sortby ? `ORDER BY ${sortby} ${order}` : "";
    
        // Initialize database connection
        let connection: PoolConnection | undefined = undefined;
    
        try {
            // Get a database connection
            connection = await getConnection();
    
            // Begin a transaction
            await connection.beginTransaction();
            console.log("Begin transaction");
    
            // Base query to retrieve all games with product details using inner join
            let query:any = "SELECT g.*, p.name AS name, p.thumbnail AS thumbnail, p.price AS price, p.status AS status, p.created_at AS date, p.status AS status FROM game g INNER JOIN product p ON g.product_id = p.id WHERE status = 'active'";
    
            // Append the sorting query if it exists
            if (sortByQuery) {
                query += ` ${sortByQuery}`;
            }
    
            console.log("Final query:", query);
    
            // Query to retrieve all games with product details using inner join
            const games: any = await queryDatabase(connection, query);
    
            // Commit the transaction
            await connection.commit();
            console.log("Commit");
    
            // Send a 200 response with retrieved games
            res.status(200).json(games);
    
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

    /**
     * Get all games from the database with an inner join with the product table.
     * 
     * @param req Request object
     * @param res Response object
     */
    public async getAllMerch(_req: Request, res: Response): Promise<void> {

        // Initialize database connection
        let connection: PoolConnection | undefined = undefined;

        try {

            // Get a database connection
            connection = await getConnection();


            // Begin a transaction
            await connection.beginTransaction();
            console.log("Begin transaction");

            // Query to retrieve all games with product details using inner join
            const merchandise: any = await queryDatabase(connection,
                "SELECT m.*, p.name AS name, p.thumbnail AS thumbnail, p.price AS price, p.status AS status FROM merchandise m INNER JOIN product p ON m.product_id = p.id WHERE status = 'active'"
            );

            // Commit the transaction
            await connection.commit();
            console.log("Commit");

            //Send a 200 response with retrieved games
            res.status(200).json(merchandise);

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

    /**
     * Get a specific game by its ID from the database with product details
     * 
     * @param req Request object
     * @param res Response object
     * @returns Sends the game details or a 404 error if not found
     */
    public async getGameById(req: Request, res: Response): Promise<void> {

        // Initialize database connection
        let connection: PoolConnection | undefined = undefined;

        try {

            // Get a database connection
            connection = await getConnection();

            // Get the game ID from the request parameters
            const gameId: string = req.params.id;

            // Query to retrieve a game by its ID with product details using inner join
            const game: any = await queryDatabase(connection,
                "SELECT g.*, p.name AS name, p.thumbnail AS thumbnail, p.id AS product_id , p.price AS price FROM game g INNER JOIN product p ON g.product_id = p.id WHERE g.id = ?",
                gameId);

            // If game not found, return 404
            if (game.length === 0) {
                res.status(404).send("Game not found");
                return;
            }

            // Send response 200 with retrieved game
            res.status(200).json(game[0]);

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

    /**
 * Get a specific merchandise by its ID from the database with product details
 * 
 * @param req Request object
 * @param res Response object
 * @returns Sends the merchandise details or a 404 error if not found
 */
public async getMerchById(req: Request, res: Response): Promise<void> {

    // Initialize database connection
    let connection: PoolConnection | undefined = undefined;

    try {

        // Get a database connection
        connection = await getConnection();

        // Get the merchandise ID from the request parameters
        const merchandiseId: string = req.params.id;
        console.log(merchandiseId);

        // Query to retrieve merchandise by its ID with product details using inner join
        const merchandise: any = await queryDatabase(connection,
            "SELECT m.*, p.name AS name, p.thumbnail AS thumbnail, p.id AS product_id, p.item_type AS item_type, p.price AS price FROM merchandise m INNER JOIN product p ON m.product_id = p.id WHERE m.id = ?",
            merchandiseId);

        // If merchandise not found, return 404
        if (merchandise.length === 0) {
            res.status(404).send("Merchandise not found");
            return;
        }

        // Send response 200 with retrieved merchandise
        res.status(200).json(merchandise[0]);

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

    /**
     * Get four random games from the database with an inner join with the product table.
     * 
     * @param req Request object
     * @param res Response object
     */
    public async getFourRandomGames(_req: Request, res: Response): Promise<void> {

        // Initialize database connection
        let connection: PoolConnection | undefined = undefined;

        try {

            // Get a database connection
            connection = await getConnection();

            // Begin a transaction
            await connection.beginTransaction();
            console.log("Begin transaction");

            // Query to retrieve four random games with product details using inner join
            const games: any = await queryDatabase(connection,
                "SELECT g.*, p.name AS name, p.thumbnail AS thumbnail, p.price AS price FROM game g INNER JOIN product p ON g.product_id = p.id ORDER BY RAND() LIMIT 4"
            );

            // Commit the transaction
            await connection.commit();
            console.log("Commit");

            // Return the retrieved games
            res.status(200).json(games);
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

    /**
     * Get four random games from the database with an inner join with the product table.
     * 
     * @param req Request object
     * @param res Response object
     */
    public async getThreeRelatedItems(req: Request, res: Response): Promise<void> {

        // Initialize database connection
        let connection: PoolConnection | undefined = undefined;
        let merch_type: string = req.params.merchType ;

        if (merch_type === "t") {
            merch_type = "t-shirts";
        }
        console.log("merch type", merch_type);
        const merchId: any = req.params.merchId;

        try {

            // Get a database connection
            connection = await getConnection();

            // Begin a transaction
            await connection.beginTransaction();
            console.log("Begin transaction");

            // Query to retrieve four random games with product details using inner join
            const relatedItems: any = await queryDatabase(connection,
                "SELECT m.*, p.name AS name, p.thumbnail AS thumbnail, p.price AS price FROM merchandise m INNER JOIN product p ON m.product_id = p.id WHERE type = ? AND m.id != ? ORDER BY Rand() LIMIT 3", 
                merch_type, merchId
            );

            console.log("related items "+relatedItems);

            // Commit the transaction
            await connection.commit();
            console.log("Commit");

            // Return the retrieved games
            res.status(200).json(relatedItems);
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

    /**
     * Get four random games from the database with an inner join with the product table.
     * 
     * @param req Request object
     * @param res Response object
     */
    public async getThreeRandomMerch(_req: Request, res: Response): Promise<void> {

        // Initialize database connection
        let connection: PoolConnection | undefined = undefined;

        try {

            // Get a database connection
            connection = await getConnection();

            // Begin a transaction
            await connection.beginTransaction();
            console.log("Begin transaction");

            // Query to retrieve four random games with product details using inner join
            const games: any = await queryDatabase(connection,
                "SELECT m.*, p.name AS name, p.thumbnail AS thumbnail, p.price AS price FROM merchandise m INNER JOIN product p ON m.product_id = p.id ORDER BY RAND() LIMIT 3"
            );

            // Commit the transaction
            await connection.commit();
            console.log("Commit");

            // Return the retrieved games
            res.status(200).json(games);
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



    /**
     * Add a product to the cart of the user
     *
     * Always returns a 200 with the total number of order items in the cart as the body.
     *
     * @param req Request object
     * @param res Response object
     */
    public async addOrderItemToCart(req: Request, res: Response): Promise<void> {

        const productId: number = Number(req.params.productId); // Get the item ID from the request parameters
        const userData: any = req.user;
        const userId: number = userData[0].id;

        // Initialize the database connection variable
        let connection: PoolConnection | undefined = undefined;

        try {

            // Get a connection to the database
            connection = await getConnection();

            // Begin a new transaction
            await connection.beginTransaction();
            console.log("Begin transaction");

            // Check if the product is already in the user's cart
            const getProdctType: any = await queryDatabase(connection,
                "SELECT item_type FROM product WHERE id = ?;",
                productId
            );

            // Check if the product is already in the user's cart
            const existingCartItem: any = await queryDatabase(connection,
                "SELECT * FROM cart_item WHERE userId = ? AND productId = ?",
                userId,
                productId
            );

            if (existingCartItem.length > 0) {

                const itemTypeValue: any = getProdctType[0].item_type;

                if (itemTypeValue === "merchandise") {
                    // If the product is already in the cart and it's merchandise, update the quantity
                    const updateCartItem: ResultSetHeader = await queryDatabase(connection,
                        "UPDATE cart_item SET quantity = quantity + 1 WHERE userId = ? AND productId = ?",
                        userId,
                        productId
                    );

                    console.log(updateCartItem);
                } else {

                    res.status(200).json({ success: false, message: "Games can only be added once to the cart." });
                    return;

                }

            } else {

                // If the product is not in the cart, insert a new record
                const addCartItem: ResultSetHeader = await queryDatabase(connection,
                    "INSERT INTO cart_item (userId, productId, quantity) VALUES (?, ?, ?)",
                    userId,
                    productId,
                    1
                );

                console.log(addCartItem);

            }

            const updatedCartItems: any = await queryDatabase(connection, "SELECT * FROM cart_item WHERE userId = ?", userId);
            const cartItems: any = updatedCartItems.map((item: any) => ({ id: item.productId, quantity: item.quantity }));
            const payload: CustomJwtPayload = {
                userId,
                cart: cartItems
            };

            const token: string = jwt.sign(payload, process.env.JWT_SECRET_KEY);

            console.log("dit is", payload, "met token", token);


            // Commit the transaction if no errors
            await connection.commit();
            console.log("Commit");

            // Send a 200 response if successful
            res.status(200).json({ message: "Successfully added product to cart." });

        } catch (error) {

            console.error(error);

            /// Rollback the transaction in case of error
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


    public async addQuantityInCart(req: Request, res: Response): Promise<void> {

        const productId: number = Number(req.params.productId);
        const userData: any = req.user;
        const userId: number = userData[0].id;

        let connection: PoolConnection | undefined = undefined;

        try {

            connection = await getConnection();

            await connection.beginTransaction();
            console.log("Begin transaction");


            const updateCartItem: ResultSetHeader = await queryDatabase(connection,
                "UPDATE cart_item SET quantity = quantity + 1 WHERE userId = ? AND productId = ?",
                userId,
                productId
            );

            console.log(updateCartItem);

            const updatedCartItems: any = await queryDatabase(connection, "SELECT * FROM cart_item WHERE userId = ?", userId);
            const cartItems: any = updatedCartItems.map((item: any) => ({ id: item.productId, quantity: item.quantity }));
            const payload: CustomJwtPayload = {
                userId,
                cart: cartItems
            };

            const token: string = jwt.sign(payload, process.env.JWT_SECRET_KEY);

            console.log("dit is", payload, "met token", token);


            // Commit the transaction if no errors
            await connection.commit();
            console.log("Commit");

            // Send a 200 response if successful
            res.status(200).json(updatedCartItems);

        } catch (error) {

            console.error(error);

            /// Rollback the transaction in case of error
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

    public async subQuantityInCart(req: Request, res: Response): Promise<void> {

        const productId: number = Number(req.params.productId);
        const userData: any = req.user;
        const userId: number = userData[0].id;

        let connection: PoolConnection | undefined = undefined;

        try {

            connection = await getConnection();

            await connection.beginTransaction();
            console.log("Begin transaction");


            const updateCartItem: ResultSetHeader = await queryDatabase(connection,
                "UPDATE cart_item SET quantity = quantity - 1 WHERE userId = ? AND productId = ?",
                userId,
                productId
            );

            console.log(updateCartItem);

            const updatedCartItems: any = await queryDatabase(connection, "SELECT * FROM cart_item WHERE userId = ?", userId);
            const cartItems: any = updatedCartItems.map((item: any) => ({ id: item.productId, quantity: item.quantity }));
            const payload: CustomJwtPayload = {
                userId,
                cart: cartItems
            };

            const token: string = jwt.sign(payload, process.env.JWT_SECRET_KEY);

            console.log("dit is", payload, "met token", token);


            // Commit the transaction if no errors
            await connection.commit();
            console.log("Commit");

            // Send a 200 response if successful
            res.status(200).json(updatedCartItems);

        } catch (error) {

            console.error(error);

            /// Rollback the transaction in case of error
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

    public async showUserCartItems(req: Request, res: Response): Promise<void> {

        const userData: any = req.user;
        const userId: number = userData[0].id;

        // Initialize the database connection variable
        let connection: PoolConnection | undefined = undefined;

        try {

            // Get a connection to the database
            connection = await getConnection();

            // Begin a new transaction
            await connection.beginTransaction();
            console.log("Begin transaction");

            const showUserCartItems: any = await queryDatabase(connection,
                "SELECT ci.id, ci.productId, ci.quantity, ci.added_at, p.name AS productName, p.thumbnail, p.price, p.item_type FROM cart_item ci JOIN product p ON ci.productId = p.id WHERE ci.userId = ?",
                userId,
            );

            await connection.commit();
            console.log("Commit");

            res.status(200).json(showUserCartItems);

        } catch (error) {

            console.error(error);

            /// Rollback the transaction in case of error
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

    public async deleteUserCartItem(req: Request, res: Response): Promise<void> {

        const productId: number = Number(req.params.productId);
        const userData: any = req.user;
        const userId: number = userData[0].id;

        let connection: PoolConnection | undefined = undefined;

        try {

            connection = await getConnection();

            await connection.beginTransaction();
            console.log("Begin transaction");


            const deleteCartItem: ResultSetHeader = await queryDatabase(connection,
                "DELETE FROM cart_item WHERE userId = ? AND productId = ?",
                userId,
                productId
            );

            console.log(deleteCartItem);

            const deleteCartItems: any = await queryDatabase(connection, "SELECT * FROM cart_item WHERE userId = ?", userId);
            const cartItems: any = deleteCartItems.map((item: any) => ({ id: item.productId, quantity: item.quantity }));
            const payload: CustomJwtPayload = {
                userId,
                cart: cartItems
            };

            const token: string = jwt.sign(payload, process.env.JWT_SECRET_KEY);

            console.log("dit is", payload, "met token", token);


            // Commit the transaction if no errors
            await connection.commit();
            console.log("Commit");

            // Send a 200 response if successful
            res.status(200).json(deleteCartItems);

        } catch (error) {

            console.error(error);

            /// Rollback the transaction in case of error
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
     * Create a new bill and add products to bill_products
     *
     * @param req Request object
     * @param res Response object
     */
    public async createBillAndAddProducts(req: Request, res: Response): Promise<void> {
        const userData: any = req.user;
        const userId: number = userData[0].id;
        const billData: any = req.body;

        console.log("billdata uit form", billData);
        console.log(billData);

        let connection: PoolConnection | undefined = undefined;

        try {
            connection = await getConnection();
            await connection.beginTransaction();
            console.log("Begin transaction");

            // Insert new bill into the bill table
            const result: ResultSetHeader = await queryDatabase(connection,
                "INSERT INTO bill (user_id, shipping_street, shipping_house_number, shipping_house_number_addition, shipping_zip, shipping_city, shipping_country, billing_street, billing_house_number, billing_house_number_addition, billing_zip, billing_city, billing_country, total_price_excl_VAT, VAT_price, total_price_incl_VAT) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                userId, billData.shipping_street, billData.shipping_house_number, billData.shipping_house_number_addition, billData.shipping_zip, billData.shipping_city, billData.shipping_country, billData.billing_street, billData.billing_house_number, billData.billing_street_addition, billData.billing_zip, billData.billing_city, billData.billing_country, billData.total_price_excl_VAT, billData.VAT_price, billData.total_price_incl_VAT
            );

            const billId: number = result.insertId;

            // Retrieve all items from the user's cart
            const cartItems: any = await queryDatabase(connection,
                "SELECT ci.*, p.name AS product_name, p.price AS product_price FROM cart_item ci JOIN product p ON ci.productId = p.id WHERE ci.userId = ?",
                userId
            );

            if (cartItems.length === 0) {
                res.status(400).json({ message: "No items in cart" });
                return;
            }

            // Insert each cart item into the bill_products table
            for (const product of cartItems) {
                await queryDatabase(connection,
                    "INSERT INTO bill_products (bill_id, product_title, product_price, quantity) VALUES (?, ?, ?, ?)",
                    billId, product.product_name, product.product_price, product.quantity
                );
            }

            await connection.commit();
            console.log("Commit");

            res.status(200).json({ message: "Successfully created bill and added products.", billId });

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

    /**
    * Get bill data with user information and bill products based on bill ID
    * 
    * @param req Request object
    * @param res Response object
    */
    public async getBillData(req: Request, res: Response): Promise<void> {
        // Extract the bill ID from the request parameters
        const billId: number = Number(req.params.billId);

        // Initialize database connection
        let connection: PoolConnection | undefined = undefined;

        try {
            // Get a connection to the database
            connection = await getConnection();

            // Begin a new transaction
            await connection.beginTransaction();
            console.log("Begin transaction");

            // Query to retrieve bill data with user information and bill products based on bill ID
            const billData: any = await queryDatabase(connection,
                `
        SELECT 
            b.id AS bill_id,
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
            b.VAT_price,
            b.total_price_incl_VAT,
            u.username,
            u.first_name,
            u.last_name,
            u.email,
            bp.product_title,
            bp.product_price,
            bp.quantity
        FROM 
            bill b
            JOIN users u ON b.user_id = u.id
            JOIN bill_products bp ON b.id = bp.bill_id
        WHERE 
            b.id = ?
        `,
                billId
            );

            // Commit the transaction
            await connection.commit();
            console.log("Commit");

            // Send response with retrieved bill data
            res.status(200).json(billData);

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


    /**
 * Add a game to the user's library
 *
 * @param req Request object
 * @param res Response object
 */
    public async addGameToLibrary(req: Request, res: Response): Promise<void> {
        const gameId: number = Number(req.params.gameId); // Get the game ID from the request parameters
        const userData: any = req.user;
        const userId: number = userData[0].id;

        // Initialize the database connection variable
        let connection: PoolConnection | undefined = undefined;

        try {
            // Get a connection to the database
            connection = await getConnection();

            // Begin a new transaction
            await connection.beginTransaction();
            console.log("Begin transaction");

            // Check if the game is already in the user's library
            const existingLibraryItem: any = await queryDatabase(connection,
                "SELECT * FROM library WHERE user_id = ? AND game_id = ?",
                userId,
                gameId
            );

            if (existingLibraryItem.length > 0) {
                // If the game is already in the library, send a 400 response
                res.status(400).json({ success: false, message: "Game is already in the library." });
                return;
            }

            // If the game is not in the library, insert a new record
            const addLibraryItem: ResultSetHeader = await queryDatabase(connection,
                "INSERT INTO library (user_id, game_id) VALUES (?, ?)",
                userId,
                gameId
            );

            console.log(addLibraryItem);

            // Commit the transaction if no errors
            await connection.commit();
            console.log("Commit");

            // Send a 200 response if successful
            res.status(200).json({ message: "Successfully added game to library." });

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

    public async deleteAllUserCartItems(req: Request, res: Response): Promise<void> {

        const userData: any = req.user;
        const userId: number = userData[0].id;

        let connection: PoolConnection | undefined = undefined;

        try {

            connection = await getConnection();

            await connection.beginTransaction();
            console.log("Begin transaction");


            const deleteCartItem: ResultSetHeader = await queryDatabase(connection,
                "DELETE FROM cart_item WHERE userId = ?",
                userId,
            );

            console.log(deleteCartItem);

            const deleteCartItems: any = await queryDatabase(connection, "SELECT * FROM cart_item WHERE userId = ?", userId);
            const cartItems: any = deleteCartItems.map((item: any) => ({ id: item.productId, quantity: item.quantity }));
            const payload: CustomJwtPayload = {
                userId,
                cart: cartItems
            };

            const token: string = jwt.sign(payload, process.env.JWT_SECRET_KEY);

            console.log("dit is", payload, "met token", token);


            // Commit the transaction if no errors
            await connection.commit();
            console.log("Commit");

            // Send a 200 response if successful
            res.status(200).json(deleteCartItems);

        } catch (error) {

            console.error(error);

            /// Rollback the transaction in case of error
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
    * Check if a game is already in the user's library
    * 
    * @param req Request object
    * @param res Response object
    */
    public async isGameInLibrary(req: Request, res: Response): Promise<void> {
        const gameId: number = Number(req.params.gameId);
        const userData: any = req.user;
        const userId: number = userData[0].id;

        // Initialize the database connection variable
        let connection: PoolConnection | undefined = undefined;

        try {
            // Get a connection to the database
            connection = await getConnection();

            // Begin a new transaction
            await connection.beginTransaction();
            console.log("Begin transaction");

            // Check if the game is already in the user's library
            const existingLibraryItem: any = await queryDatabase(connection,
                "SELECT * FROM library WHERE user_id = ? AND game_id = ?",
                userId,
                gameId
            );

            // Commit the transaction if no errors
            await connection.commit();
            console.log("Commit");

            // Send a response indicating whether the game is in the library or not
            res.status(200).json({ isInLibrary: existingLibraryItem.length > 0 });

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
    
}

