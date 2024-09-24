import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomJwtToken } from "../types/jwt";
import { getConnection, queryDatabase } from "../services/databaseServices";
import { PoolConnection } from "mysql2/promise";

/**
 * Handles token-based authentication. If the token is valid, the user object is added to the request object.
 * If the token is invalid, a 401 error is returned.
 *
 * @param req - Request object
 * @param res - Response object
 *
 * @returns NextFunction | Status 401
 */
export async function handleTokenBasedAuthentication(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<NextFunction | void> {

    // Get the token from the request headers
    const authenticationToken: string | undefined = req.headers["authorization"];

    // Check if there is a token
    if (!authenticationToken) {

        // Send a 401 response if the token is missing
        res.status(401).send("Unauthorized");
        return;

    }

    // Check if the token is valid
    let jwtToken: CustomJwtToken | undefined;

    try {

        // Verify the token using the secret key
        jwtToken = jwt.verify(authenticationToken, process.env.JWT_SECRET_KEY) as CustomJwtToken;

    } catch (error) {

        console.error(error);

    }

    // Token is missing user ID
    if (!jwtToken || !jwtToken.userId) {

        // Send a 401 response if the token is invalid or user ID is missing
        res.status(401).send("Unauthorized");
        return;
    }

    console.log("start connection");

    // Initialize the database connection variable
    let connection: PoolConnection | undefined = undefined;

    // Retrieve user from the database using the user ID from the token
    try {

        // Get a connection to the database
        connection = await getConnection();

        // Begin a new transaction
        await connection.beginTransaction();
        console.log("Begin transaction");

        // Query to get user data from the database using the user ID from the token
        const userData: any = await queryDatabase(connection,
            "SELECT * FROM users WHERE id = ?",
            jwtToken.userId
        );

        // Commit the transaction if no errors
        await connection.commit();
        console.log("Commit");

        // User not found in the database
        if (!userData) {

            // Send a 401 response if user is not found
            res.status(401).send("Unauthorized");
            return;

        }

        // Add user object to the request for further processing
        req.user = userData;

        // Call the next middleware function
        next();

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