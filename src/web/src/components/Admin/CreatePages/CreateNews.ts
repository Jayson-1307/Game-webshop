import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { AdminService } from "../../../services/AdminService";
import "../../CustomInputElement";
// import { RouterPage } from "../../RouterPage";


/**
 * Custom element based on Lit for creating a game.
 */
@customElement("create-news")
export class CreateNews extends LitElement {
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
    @state() private _title: string = "";
    @state() private _thumbnail: File | null = null;
    @state() private _description: string = ""; 
    @state() private _introduction: string = "";
    @state() private _content: string = "";

    // private navigateTo(page: RouterPage): void {
    //     this.dispatchEvent(new CustomEvent("navigate", { detail: page }));
    // }

    private async _createMerch(event:Event): Promise<void> {
        event.preventDefault();

        console.log(this._introduction);
        console.log(this._content);

        const thumbnailBase64:any = await this.convertFileToBase64(this._thumbnail);

        const result: boolean = await this._adminService.createNews({
            title: this._title,
            thumbnail: thumbnailBase64,
            description: this._description,
            introduction: this._introduction,
            content: this._content,
        });

        if (result) {
            alert("Successfully added merchandise item!");
            // this.navigateTo(RouterPage.AdminNewsOverview);
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
            <h2>Create News item</h2>
            <form>
                <label for="">News item title</label>
                <input type="text" class="newsTitle"  @input=${this.input} id="newsTitle" .value=${this._title} placeholder="News item Title" required>

                <label for="">Thumbnail</label>
                <input class="thumbnail" id="thumbnail" @input=${this.inputFile} type="file" accept="image/*" placeholder="thumbnail" required>
                
                <label for="">Description</label>
                <input type="text" class="description"  @input=${this.input} id="description" .value=${this._description} placeholder="News item description" required>

                <label for="">Introduction</label>
                <input type="text" class="introduction"  @input=${this.input} id="introduction" .value=${this._introduction} placeholder="News item introduction" required>

                <label for="">Content</label>
                <textarea type="textarea" class="content"  @input=${this.input} id="content" .value=${this._content} placeholder="News item content" required></textarea>

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
            case "newsTitle":
                // Update username state variable and hide username error message
                this._title = value;
                break;
            case "description":
                // Update repeat password state variable and hide repeat password error message
                this._description = value;
                break;
            case "images":
                // Update first name state variable and hide first name error message
                this._introduction =  value;
                break;
            case "introduction":
                // Update last name state variable and hide last name error message
                this._introduction = value;
                break;

            case "content":
            // Update last name state variable and hide last name error message
            this._content = value;
            break;
        }
    }

    private inputFile(event: Event): void {
        const target:HTMLInputElement = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
          this._thumbnail = target.files[0];
        }
    }
}

