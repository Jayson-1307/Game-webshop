import { UserLoginFormModel } from "@shared/formModels/UserLoginFormModel";
import { UserRegisterFormModel } from "@shared/formModels/UserRegisterFormModel";
import { TokenService } from "./TokenService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";

const headers: { "Content-Type": string } = {
    "Content-Type": "application/json",
};

/**
 * Handles user related functionality
 */
export class UserService {
    private _tokenService: TokenService = new TokenService();

    /**
     * Handles user login
     *
     * @param formData - Data to use during login
     *
     * @returns `true` when successful, otherwise `false`.
     */
    public async login(formData: UserLoginFormModel): Promise<boolean> {

        // Send a POST request to the login endpoint with the provided login data
        const response: Response = await fetch(`${viteConfiguration.API_URL}users/login`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
        body: JSON.stringify(formData),
        });

        // If the response is not OK, log the error and return false
        if (!response.ok) {
            console.error(response);
            return false;
        }

        // Parse the response JSON to get the token and userId
        const json: { token: string | undefined; userId: string | undefined } = await response.json();

        // If token and userId are defined, save them and return true
        if (json.token && json.userId !== undefined) {

            // Save the token
            this._tokenService.setToken(json.token);

            // Save the userId in local storage
            localStorage.setItem("userId", json.userId);
            return true;

        }

        // Return false if login was not successful
        return false;

    }

    /**
     * Checks if the provided email already exists in the database.
     *
     * @param email - Email to check
     * @returns `true` if email exists, otherwise `false`.
     */
    public async checkExistingEmail(email: string): Promise<boolean> {

        // Send a POST request to check if the email exists
        const response: Response = await fetch(`${viteConfiguration.API_URL}users/check-email`, {
            method: "post",
            headers: headers,
            body: JSON.stringify({ email }),
        });

        // If the response is not OK, log the error and return false
        if (!response.ok) {
            console.error(response);
            return false;
        }

        // Return true if the email check was successful
        return true;

    }

    /**
     * Handles user registration
     *
     * @param formData - Data to use during registration
     *
     * @returns `true` when successful, otherwise `false`.
     */
    public async register(formData: UserRegisterFormModel): Promise<boolean> {

        // Send a POST request to the registration endpoint with the provided registration data
        const response: Response = await fetch(`${viteConfiguration.API_URL}users/register`, {
            method: "post",
            headers: headers,
            body: JSON.stringify(formData),
        });

        // If the response is not OK, log the error and return false
        if (!response.ok) {
            console.error(response);
            return false;
        }

        // Return true if registration was successful
        return true;

    }

    /**
     * Handles user logout
     *
     * @returns `true` when successful, otherwise `false`.
     */
    public async logout(): Promise<boolean> {

        // Get the token from the TokenService
        const token: string | undefined = this._tokenService.getToken();

        // If there is no token, return false
        if (!token) {
            return false;
        }

        // Send a GET request to the logout endpoint with the token
        const response: Response = await fetch(`${viteConfiguration.API_URL}users/logout`, {
            method: "get",
            headers: { ...headers, authorization: token },
        });

        // If the response is not OK, log the error and return false
        if (!response.ok) {
            console.error(response);
            return false;
        }

        // Return true if logout was successful
        return true;

    }

    /**
     * Updates the password for the user associated with the given email.
     *
     * @param email - The email of the user.
     * @param newPassword - The new password to set.
     * @returns `true` if the password was updated successfully, otherwise `false`.
     */
    public async updatePassword(email: string, newPassword: string): Promise<boolean> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}users/update-password`, {
            method: "post",
            headers: headers,
            body: JSON.stringify({ email, newPassword }),
        });

        if (!response.ok) {
            console.error(response);
            return false;
        }

        return true;
    }

    /**
     * Handles user welcome message containing user and cart data. Requires a valid token.
     *
     * @returns Object with user and cart data when successful, otherwise `undefined`.
     */
    public async getWelcome(): Promise<UserHelloResponse | undefined> {

        // Get the token from the TokenService
        const token: string | undefined = this._tokenService.getToken();

        // If there is no token, return undefined
        if (!token) {
            return undefined;
        }

        // Send a GET request to the hello endpoint with the token
        const response: Response = await fetch(`${viteConfiguration.API_URL}users/hello`, {
            method: "get",
            headers: { ...headers, authorization: token },
        });

        // If the response is not OK, log the error and return undefined
        if (!response.ok) {
            console.error(response);
            return undefined;
        }

        // Return the parsed response JSON as UserHelloResponse
        return (await response.json()) as UserHelloResponse;

    }

    public async getUser(): Promise<any> {
        // Get the token from the TokenService
        const token: string | undefined = this._tokenService.getToken();

        // If there is no token, return undefined
        if (!token) {
            console.error("No token found.");
            return undefined;
        }

        try {
            // Send a GET request to the endpoint for fetching user data with address
            const response: Response = await fetch(`${viteConfiguration.API_URL}users/getUser`, {
                method: "get",
                headers: { ...headers, authorization: token },
            });

            // If the response is not OK, log the error and return undefined
            if (!response.ok) {
                console.error(response);
                return undefined;
            }

            // Return the parsed response JSON
            return await response.json();
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    /**
     * gets authorization level of current user
     *
     * @returns Object with user and cart data when successful, otherwise `undefined`.
     */
    public async getAuthLevel(): Promise<any | undefined> {

        // Get the token from the TokenService
        const token: string | undefined = this._tokenService.getToken();

        // If there is no token, return undefined
        if (!token) {
            return undefined;
        }

        // Send a GET request to the hello endpoint with the token
        const response: Response = await fetch(`${viteConfiguration.API_URL}users/auth-level`, {
            method: "get",
            headers: { ...headers, authorization: token },
        });

        // If the response is not OK, log the error and return undefined
        if (!response.ok) {
            console.error(response);
            return undefined;
        }

        // Return the parsed response JSON as UserHelloResponse
        return (await response.json());

    }

    public async getUserWithAddressDelivery(): Promise<any> {
        // Get the token from the TokenService
        const token: string | undefined = this._tokenService.getToken();

        // If there is no token, return undefined
        if (!token) {
            console.error("No token found.");
            return undefined;
        }

        try {
            // Send a GET request to the endpoint for fetching user data with address
            const response: Response = await fetch(`${viteConfiguration.API_URL}users/userWithAddressDelivery`, {
                method: "get",
                headers: { ...headers, authorization: token },
            });

            // If the response is not OK, log the error and return undefined
            if (!response.ok) {
                console.error(response);
                return undefined;
            }

            // Return the parsed response JSON
            return await response.json();
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    public async addorUpdateDeliveryAddress(addressData: any): Promise<any> {
        // Get the token from the TokenService
        const token: string | undefined = this._tokenService.getToken();
    
        // If there is no token, return undefined
        if (!token) {
            console.error("No token found.");
            return undefined;
        }
    
        try {
            // Send a POST request to the endpoint for adding user address
            const response: Response = await fetch(`${viteConfiguration.API_URL}users/addorUpdateDeliveryAddress`, {
                method: "post",
                headers: { ...headers, authorization: token },
                body: JSON.stringify(addressData), // Provide address data in the request body
            });
    
            // If the response is not OK, log the error and return undefined
            if (!response.ok) {
                console.error(response);
                return undefined;
            }
    
            // Return the parsed response JSON
            return await response.json();
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    public async getUserWithAddressBilling(): Promise<any> {
        // Get the token from the TokenService
        const token: string | undefined = this._tokenService.getToken();

        // If there is no token, return undefined
        if (!token) {
            console.error("No token found.");
            return undefined;
        }

        try {
            // Send a GET request to the endpoint for fetching user data with address
            const response: Response = await fetch(`${viteConfiguration.API_URL}users/getUserWithAddressBilling`, {
                method: "get",
                headers: { ...headers, authorization: token },
            });

            // If the response is not OK, log the error and return undefined
            if (!response.ok) {
                console.error(response);
                return undefined;
            }

            // Return the parsed response JSON
            return await response.json();
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    public async addorUpdateBillingAddress(addressData: any): Promise<any> {
        // Get the token from the TokenService
        const token: string | undefined = this._tokenService.getToken();
    
        // If there is no token, return undefined
        if (!token) {
            console.error("No token found.");
            return undefined;
        }
    
        try {
            // Send a POST request to the endpoint for adding user address
            const response: Response = await fetch(`${viteConfiguration.API_URL}users/addorUpdateBillingAddress`, {
                method: "post",
                headers: { ...headers, authorization: token },
                body: JSON.stringify(addressData), // Provide address data in the request body
            });
    
            // If the response is not OK, log the error and return undefined
            if (!response.ok) {
                console.error(response);
                return undefined;
            }
    
            // Return the parsed response JSON
            return await response.json();
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }
    
    public async getUserBills(id: number): Promise<any> {
        // alert(id);
        const response: Response = await fetch(`${viteConfiguration.API_URL}users/bills/${id}`, {
            method: "get",
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json());
    }

    public async getUserLibrary(id: number): Promise<any> {
        // alert(id);
        const response: Response = await fetch(`${viteConfiguration.API_URL}users/library/${id}`, {
            method: "get",
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json());
    }
   
}
