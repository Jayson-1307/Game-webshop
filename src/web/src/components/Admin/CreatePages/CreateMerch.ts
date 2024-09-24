import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { AdminService } from "../../../services/AdminService";
import "../../CustomInputElement";
import { RouterPage } from "../../RouterPage";


/**
 * Custom element based on Lit for creating a game.
 */
@customElement("create-merch")
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
    @state() private _merchName: string = "";
    @state() private _thumbnail: File | null = null;
    @state() private _price: number = 0; 
    @state() private _images: File[] = [];
    // @state() private _tags: string = "";
    @state() private _type: string = "";
    // @state() private _size: number = 0;
    @state() private _quantity: number = 0;

    private navigateTo(page: RouterPage): void {
        this.dispatchEvent(new CustomEvent("navigate", { detail: page }));
    }

    private async _createMerch(event:Event): Promise<void> {
        event.preventDefault();

        const thumbnailBase64:any = await this.convertFileToBase64(this._thumbnail);
        const imagesBase64:any = await Promise.all(this._images.map(image => this.convertFileToBase64(image)));

        const result: boolean = await this._adminService.createMerch({
            name: this._merchName,
            Thumbnail: thumbnailBase64,
            price: this._price,
            images: imagesBase64,
            type: this._type,
            quantity: this._quantity,
            status: ""
        });

        console.log(thumbnailBase64);

        if (result) {
            alert("Successfully added merchandise item!");
            this.navigateTo(RouterPage.AdminMerchOverview);
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
            <h2>Create Merch</h2>
            <form>
                <label for="">Merch name</label>
                <input type="text" class="merchName"  @input=${this.input} id="merchName" .value=${this._merchName} placeholder="Game Title" required">

                <label for="">Thumbnail</label>
                <input class="thumbnail" id="thumbnail" @change=${this.inputFile} type="file" accept="image/*" placeholder="thumbnail" required>

                <label for="">Price</label>
                <input type="number" class="price" @input=${this.input} id="price" .value=${this._price.toString()} placeholder="Price" required title="Please enter a valid price with up to two decimal places.">

                <!-- <label for="">Images</label>
                <input name="images" class="images" @change=${this.inputFiles} id="images" .value=${String(this._images)} type="file" accept="image/*" multiple required> -->

                <label for="">Type</label>
                <select name="type" id="type" class="type" @input=${this.input} .value=${String(this._type)}>
                    <option value="hoodies">Hoodies</option>
                    <option value="mugs">Mugs</option>
                    <option value="t-shirts">T-shirts</option>
                </select>
                <!-- <input type="text" class="type" @input=${this.input} id="type" .value=${String(this._type)} placeholder="Game Url" required> -->

                <label for="">Quantity</label>
                <input type="number" class="quantity" @input=${this.input} id="quantity" .value=${this._quantity.toString()} placeholder="quantity" required title="Please enter a valid number without any decimals.">
                
                <button type="submit" @click="${this._createMerch}">Create Game</button>
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
            case "merchName":
                // Update username state variable and hide username error message
                this._merchName = value;
                break;

            case "price":
                // Update repeat password state variable and hide repeat password error message
                this._price = parseFloat(value);
                break;

            case "type":
                // Update last name state variable and hide last name error message
                this._type = value;
                break;
            

            case "quantity":
                // Update repeat password state variable and hide repeat password error message
                this._quantity = parseFloat(value);
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

