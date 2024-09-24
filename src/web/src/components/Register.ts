import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { UserService } from "../services/UserService";
import { RouterPage } from "./RouterPage";
import "./CustomInputElement.ts";
import { sendEmail } from "../services/EmailService";

/**
 * Custom element for facilitating the euphoric journey of user registration.
 */
@customElement("webshop-register")
export class Register extends LitElement {

    /**
     * Radiant styles for the registration form.
     */
    public static styles = css`
      /* General styles for the form container */
      .form {
    background-color: transparent; /* Dark background color */
    padding: 20px;
    border-radius: 10px;
    max-width: 400px;
    margin: auto;
    border: 1px solid #9900ff; /* Purple border */
}


/* custom-input-element {
      width: 100%;
      margin: 10px 0;
      display: block;
      padding: 1px !important;
      border: 1px solid #9900ff;
      border-radius: 8px 8px 8px 8px;
      background: transparent;
      box-sizing: border-box;
} */

input {
        width: 100%;
        margin: 10px 0;
        display: block;
        padding: 9px !important;
        border: 1px solid #9900ff;
        border-radius: 8px 8px 8px 8px;
        background: transparent;
        box-sizing: border-box;
        color: white;
    }

    input:focus:not(:focus-visible) {
        border-color: #ccc; /* Revert focus styling when not :focus-visible */
        box-shadow: none;
        outline: none;
    }   

    input:focus-visible {
        border: 1px solid #9900ff;
        box-shadow: 0 0 0 2px #9900ff;
        outline: none;
    }

/* Styling error messages */
.error {
    color: #ff3b30; /* Red color for error messages */
    font-size: 14px;
    margin-top: -10px;
    margin-bottom: 10px;
}

/* Styling the submit button */
.button {
    width: 100%;
    text-align: center;
    margin: 20px 0;
}

.button button {
    width: 100%;
    background-color: #9900ff; /* Purple background color */
    color: white; /* White text color */
    padding: 14px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
}

/* Adding hover effect to the button */
.button button:hover {
    background-color: #9900ff; /* Darker purple color */
}

/* Styling the link */
.hrefText {
    text-align: center;
    color: #b3b3b3; /* Light grey text color */
    margin-top: 20px;
}

.hrefText a {
    color: #9900ff; /* Purple color */
    text-decoration: none;
}

.hrefText a:hover {
    text-decoration: underline;
}

/* Additional styling for better appearance */
body {
    background-color: #121212; /* Matching background color */
    color: white; /* White text color */
    font-family: Arial, sans-serif;
}

    `;

    // A jubilant instance of the UserService class
    private _userService: UserService = new UserService();

    // Blissful state variables for form inputs
    @state() private _username: string = "";
    @state() private _email: string = "";
    @state() private _password: string = "";
    @state() private _repeatPassword: string = "";
    @state() private _firstName: string = "";
    @state() private _lastName: string = "";

    // Joyous state variables for input error messages and visibility
    @state() private _usernameError: string | null = null;
    @state() private _visibleErrorUsername: boolean = false;

    @state() private _emailError: string | null = null;
    @state() private _visibleErrorEmail: boolean = false;

    @state() private _passwordError: string | null = null;
    @state() private _visibleErrorPassword: boolean = false;

    @state() private _repeatPasswordError: string | null = null;
    @state() private _visibleErrorRepeatPassword: boolean = false;

    @state() private _firstNameError: string | null = null;
    @state() private _visibleErrorFirstName: boolean = false;

    @state() private _lastNameError: string | null = null;
    @state() private _visibleErrorLastName: boolean = false;

    @state() private _verificationCode: string = "";
    @state() private _enteredVerificationCode: string = "";
    @state() private _verificationCodeError: string | null = null;
    @state() private _visibleErrorVerificationCode: boolean = false;
    @state() private _showVerificationCodeFields: boolean = false;

    /**
     * Generates a 6-digit verification code.
     * @returns A string representing the 6-digit verification code.
     */
    private generateVerificationCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    /**
     * Exuberantly handles submission of the registration form.
     * Validates user input and registers the user if input is valid.
     */
    private async submitRegisterForm(): Promise<void> {
        this.resetErrors();
    
        // Perform validation checks
        if (this.validateForm()) {

            const emailExists: boolean = await this._userService.checkExistingEmail(this._email);
    
            if (!emailExists) {
                this._emailError = "Email already exists";
                this._visibleErrorEmail = true;
            } else {
    
                this._verificationCode = this.generateVerificationCode();
    
                console.log("register before", this._verificationCode);
    
                try {
                    const emailResult: string = await sendEmail({
                        from: { name: "RETRO GAME STORE", address: "no-reply@retrogamestore.com" },
                        to: [{ address: this._email }],
                        subject: "Verification Code to register hier",
                        text: `Your verification code to register is: ${this._verificationCode}`,
                        html: `<p>Your verification code to register is: <strong>${this._verificationCode}</strong></p>`
                    });

                    console.log("register after", this._verificationCode);
                    console.log("Email sent successfully:", emailResult);
                    
                    this._showVerificationCodeFields = true;
                    alert("Please fill in de verification code we have sent you to your email");
                } catch (emailError) {
                    console.error("Failed to send email:", emailError);
                }
    
            }
        }
    }

    /**
     * Resets all error messages and visibility flags.
     */
    private resetErrors(): void {
        this._usernameError = null;
        this._visibleErrorUsername = false;
        this._emailError = null;
        this._visibleErrorEmail = false;
        this._passwordError = null;
        this._visibleErrorPassword = false;
        this._repeatPasswordError = null;
        this._visibleErrorRepeatPassword = false;
        this._firstNameError = null;
        this._visibleErrorFirstName = false;
        this._lastNameError = null;
        this._visibleErrorLastName = false;
        this._verificationCodeError = null;
        this._visibleErrorVerificationCode = false;
    }

    /**
     * Validates the registration form.
     * @returns A boolean indicating whether the form is valid or not.
     */
    private validateForm(): boolean {
        let isValid: boolean = true;

        if (this._username.trim() === "") {
            this._usernameError = "Please fill in the username field";
            this._visibleErrorUsername = true;
            isValid = false;
        }

        if (this._email.trim() === "") {
            this._emailError = "Please fill in the email field";
            this._visibleErrorEmail = true;
            isValid = false;
        } else if (!this.validateEmail(this._email)) {
            this._emailError = "Please enter a valid email address";
            this._visibleErrorEmail = true;
            isValid = false;
        }

        if (this._password.trim() === "") {
            this._passwordError = "Please fill in the password field";
            this._visibleErrorPassword = true;
            isValid = false;
        }

        if (this._repeatPassword.trim() === "") {
            this._repeatPasswordError = "Please fill in the repeat password field";
            this._visibleErrorRepeatPassword = true;
            isValid = false;
        } else if (this._repeatPassword !== this._password) {
            this._repeatPasswordError = "Passwords do not match";
            this._visibleErrorRepeatPassword = true;
            isValid = false;
        }

        if (this._firstName.trim() === "") {
            this._firstNameError = "Please fill in the first name field";
            this._visibleErrorFirstName = true;
            isValid = false;
        }

        if (this._lastName.trim() === "") {
            this._lastNameError = "Please fill in the last name field";
            this._visibleErrorLastName = true;
            isValid = false;
        }

        return isValid;
    }

    private async submitVerificationCode(): Promise<void> {
        if (this._enteredVerificationCode === this._verificationCode) {
            const result: boolean = await this._userService.register({
                username: this._username,
                email: this._email,
                password: this._password,
                repeatPassword: this._repeatPassword,
                firstName: this._firstName,
                lastName: this._lastName,
            });

            if (result) {
                alert("Successfully registered!");
                this.navigateTo(RouterPage.Login);
            } else {
                alert("Registration failed!");
            }
        } else {
            this._verificationCodeError = "Invalid verification code";
            this._visibleErrorVerificationCode = true;
        }
    }

    /**
     * Validates an email address.
     * @param email The email address to validate.
     * @returns A boolean indicating whether the email is valid or not.
     */
    private validateEmail(email: string): boolean {
        const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Renders the registration form.
     * @returns The HTML template for the registration form.
     */
    public render(): TemplateResult {
        return html`
            <div class="form">
                <!-- Display registration form if verification code fields are not visible -->
                ${!this._showVerificationCodeFields ? html`
                    <!-- <custom-input-element class="username" type="text" id="username" @input=${this.input} .value=${this._username} placeholder="Username"></custom-input-element> -->
                    <input class="username" type="text" id="username" @input=${this.input} .value=${this._username} placeholder="Username"> 
                    ${this._visibleErrorUsername ? html`<div class="error">${this._usernameError}</div>` : ""}

                    <!-- <custom-input-element type="email" id="email" @input=${this.input} .value=${this._email} placeholder="Email"></custom-input-element> -->
                    <input type="email" id="email" @input=${this.input} .value=${this._email} placeholder="Email"> 
                    ${this._visibleErrorEmail ? html`<div class="error">${this._emailError}</div>` : ""}

                    <!-- <custom-input-element type="password" id="password" @input=${this.input} .value=${this._password} placeholder="Password"></custom-input-element> -->
                    <input type="password" id="password" @input=${this.input} .value=${this._password} placeholder="Password"> 
                    ${this._visibleErrorPassword ? html`<div class="error">${this._passwordError}</div>` : ""}

                    <!-- <custom-input-element type="password" id="repeatPassword" @input=${this.input} .value=${this._repeatPassword} placeholder="Repeat password"></custom-input-element> -->
                    <input type="password" id="repeatPassword" @input=${this.input} .value=${this._repeatPassword} placeholder="Repeat password"> 
                    ${this._visibleErrorRepeatPassword ? html`<div class="error">${this._repeatPasswordError}</div>` : ""}

                    <!-- <custom-input-element type="text" id="firstName" @input=${this.input} .value=${this._firstName} placeholder="First name"></custom-input-element> -->
                    <input type="text" id="firstName" @input=${this.input} .value=${this._firstName} placeholder="First name"> 
                    ${this._visibleErrorFirstName ? html`<div class="error">${this._firstNameError}</div>` : ""}

                    <!-- <custom-input-element type="text" id="lastName" @input=${this.input} .value=${this._lastName} placeholder="Last name"></custom-input-element> -->
                    <input type="text" id="lastName" @input=${this.input} .value=${this._lastName} placeholder="Last name"> 
                    ${this._visibleErrorLastName ? html`<div class="error">${this._lastNameError}</div>` : ""}
                ` : ""}

                <!-- Display verification code fields if they are visible -->
                ${this._showVerificationCodeFields ? html`
                    <!-- <custom-input-element type="text" id="enteredVerificationCode" @input=${this.input} .value=${this._enteredVerificationCode} placeholder="Verification code"></custom-input-element> -->
                    <input type="text" id="enteredVerificationCode" @input=${this.input} .value=${this._enteredVerificationCode} placeholder="Verification code">
                    ${this._visibleErrorVerificationCode ? html`<div class="error">${this._verificationCodeError}</div>` : ""}
                ` : ""}
                
                <!-- Display buttons based on form state -->
                <div class="button">
                    <!-- Show verification code button if verification code fields are visible -->
                    ${this._showVerificationCodeFields ? html`
                        <button @click="${this.submitVerificationCode}">Submit Verification Code</button>
                    ` : html`
                        <!-- Show registration button if verification code fields are not visible -->
                        <button @click="${this.submitRegisterForm}" type="submit">Create an account</button>
                    `}
                </div>

                <div class="hrefText">
                    Already have an account?
                    <a href="#" @click="${(): void => this.navigateTo(RouterPage.Login)}">Login here.</a>
                </div>
            </div>
        `;
    }



    /**
     * Navigates to a specified page.
     * @param page The page to navigate to.
     */
    private navigateTo(page: RouterPage): void {
        this.dispatchEvent(new CustomEvent("navigate", { detail: page }));
    }

    /**
     * Handles input events for form fields.
     * Updates corresponding state variables based on user input.
     * @param event The input event.
     */
    private input(event: InputEvent): void {
        const target: HTMLInputElement | HTMLTextAreaElement = event.target as HTMLInputElement | HTMLTextAreaElement;
        const id: string = target.id;
        const value: string = target.value;

        switch (id) {
            case "username":
                this._username = value;
                this._visibleErrorUsername = false;
                break;
            case "email":
                this._email = value;
                this._visibleErrorEmail = false;
                break;
            case "password":
                this._password = value;
                this._visibleErrorPassword = false;
                break;
            case "repeatPassword":
                this._repeatPassword = value;
                this._visibleErrorRepeatPassword = false;
                break;
            case "firstName":
                this._firstName = value;
                this._visibleErrorFirstName = false;
                break;
            case "lastName":
                this._lastName = value;
                this._visibleErrorLastName = false;
                break;
            case "enteredVerificationCode": 
                this._enteredVerificationCode = value; 
                this._visibleErrorVerificationCode = false; 
                break;
        }
    }
}