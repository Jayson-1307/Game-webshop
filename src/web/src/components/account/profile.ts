import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { ProfileService } from "../../services/ProfileService";
import { ProfileData } from "@shared/types/ProfileData";


@customElement("profile-page")
export class ProfilePage extends LitElement {
    public static styles = css`

    /* styling for the div that contains the account information */
    .account-info {
        background-color: transparent;
        padding: 20px;
        border-radius: 10px;
        max-width: 600px;
        margin: auto;
        border: 1px solid #9900ff;
    }

    /* styling for the lines of info */
    p {
        width: 100%;
        margin: 10px 0;
        padding: 7px;
        display: block;
        border: 1px solid #9900ff;
        border-radius: 8px;
        box-sizing: border-box;
    }

    /* styling for the information and adress headers  */
    h2 {
        color: #fbfbfa;
        margin-top: 0;
    }
    p {
        margin-top: 10px;
    }

    /* styling for the buttons  */
    .changeDetailsButton, .deleteAccountButton {
        width: 100%;
        background-color: #9900ff;
        color: white;
        padding: 14px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        margin-top: 20px;
        display: block;
    }

    /* styling for the hover effect on the buttons */
    .changeDetailsButton:hover, .deleteAccountButton:hover {
        background-color: #6600cc;
    }
    `;

    @state() public userId: string | null = localStorage.getItem("userId");
    @state() private _profileData?: ProfileData;
    @state() private _editMode: boolean = false;
    @state() private _username: string = "";
    @state() private _email: string = "";

    private _profileService: ProfileService;

    /**
     * Constructor for the ProfilePage component.
     */
    public constructor() {
        super();
        this._profileService = new ProfileService();
    }

    /**
     * Lifecycle method called when the component is first connected to the DOM.
     * Fetches the user's profile data if a user ID is found in local storage.
     */
    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        console.log("Connected callback called, userId:", this.userId);

        if (!this.userId) {
            this.userId = localStorage.getItem("userId") || "";
            console.log("Retrieved userId from local storage:", this.userId);
        }

        if (this.userId) {
            await this.getProfileData(this.userId);
            console.log("getting userid", this.userId);
        } else {
            console.error("User ID is not provided");
        }
    }

/**
     * Fetches the profile data for the specified user ID.
     * 
     * @param userId - The ID of the user whose profile data is to be fetched.
     */
    private async getProfileData(userId: string): Promise<void> {
        try {
            console.log("Fetching profile data for userId:", userId);
            const result: ProfileData | undefined = await this._profileService.getProfile(userId);
            console.log("API result:", result);
            if (result) {
                console.log("Profile data fetched:", result);
                this._profileData = result;
                this._username = result.username;
                this._email = result.email;
            } else {
                console.log("No profile data found for userId:", userId);
                this._profileData = {
                    username: "N/A",
                    email: "N/A",
                    authorization_level: "N/A",
                };
            }
            this.requestUpdate();
        } catch (error) {
            console.error("Error fetching profile data:", error);
            this._profileData = {
                username: "Error",
                email: "Error",
                authorization_level: "Error",
            };
            this.requestUpdate();
        }
    }
/**
     * Handles the click event for the "Change Details" button.
     * Enables edit mode for the profile details.
     */
    private handleChangeDetails(): void {
        console.log("Change Details button clicked");
        this._editMode = true;
    }

/**
     * Handles the click event for the "Save Details" button.
     * Updates the user's profile details with the new values.
     */
    private async handleSaveDetails(): Promise<void> {
        console.log("Save Details button clicked");
        if (this.userId) {
            try {
                const updatedData: ProfileData = {
                    username: this._username,
                    email: this._email,
                    authorization_level: this._profileData?.authorization_level || "user",
                };
                console.log("Sending updated data:", updatedData);
                const result: boolean = await this._profileService.updateProfile(this.userId, updatedData);
                console.log("Update result:", result);
                if (result) {
                    console.log("Profile updated successfully");
                    this._profileData = updatedData;
                    this._editMode = false;
                    this.requestUpdate();
                } else {
                    console.error("Failed to update profile");
                }
            } catch (error) {
                console.error("Error updating profile:", error);
            }
        }
    }

    /**
     * Handles the click event for the "Delete Account" button.
     * Deletes the user's account after confirming the action.
     */
    private async handleDeleteAccount(): Promise<void> {
        console.log("Delete Account button clicked");
        const confirmed: boolean = confirm("Are you sure you want to delete your account?");
        if (confirmed) {
            try {
                const result: boolean = await this._profileService.deleteProfile(this.userId!);
                if (result) {
                    console.log("Account deleted successfully");
                    localStorage.removeItem("userId");
                    window.location.href = "/login"; // Redirect to login or home page. Has to be changed!!
                } else {
                    console.error("Failed to delete account");
                }
            } catch (error) {
                console.error("Error deleting account:", error);
            }
        }
    }

    /**
     * Handles the input events
     * for the username field.
     * or the email field.
     * for the birth date field.
     * for the birth date field.
     * @param event - The input event.
     */
    private handleUsernameInput(event: Event): void {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        this._username = target.value;
    }
    private handleEmailInput(event: Event): void {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        this._email = target.value;
    }




/**
     * Renders the profile page template.
     * 
     * @returns The HTML template for the profile page.
     */
    public render(): TemplateResult {
        return html`
            <div class="account-info">

                <!-- information about the user is displayed and editable after clicking the change details button -->
                <h2>Information</h2>
                <p><strong>Username:</strong> ${this._editMode ? html`<input type="text" .value="${this._username}" @input="${this.handleUsernameInput}">` : this._profileData?.username ?? "Loading..."}</p>
                <p><strong>E-mail:</strong> ${this._editMode ? html`<input type="email" .value="${this._email}" @input="${this.handleEmailInput}">` : this._profileData?.email ?? "Loading..."}</p>
                <p><strong>Authorization Level:</strong> ${this._profileData?.authorization_level ?? "Loading..."}</p>

                <!-- information about the adress is displayed and not editable YET -->
                <h2>Address Information</h2>
                <p><strong>Street:</strong> Wibautstraat</p>
                <p><strong>Zipcode:</strong> 1091 GH</p>
                <p><strong>House Number:</strong> 3b</p>
                <p><strong>City:</strong> Amsterdam</p>
                <p><strong>Country:</strong> Netherlands</p>

                ${this._editMode ? html`
                    <button class="changeDetailsButton" @click="${this.handleSaveDetails}">Save Details</button>
                ` : html`
                    <button class="changeDetailsButton" @click="${this.handleChangeDetails}">Change Details</button>
                `}
                <button class="deleteAccountButton" @click="${this.handleDeleteAccount}">Delete Account</button>
            </div>
        `;
    }
}
