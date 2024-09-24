import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import { UserData } from "@shared/types";
import { UserLoginFormModel, UserRegisterFormModel } from "@shared/formModels";
import { orderItems } from "../fakeDatabase";
import { CustomJwtPayload } from "../types/jwt";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { getConnection, queryDatabase } from "../services/databaseServices";
import { ProfileData } from "@shared/types/ProfileData";


/**
 * Handles all endpoints related to the User resource
 */
export class UserController {

    /**
     * Check if the provided email already exists in the database
     * 
     * @param req Request object containing the email in the body
     * @param res Response object
     * @returns Sends a response indicating whether the email exists or not
     */
    public async checkExistingEmail(req: Request, res: Response): Promise<void> {

        // Get the email from the request body
        const email: any = req.body.email;

        // Initialize the database connection variable
        let connection: PoolConnection | undefined = undefined;

        try {

            // Get a connection to the database
            connection = await getConnection();

            // Begin a new transaction
            await connection.beginTransaction();
            console.log("Begin transaction");

            // Query to check if the email exists in the database
            const existingUser: any = await queryDatabase(connection,
                "SELECT * FROM users WHERE email = ?",
                email
            );

            // If email exists, send a 400 response
            if (existingUser.length > 0) {
                res.status(400).send("Email already exists.");
                console.log("email already exists");
                return;
            }

            // Commit the transaction if no errors
            await connection.commit();
            console.log("Commit");

            // Send a 200 response if email does not exist
            res.status(200).send("Email does not exist.");

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
    public async register(req: Request, res: Response): Promise<void> {

        // Get the form data from the request body
        const formModel: UserRegisterFormModel = req.body as UserRegisterFormModel;

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
                "user",
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
     * Log in a user by validating their credentials and generating a JWT token
     * 
     * @param req Request object containing the user login form data
     * @param res Response object
     * @returns Sends a response containing the JWT token if successful, or an error message if failed
     */
    public async login(req: Request, res: Response): Promise<void> {

        // Get the form data from the request body
        const formModel: UserLoginFormModel = req.body as UserLoginFormModel;

        if (!formModel.email || !formModel.password) {

            // Send a 400 response if any field is missing
            res.status(400).json({ message: "Email and password are required" });
            return;

        }

        // Initialize the database connection variable
        let connection: PoolConnection | undefined = undefined;

        try {

            // Get a connection to the database
            connection = await getConnection();

            // Begin a new transaction
            await connection.beginTransaction();

            // Query to get user data from the database using the email
            const data: any = await queryDatabase(connection,
                "SELECT * FROM users WHERE email = ?",
                formModel.email
            );

            // Commit the transaction if no errors
            await connection.commit();

            if (data.length > 0) {

                // Compare the provided password with the hashed password in the database
                const passwordMatch: boolean = bcrypt.compareSync(formModel.password, data[0].password);

                if (!passwordMatch) {

                    // Send a 400 response if password is incorrect
                    res.status(400).json({ message: "Incorrect password" });
                    return;

                }

                // Create a JWT token with the user ID
                const payload: CustomJwtPayload = { userId: data[0].id };
                console.log("JWT token", payload);
                const token: string = jwt.sign(payload, process.env.JWT_SECRET_KEY);
                res.json({ token, userId: data[0].id }); // Send the token and user ID as response

            } else {

                // Send a 400 response if user is not found
                res.status(400).json({ message: "User not found" });
                return;

            }

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
            }
        }
    }

    /**
     * Logout a user using a valid JWT token
     *
     * Always returns a 200 signaling success
     *
     * @param _ Request object (unused)
     * @param res Response object
     */
    public logout(_: Request, res: Response): void {

        console.log("logged out here");

        res.json({
            message: "You are logged out.", // Send a 200 response with a logout message
        });
    }

    /**
     * Temporary method to return some data about a user with a valid JWT token
     *
     * Always a returns a 200 with {@link UserHelloResponse} as the body.
     *
     * @param req Request object
     * @param res Response object
     */
    public hello(req: Request, res: Response): void {
        const userData: any = req.user!;
        console.log(userData[0].authorization_level);


        const cartItemNames: string[] | undefined = userData.cart?.map(
            (e: { id: number; }) => orderItems.find((f) => f.id === e.id)!.name
        );

        const response: UserHelloResponse = {
            email: userData[0].email,
            cartItems: cartItemNames,
        };

        console.log(response);

        res.json(response);
    }

    /**
     * Retrieves the profile data for a given user.
     * 
     * @param req - The request object containing the user ID in the URL parameters.
     * @param res - The response object used to send the profile data or an error message.
     * Temporary method to return some data about a user with a valid JWT token
     *
     * Always a returns a 200 with {@link UserHelloResponse} as the body.
     *
     * @param req Request object
     * @param res Response object
     */
    public getAuthLevel(req: Request, res: Response): void {
        const userData: any = req.user!;
        const userAuthLevel: string = userData[0].authorization_level;


        console.log("user auth level = " + userAuthLevel);

        res.json(userAuthLevel);
    }

    /**
     * Add a product to the cart of the user
     *
     * Always returns a 200 with the total number of order items in the cart as the body.
     *
     * @param req Request object
     * @param res Response object
     */
public async getProfile(req: Request, res: Response): Promise<void> {
    const userId: string = req.params.userId;

    let connection: PoolConnection | undefined = undefined;

    try {
        connection = await getConnection();
        await connection.beginTransaction();
        console.log("Begin transaction");

        const userDataResults: any = await queryDatabase(connection, "SELECT username, email, birth_date, phonenumber, authorization_level FROM users WHERE id = ?", userId);

        if (userDataResults.length === 0) {
            console.log("No profile data found for user ID:", userId);
            res.status(404).send("Profile not found.");
            return;
        }

        const userProfile: ProfileData = {
            username: userDataResults[0].username,
            email: userDataResults[0].email,
            authorization_level: userDataResults[0].authorization_level,
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

    public async getUserBills(req: Request, res: Response): Promise<void> {
        console.log("get user bills");    

        // Get the user ID from the request parameters
        const userId: any = req.params.id;

        // Initialize the database connection variable
        let connection: PoolConnection | undefined = undefined;

        try {

            // Get a connection to the database
            connection = await getConnection();

            // Begin a new transaction
            await connection.beginTransaction();
            console.log("Begin transaction");

            // Query to get all bills of the user
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
                WHERE b.user_id = ?`,
                userId
            );


            // Commit the transaction if no errors
            await connection.commit();
            console.log("Commit");
            console.log("print billls: " + bills);

            // Send a 200 response with the bills
            res.status(200).json(bills);

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

    public async getUserLibrary(req: Request, res: Response): Promise<void> {
        const userID: number = parseInt(req.params.id);

        let connection: PoolConnection | undefined = undefined;

        try {
            connection = await getConnection();

            await connection.beginTransaction();
            console.log("Begin transaction");

            const library: any = await queryDatabase(connection,
                `SELECT 
                    library.id AS library_id,
                    library.user_id,
                    library.game_id,
                    users.*,
                    product.*,
                    game.*
                FROM 
                    library
                INNER JOIN users ON library.user_id = users.id
                INNER JOIN product ON library.game_id = product.id
                INNER JOIN game ON product.id = game.product_id
                WHERE library.user_id = ?`,
                userID
            );

            console.log(library);

            await connection.commit();
            console.log("Commit");

            res.status(200).json(library);

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


    

    
    /** Updates the password for a user.
     *
     * @param req Request object containing the email and new password in the body
     * @param res Response object
     * @returns Sends a response indicating the success or failure of the password update
     */
    public async updatePassword(req: Request, res: Response): Promise<void> {
        const formData: any = req.body;

        if (!formData.email || !formData.newPassword) {
            res.status(400).send("Email and new password are required.");
            return;
        }

        let connection: PoolConnection | undefined = undefined;

        try {
            connection = await getConnection();
            await connection.beginTransaction();
            console.log("Begin transaction");

            const hashedPassword: string = bcrypt.hashSync(formData.newPassword, 10);

            const updateUser: ResultSetHeader = await queryDatabase(connection,
                "UPDATE users SET password = ? WHERE email = ?",
                hashedPassword,
                formData.email
            );

            console.log(updateUser);

            if (updateUser.affectedRows === 0) {
                res.status(400).send("Email not found.");
                return;
            }

            await connection.commit();
            console.log("Commit");
            res.status(200).json({ message: "Password updated successfully." });

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

    public async getUser(req: Request, res: Response): Promise<void> {
        const user: any = req.user;
        const userId: any = user[0].id;
    
        let connection: PoolConnection | undefined = undefined;
    
        try {
            connection = await getConnection();
            const userData: any = await queryDatabase(connection,
                "SELECT * FROM users WHERE id = ?",
                userId
            );
    
            if (userData.length > 0) {
                const userWithAddress: any = userData[0];
                // Send the user data with address as response
                res.status(200).json(userWithAddress);
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }

    public async getUserWithAddressDelivery(req: Request, res: Response): Promise<void> {
        const user: any = req.user;
        const userId: any = user[0].id;
    
        let connection: PoolConnection | undefined = undefined;
    
        try {
            connection = await getConnection();
            const userDataWithAddress: any = await queryDatabase(connection,
                "SELECT u.*, a.* FROM users u JOIN address a ON u.id = a.user_id WHERE u.id = ? AND a.type = ?",
                userId,
                "delivery"
            );
    
            if (userDataWithAddress.length > 0) {
                const userWithAddress: any = userDataWithAddress[0];
                res.status(200).json(userWithAddress);
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }

    public async addOrUpdateDeliveryAddress(req: Request, res: Response): Promise<void> {
        const user: any = req.user;
        const userId: any = user[0].id;
        const addressData: any = req.body;
    
        // Validate input data
        if (!addressData.street || !addressData.house_number || !addressData.city || !addressData.zip || !addressData.country) {
            res.status(400).json({ message: "Incomplete address data" });
            return;
        }
    
        let connection: PoolConnection | undefined = undefined;
    
        try {
            connection = await getConnection();
            await connection.beginTransaction();
    
            // Check if the user already has a delivery address
            const existingAddress: any = await queryDatabase(connection,
                "SELECT * FROM address WHERE user_id = ? AND type = ?",
                userId,
                "delivery"
            );
    
            if (existingAddress.length > 0) {
                // If the user has an existing address, update it
                const updateAddress: ResultSetHeader = await queryDatabase(connection,
                    "UPDATE address SET street = ?, house_number = ?, house_number_addition = ?, city = ?, zip = ?, country = ? WHERE user_id = ? AND type = ?",
                    addressData.street,
                    addressData.house_number,
                    addressData.house_number_addition || null,
                    addressData.city,
                    addressData.zip,
                    addressData.country,
                    userId,
                    "delivery",
                );
    
                console.log(updateAddress);
                await connection.commit();
                res.status(200).json({ message: "Delivery address updated successfully" });
            } else {
                // If the user doesn't have an existing address, insert a new one
                const insertAddress: ResultSetHeader = await queryDatabase(connection,
                    "INSERT INTO address (user_id, street, house_number, house_number_addition, city, zip, country, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    userId,
                    addressData.street,
                    addressData.house_number,
                    addressData.house_number_addition || null,
                    addressData.city,
                    addressData.zip,
                    addressData.country,
                    "delivery"
                );
    
                console.log(insertAddress);
                await connection.commit();
                res.status(200).json({ message: "Delivery address added successfully" });
            }
        } catch (error) {
            console.error(error);
            if (connection) await connection.rollback();
            res.status(500).json({ message: "Internal Server Error" });
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }

    public async getUserWithAddressBilling(req: Request, res: Response): Promise<void> {
        const user: any = req.user;
        const userId: any = user[0].id;
    
        let connection: PoolConnection | undefined = undefined;
    
        try {
            connection = await getConnection();
            const userDataWithAddress: any = await queryDatabase(connection,
                "SELECT u.*, a.* FROM users u JOIN address a ON u.id = a.user_id WHERE u.id = ? AND a.type = ?",
                userId,
                "billing"
            );
    
            if (userDataWithAddress.length > 0) {
                const userWithAddress: any = userDataWithAddress[0];
                res.status(200).json(userWithAddress);
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }

    public async addorUpdateBillingAddress(req: Request, res: Response): Promise<void> {
        const user: any = req.user;
        const userId: any = user[0].id;
        const addressData: any = req.body;
    
        // Validate input data
        if (!addressData.street || !addressData.house_number || !addressData.city || !addressData.zip || !addressData.country) {
            res.status(400).json({ message: "Incomplete address data" });
            return;
        }
    
        let connection: PoolConnection | undefined = undefined;
    
        try {
            connection = await getConnection();
            await connection.beginTransaction();
    
            // Check if the user already has a delivery address
            const existingAddress: any = await queryDatabase(connection,
                "SELECT * FROM address WHERE user_id = ? AND type = ?",
                userId,
                "billing"
            );
    
            if (existingAddress.length > 0) {
                // If the user has an existing address, update it
                const updateAddress: ResultSetHeader = await queryDatabase(connection,
                    "UPDATE address SET street = ?, house_number = ?, house_number_addition = ?, city = ?, zip = ?, country = ? WHERE user_id = ? AND type = ?",
                    addressData.street,
                    addressData.house_number,
                    addressData.house_number_addition || null,
                    addressData.city,
                    addressData.zip,
                    addressData.country,
                    userId,
                    "billing",
                );
    
                console.log(updateAddress);
                await connection.commit();
                res.status(200).json({ message: "Delivery address updated successfully" });
            } else {
                // If the user doesn't have an existing address, insert a new one
                const insertAddress: ResultSetHeader = await queryDatabase(connection,
                    "INSERT INTO address (user_id, street, house_number, house_number_addition, city, zip, country, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    userId,
                    addressData.street,
                    addressData.house_number,
                    addressData.house_number_addition || null,
                    addressData.city,
                    addressData.zip,
                    addressData.country,
                    "billing"
                );
    
                console.log(insertAddress);
                await connection.commit();
                res.status(200).json({ message: "Delivery address added successfully" });
            }
        } catch (error) {
            console.error(error);
            if (connection) await connection.rollback();
            res.status(500).json({ message: "Internal Server Error" });
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }
    

 /**
     * Updates the profile data of a given user.
     * 
     * @param req - The request object containing the user ID in the URL parameters and the new profile data in the body.
     * @param res - The response object used to send a success message or an error message.
     */
 public async updateProfile(req: Request, res: Response): Promise<void> {
    const userId: string = req.params.userId;
    const { username, email }: ProfileData = req.body;

    // Validate input
    if (!username || !email) {
        res.status(400).send("Username and email are required.");
        return;
    }

    let connection: PoolConnection | undefined = undefined;

    try {
        console.log("Received update request for user ID:", userId);
        console.log("Update data:", { username, email});

        connection = await getConnection();
        await connection.beginTransaction();
        console.log("Begin transaction");

        const updateResult: any = await queryDatabase(
            connection,
            "UPDATE users SET username = ?, email = ? WHERE id = ?",
            username, email, userId
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

/**
 * Deletes the profile of a given user.
 * 
 * @param req - The request object containing the user ID in the URL parameters.
 * @param res - The response object used to send a success message or an error message.
 */
public async deleteProfile(req: Request, res: Response): Promise<void> {
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
}




