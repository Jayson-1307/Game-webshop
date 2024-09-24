import { ProfileData } from "@shared/types/ProfileData";
import { TokenService } from "./TokenService";

/**
 * Handles profile related functionality
 */
export class ProfileService {
    private _tokenService: TokenService = new TokenService();

    /**
     * Retrieves the profile data for a given user.
     * 
     * @param userId - The ID of the user whose profile data is to be fetched.
     * @returns A promise that resolves to the profile data if successful, otherwise `undefined`.
     */
    public async getProfile(userId: string): Promise<ProfileData | undefined> {
        const token: string | undefined = this._tokenService.getToken();
        console.log("Retrieved token:", token); // Log the token
        if (!token) {
            console.error("No token found");
            return undefined;
        }
    
        const response: Response = await fetch(`${viteConfiguration.API_URL}profile/${userId}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`
            }
        });
    
        console.log("Response status:", response.status); // Log the response status
    
        if (!response.ok) {
            console.error(response);
            return undefined;
        }
    
        return (await response.json()) as ProfileData;
    }

    /**
     * Deletes the profile of a given user.
     * 
     * @param userId - The ID of the user who click the delete function
     * @returns A promise that resolves to `true` if the profile was successfully deleted, otherwise `false`.
     */
    public async deleteProfile(userId: string): Promise<boolean> {
        const token: string | undefined = this._tokenService.getToken();
        if (!token) {
            console.error("No token found");
            return false;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}profile/${userId}`, {
            method: "delete",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`
            }
        });

        if (!response.ok) {
            console.error("Failed to delete profile:", response);
            return false;
        }

        return true;
    }

    /**
     * Updates the profile data of a given user.
     * 
     * @param userId - The ID of the user who clicks the updateProfile function.
     * @param data - The new profile data to be updated.
     * @returns A promise that resolves to `true` if the profile was successfully updated, otherwise `false`.
     */
    public async updateProfile(userId: string, data: ProfileData): Promise<boolean> {
        const token: string | undefined = this._tokenService.getToken();
        if (!token) {
            console.error("No token found");
            return false;
        }

        try {
            console.log("Sending update request with data:", data);

            const response: Response = await fetch(`${viteConfiguration.API_URL}profile/${userId}`, {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${token}`
                },
                body: JSON.stringify(data)
            });

            console.log("Response status from updateProfile:", response.status);

            if (!response.ok) {
                const errorText: string = await response.text();
                console.error("Failed to update profile:", response.status, response.statusText, errorText);
                return false;
            }

            return true;
        } catch (error) {
            console.error("Error occurred during fetch:", error);
            return false;
        }
    }
}

