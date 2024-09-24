import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { AdminService } from "../../../services/AdminService";
import { RouterPage } from "../../RouterPage";
import { UserService } from "../../../services/UserService";

/**
 * Custom element based on Lit for creating an account (user, admin, employee).
 */
@customElement("create-account")
export class CreateAccount extends LitElement {
    public static styles = css`
        :host {
            display: block;
            padding: 16px;
            color: white;
            background-color: #1e1e1e;
        }

        h2 {
            text-align: center;
        }

        form {
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
            margin: 0 auto;
        }

        input, select, textarea {
            padding: 10px;
            border: 1px solid #3a3a3a;
            background-color: #333;
            color: white;
        }

        button {
            padding: 10px;
            background-color: #444;
            color: white;
            border: none;
            cursor: pointer;
        }

        button:hover {
            background-color: #555;
        }

        .error {
            color: red;
        }
    `;
    
    private _adminService: AdminService = new AdminService();
    private _userService: UserService = new UserService();

    @state() private _username: string = "";
    @state() private _email: string = "";
    @state() private _password: string = "";
    @state() private _firstName: string = "";   
    @state() private _lastName: string = "";
    @state() private _authLevel: string = "";

    @state() private _usernameError: string | null = null;
    @state() private _visibleErrorUsername: boolean = false;

    @state() private _emailError: string | null = null;
    @state() private _visibleErrorEmail: boolean = false;

    @state() private _passwordError: string | null = null;
    @state() private _visibleErrorPassword: boolean = false;

    @state() private _firstNameError: string | null = null;
    @state() private _visibleErrorFirstName: boolean = false;

    @state() private _lastNameError: string | null = null;
    @state() private _visibleErrorLastName: boolean = false;

    @state() private _authLevelError: string | null = null;
    @state() private _visibleAuthLevelError: boolean = false;
    
    
    
    private navigateTo(page: RouterPage): void {
        this.dispatchEvent(new CustomEvent("navigate", { detail: page }));
    }

    /**
     * Validates an email address.
     * @param email The email address to validate.
     * @returns A boolean indicating whether the email is valid or not.
     */
    private validateEmail(email: string): boolean {

        // Regular expression to validate email format
        const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);

    }

    private async _createAccount(event:Event): Promise<void> {
        event.preventDefault();

        const result: boolean = await this._adminService.createAccount({
            username: this._username,
            email: this._email,
            password: this._password,
            auth_level: this._authLevel,
            firstName: this._firstName,
            lastName: this._lastName,
        });

        if (result) {

            alert("Successfully registered!");

            // Navigate to the login page after successful registration
            if (this._authLevel === "user") {
                this.navigateTo(RouterPage.AdminUserOverview);
            } else if (this._authLevel === "admin") {
                this.navigateTo(RouterPage.AdminOverview);
            } else if (this._authLevel === "employee") {
                this.navigateTo(RouterPage.AdminEmployeesOverview);
            }

        } else {

            // If registration fails, perform validation checks and display appropriate error messages

            // Check if the username field is empty
            if (this._username.trim() === "") {
                this._usernameError = "Please fill in the username field";
                this._visibleErrorUsername = true;
            }

            // Check if the email field is empty or invalid
            if (this._email.trim() === "") {
                this._emailError = "Please fill in the email field";
                this._visibleErrorEmail = true;
            } else if (!this.validateEmail(this._email)) {
                this._emailError = "Please enter a valid email address";
                this._visibleErrorEmail = true;
            }

            // Check if the password field is empty
            if (this._password.trim() === "") {
                this._passwordError = "Please fill in the password field";
                this._visibleErrorPassword = true;
            }

            // Check if the first name field is empty
            if (this._firstName.trim() === "") {
                this._firstNameError = "Please fill in the first name field";
                this._visibleErrorFirstName = true;
            }

            // Check if the last name field is empty
            if (this._lastName.trim() === "") {
                this._lastNameError = "Please fill in the last name field";
                this._visibleErrorLastName = true;
            }

            // Check if the last name field is empty
            if (this._lastName.trim() === "") {
                this._lastNameError = "Please fill in the last name field";
                this._visibleErrorLastName = true;
            }

            if (this._authLevel.trim() === "") {
                this._authLevelError = "Please select an authorization level";
                this._visibleAuthLevelError = true;
            }

            // Check if email exists
            const emailExists: boolean = await this._userService.checkExistingEmail(this._email);

            if (!emailExists) {
                this._emailError = "Email already exists";
                this._visibleErrorEmail = true;
            }

        }
    }


    public render(): TemplateResult {
        return html`
            <h2>Create Account</h2>
            <form>
                <label for="username">Username</label>
                <input type="text" name="username" class="username" @input=${this.input} id="username" .value=${this._username} placeholder="Username" required">
                ${this._visibleErrorUsername ? html`<div class="error">${this._usernameError}</div>` : ""}

                <label for="email">E-mail adress</label>
                <input type="text" name="email" class="email" @input=${this.input} id="email" .value=${this._email} placeholder="Username" required">
                ${this._visibleErrorEmail ? html`<div class="error">${this._emailError}</div>` : ""}

                <label for="password">Password (visible)</label>
                <input type="text" name="password" class="password" @input=${this.input} id="password" .value=${this._password} placeholder="Password" required">
                ${this._visibleErrorPassword ? html`<div class="error">${this._passwordError}</div>` : ""}

                <label for="first-name">First name</label>
                <input type="text" name="first-name" class="firstName" @input=${this.input} id="firstName" .value=${this._firstName} placeholder="first Name" required">
                ${this._visibleErrorFirstName ? html`<div class="error">${this._firstNameError}</div>` : ""}

                <label for="last-name">Last name</label>
                <input type="text" name="last-name" class="lastName" @input=${this.input} id="lastName" .value=${this._lastName} placeholder="last Name" required">
                ${this._visibleErrorLastName ? html`<div class="error">${this._lastNameError}</div>` : ""}

                <label for="auth">Authorization Level</label>
                <select name="auth" id="authLevel" class="authLevel" @input=${this.input} .value=${this._authLevel}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="employee">Employee</option>
                </select>
                ${this._visibleAuthLevelError ? html`<div class="error">${this._authLevelError}</div>` : ""}


                <button type="submit"  @click="${this._createAccount}">Create Account</button>
            </form>
        `;
    }

    /**
     * Handles input events for email and password fields.
     * Updates corresponding state variables based on user input.
     * @param event The input event.
     */
    private input(event: InputEvent): void {

        // Extracts the target element from the input event
        const target: HTMLInputElement | HTMLTextAreaElement = event.target as HTMLInputElement | HTMLTextAreaElement;

        // Retrieves the ID attribute of the target element
        const id: string = target.id;

        // Retrieves the ID attribute of the target element
        const value: string = target.value;

        // Switch statement to handle different input fields based on their IDs
        switch (id) {
            case "username":
                // Update username state variable and hide username error message
                this._username = value;
                this._visibleErrorUsername = false;
                break;
            case "email":
                // Update email state variable and hide email error message
                this._email = value;
                this._visibleErrorEmail = false;
                break;
            case "password":
                // Update password state variable and hide password error message
                this._password = value;
                this._visibleErrorPassword = false;
                break;
            case "firstName":
                // Update first name state variable and hide first name error message
                this._firstName = value;
                this._visibleErrorFirstName = false;
                break;
            case "lastName":
                // Update last name state variable and hide last name error message
                this._lastName = value;
                this._visibleErrorLastName = false;
                break;

            case "authLevel":
                // Update repeat password state variable and hide repeat password error message
                this._authLevel = value;
                this._visibleAuthLevelError = false;
                break;
        }
    }
}
