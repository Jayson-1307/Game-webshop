import { OrderItem } from "@shared/types";
import { TokenService } from "./TokenService";

const headers: { "Content-Type": string } = {
    "Content-Type": "application/json",
};

/**
 * Handles order item related functionality
 */
export class OrderItemService {

    private _tokenService: TokenService = new TokenService();

    /**
     * Get all order items
     * 
     * @returns A list of all order items when successful, otherwise `undefined`.
     */
    public async getAll(): Promise<OrderItem[] | undefined> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}orderItems`, {
            method: "get",
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json()) as OrderItem[];
    }

    /**
     * Get all order items
     * 
     * @returns A list of all order items when successful, otherwise `undefined`.
     */
    public async getAllGames(sort:string, order:string): Promise<any> {
        console.log(sort, order);
        const response: Response = await fetch(`${viteConfiguration.API_URL}game-overview/${sort}/${order}`, {
            method: "get",
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json());
    }

    /**
     * Get all order items
     * 
     * @returns A list of all order items when successful, otherwise `undefined`.
     */
    public async getAllMerch(): Promise<any> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}merch-overview`, {
            method: "get",
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json());
    }

    /**
    * Get all order items
    * 
    * @returns A list of all order items when successful, otherwise `undefined`.
    */
    public async getGameById(id: string): Promise<any> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}game-detail/${id}`, {
            method: "get",
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json());
    }

    /**
    * Get all order items
    * 
    * @returns A list of all order items when successful, otherwise `undefined`.
    */
    public async getMerchById(id: string): Promise<any> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}getMerch/${id}`, {
            method: "get",
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json());
    }


    /**
     * Get all order items
     * 
     * @returns A list of all order items when successful, otherwise `undefined`.
     */
    public async getFourRandomGames(): Promise<any> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}home-games`, {
            method: "get",
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json());
    }


    public async getThreeRelatedItems(_merchType: string, merchId:string): Promise<any[]> {
        try {
            const response: Response = await fetch(`${viteConfiguration.API_URL}related-items/${_merchType}-${merchId}`, {
                method: "get",
            });

            if (!response.ok) {
                console.error("Failed to fetch related items:", response.statusText);
                return [];
            }

            const items: any = await response.json();
            console.log("Fetched items:", items);

            // Ensure only three items are returned
            return items.slice(0, 3);
        } catch (error) {
            console.error("Error fetching related items:", error);
            return [];
        }
    }

    /**
     * Voegt een orderitem toe aan de winkelwagen van de gebruiker.
     * @param userId Het ID van de gebruiker.
     * @param productId Het ID van het product dat aan de winkelwagen moet worden toegevoegd.
     * @returns Het aantal items in de winkelwagen na toevoeging, of undefined als er een fout optreedt.
     */
    public async addOrderItemToCart(productId: number): Promise<boolean> {
        // Get the token from the TokenService
        const token: string | undefined = this._tokenService.getToken();

        // If there is no token, return false
        if (!token) {
            return false;
        }

        // Send a POST request to the add-to-cart endpoint with the token
        const response: Response = await fetch(`${viteConfiguration.API_URL}users/add-to-cart/${productId}`, {
            method: "post",
            headers: { ...headers, authorization: token },
        });

        // If the response is not OK, log the error and return false
        if (!response.ok) {
            console.error(response);
            return false;
        }

        // Parse the JSON response
        const responseData: any = await response.json();

        // If the response contains success false, return false
        if (responseData.success === false) {
            return false;
        }

        // Otherwise, return true to indicate success
        return true;
    }

    public async addQuantityInCart(productId: number): Promise<number | undefined> {

        // Get the token from the TokenService
        const token: string | undefined = this._tokenService.getToken();

        // If there is no token, return undefined
        if (!token) {
            return undefined;
        }

        // Send a POST request to the add-to-cart endpoint with the token
        const response: Response = await fetch(`${viteConfiguration.API_URL}users/add-in-cart/${productId}`, {
            method: "post",
            headers: { ...headers, authorization: token },
        });

        // If the response is not OK, log the error and return undefined
        if (!response.ok) {
            console.error(response);
            return undefined;
        }

        // Return the parsed response JSON as the number of items in the cart
        return (await response.json());
    }


    public async subQuantityInCart(productId: number): Promise<number | undefined> {

        // Get the token from the TokenService
        const token: string | undefined = this._tokenService.getToken();

        // If there is no token, return undefined
        if (!token) {
            return undefined;
        }

        // Send a POST request to the add-to-cart endpoint with the token
        const response: Response = await fetch(`${viteConfiguration.API_URL}users/sub-in-cart/${productId}`, {
            method: "post",
            headers: { ...headers, authorization: token },
        });

        // If the response is not OK, log the error and return undefined
        if (!response.ok) {
            console.error(response);
            return undefined;
        }

        // Return the parsed response JSON as the number of items in the cart
        return response.json();
    }

    public async showUserCartItems(): Promise<number | undefined> {

        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return undefined;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}users/show-cart`, {
            method: "get",
            headers: { ...headers, authorization: token },
        });

        if (!response.ok) {
            console.error(response);
            return undefined;
        }

        return (await response.json());
    }


    /**
    * Handles user logout
    *
    * @returns `true` when successful, otherwise `false`.
    */
    public async deleteUserCartItem(productId: number): Promise<boolean> {

        // Get the token from the TokenService
        const token: string | undefined = this._tokenService.getToken();

        // If there is no token, return false
        if (!token) {
            return false;
        }

        // Send a GET request to the logout endpoint with the token
        const response: Response = await fetch(`${viteConfiguration.API_URL}users/delete-in-cart/${productId}`, {
            method: "delete",
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

    public async addCartItemsToBillProducts(billData: any): Promise<number | null> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return null;
        }

        try {
            const response: Response = await fetch(`${viteConfiguration.API_URL}users/bill/createBillAndAddProducts`, {
                method: "post",
                headers: { ...headers, authorization: token },
                body: JSON.stringify(billData),
            });

            if (!response.ok) {
                console.error(response);
                return null;
            }

            const responseData: any = await response.json();
            const billId: number = responseData.billId;

            return billId;
        } catch (error) {
            console.error("Error adding cart items to bill_products:", error);
            return null;
        }
    }

    public async getBillData(billId: number | null): Promise<any> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return undefined;
        }

        try {
            const response: Response = await fetch(`${viteConfiguration.API_URL}users/bill/${billId}`, {
                method: "get",
                headers: { ...headers, authorization: token },
            });

            if (!response.ok) {
                console.error(response);
                return undefined;
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching bill data:", error);
            return undefined;
        }
    }

    /**
     * Voegt een game toe aan de bibliotheek van de gebruiker.
     * @param gameId Het ID van het spel dat aan de bibliotheek moet worden toegevoegd.
     * @returns `true` als het spel succesvol aan de bibliotheek is toegevoegd, anders `false`.
     */
    public async addGameToLibrary(gameId: number): Promise<boolean> {
        // Get the token from the TokenService
        const token: string | undefined = this._tokenService.getToken();

        // If there is no token, return false
        if (!token) {
            return false;
        }

        // Send a POST request to the add-to-library endpoint with the token and game ID
        const response: Response = await fetch(`${viteConfiguration.API_URL}users/add-to-library/${gameId}`, {
            method: "post",
            headers: { ...headers, authorization: token },
        });

        // If the response is not OK, log the error and return false
        if (!response.ok) {
            console.error(response);
            return false;
        }

        // Parse the JSON response
        const responseData: any = await response.json();

        // If the response contains success false, return false
        if (responseData.success === false) {
            return false;
        }

        // Otherwise, return true to indicate success
        return true;
    }

    public async deleteAllUserCartItems(): Promise<boolean> {

        // Get the token from the TokenService
        const token: string | undefined = this._tokenService.getToken();

        // If there is no token, return false
        if (!token) {
            return false;
        }

        // Send a GET request to the logout endpoint with the token
        const response: Response = await fetch(`${viteConfiguration.API_URL}users/delete-all-user-cart-items`, {
            method: "delete",
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
     * Check if a game is already in the user's library
     * 
     * @param gameId The ID of the game to check
     * @returns True if the game is in the library, false otherwise
     */
        public async isGameInLibrary(gameId: number): Promise<boolean> {
            const token: string | undefined = this._tokenService.getToken();
    
            if (!token) {
                return false; // If no token, return false
            }
    
            try {
                const response: Response = await fetch(`${viteConfiguration.API_URL}users/is-game-in-library/${gameId}`, {
                    method: "get",
                    headers: { ...headers, authorization: token },
                });
    
                if (!response.ok) {
                    console.error(response);
                    return false; // If request fails, return false
                }
    
                const responseData: any = await response.json();
                return responseData.isInLibrary; 
            } catch (error) {
                console.error("Error checking if game is in library:", error);
                return false;
            }
        }

   
    

    /**
     * Get all order items
     * 
     * @returns A list of all order items when successful, otherwise `undefined`.
     */
    public async getThreeRandomMerch(): Promise<any> {
        console.log("get three random merch");
        const response: Response = await fetch(`${viteConfiguration.API_URL}home-merch`, {
            method: "get",
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json());
    }
}
