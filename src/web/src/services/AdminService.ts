import { createGameFormModel } from "@shared/formModels/CreateGameFormModel";
import { createMerchFormModel } from "@shared/formModels/CreateMerchFormModel";
import { createNewsFormModel } from "@shared/formModels/CreateNewsFormModel";
import { createUserFormModel } from "@shared/formModels/CreateUserFormModel";
// import { DeactivatedData } from "@shared/types/DeactivatedData";
// import { ProfileData } from "@shared/types/ProfileData";

const headers: { "Content-Type": string } = {
    "Content-Type": "application/json",
};

export class AdminService {

     // ADMIN get all services

     public async getAllMerch(): Promise<any> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}admin/merch`, {
            method: "get",
        });

        if (!response.ok) {
            console.error(response);
            return undefined;
        }

        return (await response.json());
    }

    public async getAllGames(): Promise<any> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}admin/games`, {
            method: "get",
        });

        if (!response.ok) {
            console.error(response);
            return undefined;
        }

        return (await response.json());
    }

    

    public async getAllSales(): Promise<any> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}admin/sales`, {
            method: "get",
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json());
    }

    public async getAllBills(): Promise<any> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}admin/bills`, {
            method: "get",
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json());
    }

     /**
     * gets all "users" from user table
     * @returns all items in user table with authorization level "user"
     */
     public async getAllUsers(): Promise<any> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}admin/users`, {
            method: "get",
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json());
    }

    public async getAllAdmins(): Promise<any> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}admin/admins`, {
            method: "get",
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json());
    }

    public async getAllEmployees(): Promise<any> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}admin/employees`, {
            method: "get",
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json());
    }

    public async getAllNewsItems(): Promise<any> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}admin/news`, {
            method: "get",
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json());
    }

        // ADMIN create services

    public async createGame(formData: createGameFormModel): Promise<boolean> {

        // Send a POST request to the registration endpoint with the provided registration data
        const response: Response = await fetch(`${viteConfiguration.API_URL}admin/create-game`, {
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

    public async createMerch(formData: createMerchFormModel): Promise<boolean> {

        // Send a POST request to the registration endpoint with the provided registration data
        const response: Response = await fetch(`${viteConfiguration.API_URL}admin/create-merch`, {
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

    public async createNews(formData: createNewsFormModel): Promise<boolean> {

        // Send a POST request to the registration endpoint with the provided registration data
        const response: Response = await fetch(`${viteConfiguration.API_URL}admin/create-news`, {
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

    public async createAccount(formData: createUserFormModel): Promise<boolean> {

        // Send a POST request to the registration endpoint with the provided registration data
        const response: Response = await fetch(`${viteConfiguration.API_URL}admin/create-account`, {
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

         // ADMIN get by id services

    public async getUserProfile(userId: string): Promise<any> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}admin/user/${userId}`, {
            method: "get",
        });

        if (!response.ok) {
            console.error(response);
            return undefined;
        }

        return (await response.json());
    }
    
    public async getNewsById(id: string): Promise<any> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}admin/news-detail/${id}`, {
            method: "get",
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json());
    }

    public async getGameById(id: string): Promise<any> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}admin/game-detail/${id}`, {
            method: "get",
        });
    
        if (!response.ok) {
            console.error(response);
            return undefined;
        }
    
        return await response.json();
    }
    


    public async getMerchById(id: string): Promise<any> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}admin/merch-detail/${id}`, {
            method: "get",
        });
    
        if (!response.ok) {
            console.error(response);
            return undefined;
        }
    
        return await response.json();
    }
    


        // ADMIN update services
   public async updateUserProfile(userId: string, data: any): Promise<boolean> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}admin/user/${userId}`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            console.error("Failed to update profile:", response);
            return false;
        }

        return true;
    }

    public async deactivateUserProfile(userId: string): Promise<boolean> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}admin/user/deactivate/${userId}`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
            },
        });
    
        if (!response.ok) {
            console.error("Failed to deactivate profile:", response);
            return false;
        }
    
        return true;
    }

    public async updateNews(id: string, formData: createNewsFormModel): Promise<boolean> {
        const thumbnailBase64: string | null = formData.thumbnail instanceof File ? await this.convertFileToBase64(formData.thumbnail) : formData.thumbnail;
        const payload: any = {
            ...formData,
            thumbnail: thumbnailBase64,
        };
    
        const response: Response = await fetch(`${viteConfiguration.API_URL}admin/news/${id}`, {
            method: "put",
            headers: headers,
            body: JSON.stringify(payload),
        });
    
        if (!response.ok) {
            console.error(response);
            return false;
        }
    
        return true;
    }

    public async updateGame(id: string, formData: createGameFormModel): Promise<boolean> {
        const thumbnailBase64: string | null = formData.Thumbnail instanceof File ? await this.convertFileToBase64(formData.Thumbnail) : formData.Thumbnail;
        const imagesBase64: string[] = await Promise.all(formData.images.map(image => this.convertFileToBase64(image)));
    
        const payload: any = {
            ...formData,
            Thumbnail: thumbnailBase64,
            images: imagesBase64,
        };
    
        const response: Response = await fetch(`${viteConfiguration.API_URL}admin/game/${id}`, {
            method: "put",
            headers: headers,
            body: JSON.stringify(payload),
        });
    
        if (!response.ok) {
            console.error(response);
            return false;
        }
    
        return true;
    }

public async updateMerch(id: string, formData: createMerchFormModel): Promise<boolean> {
    const thumbnailBase64: string | null = formData.Thumbnail instanceof File ? await this.convertFileToBase64(formData.Thumbnail) : formData.Thumbnail;
    const imagesBase64: string[] = await Promise.all(formData.images.map(image => this.convertFileToBase64(image)));

    const payload: any = {
        ...formData,
        Thumbnail: thumbnailBase64,
        images: imagesBase64,
    };

    const response: Response = await fetch(`${viteConfiguration.API_URL}admin/merch/${id}`, {
        method: "put",
        headers: headers,
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        console.error(response);
        return false;
    }

    return true;
}

public async getBillById(billId:string): Promise<any> {
    const response: Response = await fetch(`${viteConfiguration.API_URL}bill-detail/${billId}`, {
        method: "get",
    });

    if (!response.ok) {
        console.error(response);

        return undefined;
    }

    return (await response.json());
}



        // ADMIN delete/deactivate services
public async deleteUserProfile(userId: string): Promise<boolean> {
    const response: Response = await fetch(`${viteConfiguration.API_URL}admin/user/${userId}`, {
        method: "delete",
    });

    if (!response.ok) {
        console.error("Failed to delete user:", response);
        return false;
    }

    return true;
}

    public async deleteNews(id: string): Promise<boolean> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}admin/news/${id}`, {
            method: "delete",
        });

        if (!response.ok) {
            console.error(response);
            return false;
        }

        return true;
    }



    public async deleteGame(gameId: string): Promise<boolean> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}admin/game/${gameId}`, {
            method: "delete",
        });
    
        if (!response.ok) {
            console.error("Failed to delete game:", response);
            return false;
        }
    
        return true;
    }

    public async deleteMerch(merchId: string): Promise<boolean> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}admin/merch/${merchId}`, {
            method: "delete",
        });
    
        if (!response.ok) {
            console.error("Failed to delete merchandise:", response);
            return false;
        }
    
        return true;
    }
 
    


        // ADMIN Allows picture to be converted to base64

private convertFileToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        if (!file) {
            resolve("");
            return;
        }

        const reader: FileReader = new FileReader();

        reader.onloadend = (): void => {
            const result: any = reader.result;
            if (typeof result === "string") {
                resolve(result);
            } else {
                reject(new Error("Failed to read file as Base64."));
            }
        };

        reader.onerror = (): void => {
            reject(new Error("Failed to read file."));
        };

        reader.readAsDataURL(file);
    });
}
    
}