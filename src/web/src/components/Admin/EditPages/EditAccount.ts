import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { AdminService } from "../../../services/AdminService";
import { ProfileData } from "@shared/types/ProfileData";

/**
 * Custom element based on Lit for editing an account (user, admin, employee).
 */
@customElement("edit-account")
export class EditAccount extends LitElement {

    public static styles = css`
    :host {
        display: block;
        padding: 16px;
        color: white;
        background-color: #1e1e1e;
        font-family: Arial, sans-serif;
    }

    h2 {
        text-align: center;
        font-size: 24px;
        margin-bottom: 16px;
        color: #f5f5f5;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 15px;
        max-width: 500px;
        margin: 0 auto;
        padding: 20px;
        background: #2a2a2a;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    label {
        display: flex;
        flex-direction: column;
        gap: 5px;
        font-size: 14px;
        color: #cfcfcf;
    }

    input, select, textarea {
        padding: 12px;
        border: 1px solid #3a3a3a;
        border-radius: 4px;
        background-color: #333;
        color: white;
        transition: border-color 0.3s;
    }

    input:focus, select:focus, textarea:focus {
        border-color: #555;
        outline: none;
    }

    button {
        padding: 12px;
        background-color: #444;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    button:hover {
        background-color: #555;
    }

    img {
        max-width: 100%;
        margin-bottom: 10px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
`;

@property({ type: String }) public userId: string = "";

@state() private _profileData?: ProfileData;
@state() private _username: string = "";
@state() private _email: string = "";
@state() private _firstName: string = "";
@state() private _lastName: string = "";
@state() private _authorizationLevel: string = "user";

private _adminService: AdminService = new AdminService();

public async connectedCallback(): Promise<void> {
    super.connectedCallback();
    if (this.userId) {
        await this.getProfileData(this.userId);
    }
}

private async getProfileData(userId: string): Promise<void> {
    try {
        const result: ProfileData | undefined = await this._adminService.getUserProfile(userId);
        console.log(this._profileData);
        if (result) {
            this._profileData = result;
            this._username = result.username;
            this._email = result.email;
            this._firstName = result.first_name || "";
            this._lastName = result.last_name || "";
            this._authorizationLevel = result.authorization_level;
        }
    } catch (error) {
        console.error("Error fetching profile data:", error);
    }
}

private async saveDetails(): Promise<void> {
    if (this.userId) {
        const confirmed: boolean = confirm("Are you sure you want to save changes?");
        if (!confirmed) {
            return;
        }
        const updatedData: ProfileData = {
            username: this._username,
            email: this._email,
            authorization_level: this._authorizationLevel,
            first_name: this._firstName,
            last_name: this._lastName,
        };

        const result: boolean = await this._adminService.updateUserProfile(this.userId, updatedData);
        if (result) {
            console.log("Profile updated successfully");
            this._profileData = updatedData;
            this.requestUpdate();
        } else {
            console.error("Failed to update profile");
        }
    }
}

// private async deactivateAccount(): Promise<void> {
//     if (this.userId) {

//         const mathrandom: any = Math.random() * 1000;


//         const result: boolean = await this._adminService.deactivateUserProfile(this.userId);
//         if (result) {
//             console.log("Profile deactivated successfully");
//             this._username = "deactivated_user";
//             this._email = `${mathrandom}@example.com`;
//             this._firstName = "Deactivated";
//             this._lastName = "User";
//             this._authorizationLevel = "inactive";
//             this.requestUpdate();
//         } else {
//             console.error("Failed to deactivate profile");
//         }
//     }
// }

private async deactivateAccount(): Promise<void> {
    if (this.userId) {
        const confirmed: boolean = confirm("Are you sure you want to deactivate this account? This action cannot be undone.");
        if (!confirmed) {
            return;
        }

        const mathrandom: any = Math.random() * 1000;

        const updatedData: ProfileData = {
            username: "deactivated_user",
            email: `${mathrandom}@example.com`,
            authorization_level: "inactive",
            first_name: "Deactivated",
            last_name: "User",
        };



        const result: boolean = await this._adminService.updateUserProfile(this.userId, updatedData);
        if (result) {
            console.log("Profile updated successfully");
            this._profileData = updatedData;
            this.requestUpdate();
        } else {
            console.error("Failed to update profile");
        }
    }
}





private handleInput(event: Event): void {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    (this as any)[target.name as keyof this] = target.value;
}

public render(): TemplateResult {
    return html`
        <div class="account-info">
            <h2>Edit User</h2>
            <form>
                <label>
                    <strong>Username:</strong>
                    <input type="text" name="_username" .value="${this._username}" @input="${this.handleInput}">
                </label>
                <label>
                    <strong>Email:</strong>
                    <input type="email" name="_email" .value="${this._email}" @input="${this.handleInput}">
                </label>
                <label>
                    <strong>First Name:</strong>
                    <input type="text" name="_firstName" .value="${this._firstName}" @input="${this.handleInput}">
                </label>
                <label>
                    <strong>Last Name:</strong>
                    <input type="text" name="_lastName" .value="${this._lastName}" @input="${this.handleInput}">
                </label>
                <label>
                    <strong>Authorization Level:</strong>
                    <select name="_authorizationLevel" .value="${this._authorizationLevel}" @change="${this.handleInput}">
                        <option value="user">User</option>
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </label>
                <button type="button" @click="${this.saveDetails}">Save Details</button>
                <button type="button" @click="${this.deactivateAccount}">Deactivate Account</button>
            </form>
        </div>
    `;
}
}
