import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { AdminService } from "../../../services/AdminService";
import "../../CustomInputElement";
// import { utils } from "@hboictcloud/api";


/**
 * Custom element based on Lit for creating a game.
 */
@customElement("create-game")
export class CreateGame extends LitElement {
    public static styles = css`
        :host {
            display: block;
            padding: 16px;
            color: white;
            background-color: transparent
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
    `;

    private _adminService: AdminService = new AdminService();


    // State variables for form inputs
    @state() private _gameTitle: string = "";
    @state() private _thumbnail: File | null = null;
    @state() private _description: string = "";
    @state() private _price: number = 0; 
    @state() private _images: File[] = [];
    @state() private _url: string = "";
    @state() private _authors: string = "";
    @state() private _tags: string = "";

    private async _createGame(event:Event): Promise<void> {
        event.preventDefault();

        const thumbnailBase64:any = await this.convertFileToBase64(this._thumbnail);
        const imagesBase64:any = await Promise.all(this._images.map(image => this.convertFileToBase64(image)));

        console.log(thumbnailBase64);

        const result: boolean = await this._adminService.createGame({
            gameTitle: this._gameTitle,
            Thumbnail: thumbnailBase64,
            Description: this._description,
            price: this._price,
            images: imagesBase64,
            url: this._url,
            authors: this._authors,
            tags: this._tags,
            status: ""
        });

        if (result) {

            alert("Successfully added game!");


        }

        console.log(result);

        console.log("Create game");
    }

    private convertFileToBase64(file: File | null): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (!file) {
                resolve("");
                return;
            }
    
            const reader:FileReader = new FileReader();
            
            reader.onloadend = ():void => {
                const result:any = reader.result;
                if (typeof result === "string") {
                    resolve(result);
                } else {
                    reject(new Error("Failed to read file as Base64."));
                }
            };
    
            reader.onerror = ():void => {
                reject(new Error("Failed to read file."));
            };
    
            reader.readAsDataURL(file);
        });
    }

    public render(): TemplateResult {
        return html`
            <h2>Create Game</h2>
            <form>
                <label for="">Game title</label>
                <!-- <custom-input-element type="text" class="gameTitle"  @input=${this.input} id="gameTitle" .value=${this._gameTitle} placeholder="Game Title" required></custom-input-element> -->
                <input type="text" class="gameTitle"  @input=${this.input} id="gameTitle" .value=${this._gameTitle} placeholder="Game Title" required">

                <label for="">Thumbnail</label>
                <!-- <custom-input-element class="thumbnail" id="thumbnail" @input=${this.input} type="file" accept="image/*" placeholder="thumbnail" required></custom-input-element> -->
                <input class="thumbnail" id="thumbnail" @input=${this.inputFile} type="file" accept="image/*" placeholder="thumbnail" required>

                <label for="">Description</label>
                <!-- <custom-input-element type="text" class="description"  @input=${this.input} id="description" .value=${this._description} placeholder="Description"></custom-input-element> -->
                <input type="text" class="description"  @input=${this.input} id="description" .value=${this._description} placeholder="Description">

                <label for="">Price</label>
                <!-- <custom-input-element type="string" class="price" @input=${this.input} id="price" .value=${this._price.toString()} placeholder="Price" required title="Please enter a valid price with up to two decimal places."></custom-input-element> -->
                <input type="number" class="price" @input=${this.input} id="price" .value=${this._price.toString()} placeholder="Price" required title="Please enter a valid price with up to two decimal places.">

                <!-- <label for="">Images</label>
                <input name="images" class="images" @input=${this.inputFiles} id="images" .value=${String(this._images)} type="file" accept="image/png*" multiple required> -->

                <label for="">Url</label>
                <!-- <custom-input-element type="text" class="url" @input=${this.input} id="url" .value=${String(this._url)} placeholder="Game Url" required></custom-input-element> -->
                <input type="text" class="url" @input=${this.input} id="url" .value=${String(this._url)} placeholder="Game Url" required>

                <label for="">Authors</label>
                <!-- <custom-input-element type="text" class="authors" @input=${this.input} id="authors" .value=${String(this._authors)} placeholder="Game Authors" required></custom-input-element> -->
                <input type="text" class="authors" @input=${this.input} id="authors" .value=${String(this._authors)} placeholder="Game Authors" required>

                <label for="">Tags</label>
                <!-- <custom-input-element type="text" class="tags" @input=${this.input} id="tags" .value=${String(this._tags)} placeholder="Tags" required></custom-input-element> -->
                <input type="text" class="tags" @input=${this.input} id="tags" .value=${String(this._tags)} placeholder="Tags" required>
                
                <button type="submit" @click="${this._createGame}">Create Game</button>
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
        console.log(target);

        // Retrieves the ID attribute of the target element
        const id: string = target.id;

        // Retrieves the ID attribute of the target element
        const value: string | number | string[] = target.value;

        // Switch statement to handle different input fields based on their IDs
        switch (id) {
            case "gameTitle":
                // Update username state variable and hide username error message
                this._gameTitle = value;
                break;

            case "description":
                // Update password state variable and hide password error message
                this._description = value;
                break;
                
            case "price":
                // Update repeat password state variable and hide repeat password error message
                this._price = parseFloat(value);
                break;

            case "url":
                // Update last name state variable and hide last name error message
                this._url = value;
                break;
            
            case "authors":
                // Update last name state variable and hide last name error message
                this._authors = value;
                break;

            case "tags":
                // Update last name state variable and hide last name error message
                this._tags = value;
                break;
        }
    }

    private inputFile(event: Event): void {
        const target:HTMLInputElement = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
          this._thumbnail = target.files[0];
        }
    }
    
    private inputFiles(event: Event): void {
        const target:HTMLInputElement = event.target as HTMLInputElement;
        if (target.files) {
            this._images = Array.from(target.files);
        }
    }
}

