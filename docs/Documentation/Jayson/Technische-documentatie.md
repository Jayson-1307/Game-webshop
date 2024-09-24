# Technische documentatie sprint 2

## Logout
### UserServie.ts
```typescript
/**
     * Handles user logout
     *
     * @returns `true` when successful, otherwise `false`.
     */
    public async logout(): Promise<boolean> {
        /** 
         * gets token
         * if token is available it sends GET request to "logout"endpoint with the token
        */
    }
```
De UserServer class handelt functionaliteiten af met betrekking tot users, inclusief dus de logout methode. De logout methode verzendt een get request naar het users/logout endpoint en voltooid de logout functie wanneer dit succesvol is.

<br>

### Routes
```ts
    /** 
     * creates route route on Express router instance that listens for Get requests at path '/user/logout'
     * When hit, executes userController.logout function
     * 
    */
    router.get("/users/logout", (req, res) => userController.logout(req, res)); 
```
De routes zijn verandwoordelijk voor het koppelen van http-verzoekmethodes en url patronen aan de juist controllermethoden. Hier word de /users/logout route gekoppeld aan de logout methode in de usercontroller.
<br>

### Usercontroller.ts
```ts
    /**
     * Logout a user using a valid JWT token
     *
     * Always returns a 200 signaling success
     *
     * @param _ Request object (unused)
     * @param res Response object
     */
    public logout(_: Request, res: Response): void {

        console.log("logged out here");

        res.json({
            message: "You are logged out.", // Send a 200 response with a logout message
        });
    }
```
De UserController class bevat methodes voor het afhandelen van verzoeken met betrekking tot users, waaronder dus het uitloggen van users. Dit is geschreven door school, maar ik heb het gebruikt dus wou laten zien dat ik weet hoe het werkt. 
<br>


### Navbar.ts
```typescript
    /**
     * Handler for the logout button
     * Redirects you to lgo
     */
    private async clickLogoutButton(): Promise<void> {
        // removes token, sets _isLoggedIn to false, and redirects user to login page. 
    }

    /** 
     * Triggers the logout button on click
    */
    <span class="dropdown-item" @click=${this.clickLogoutButton}>Logout</span>
```
De uitlogknop staat in een account dropdown menu in de navbar. Hier is te zien hoe die word ingeladen, en hoe de logoutfunctie met de knop word gelinkt. Zodra er op het uitlog element word geklikt, word de clickLogoutButton functie geactiveerd. 

<br>

## Homepage slider
### OrderItemService.ts
```ts
/**
     * Get four random games from database
     * 
     * @returns A list of 4 random games when succesful, otherwise undefined.
     */
    public async getFourRandomGames(): Promise<any> {
        ...
    }
```
De orderItemservice class handelt functionaliteiten af met betrekking tot orderitems, inlcusief het ophalen van 4 random games. De getFourRandomGames methode verzendt een get request naar het home-games endpoint en retourneert een lijst van 4 random games wanneer het verzoek succesvol is. 

<br>

### Routes.ts
```ts
    /** 
     * creates route on Express router instance that listens for Get requests at path '/home/games'
     * 
     * When hit, executes the orderItemController.getFourGames
    */
    router.get("/home-games", orderItemController.getFourRandomGames);
```
<br>
De routes zijn verandwoordelijk voor het koppelen van http-verzoekmethodes en url patronen aan de juist controllermethoden. Hier word de /home-games route gekoppeld aan de getFourGames methode in de orderItemController.


### OrderItemController.ts
```ts
/**
     * Get four random games from the database with an inner join with the product table.
     * 
     * @param req Request object
     * @param res Response object
     */
    public async getFourRandomGames(_req: Request, res: Response): Promise<void> {
        /** 
         * Gets 4 random games from database with sql query using RAND(). 
        */
    }
```
De OrderItemController klasse bevat methoden voor het afhandelen van verzoeken met betrekking tot orderitems, waaronder het ophalen van 4 random spellen, in dit geval door "RAND()" en "LIMIT 4" te gebruiken in de sql query.

<br>


### Home.ts 
```ts
    /**
     * Nagiates to the chosen page
     * @param page - the page to navigate to
     * @param gameID - game-Id of selected game
     */
    private navigateTo(page: RouterPage, gameId?: string): void {
            
        }

    /**
     * gets games using orderItemService.getFourRandomGames function
     */
    private async getRandomGames(): Promise<void> {
        // gets random games and puts them in _randomGames array
    }

    /**
     * Renders the home page, which contains a list of all order items.
     */
    public render(): TemplateResult {
        return html`
            ...
                // creates slider elements per game
                ${this._randomGames.map(game => html`
                    <div class="carousel-item active">
                        <img class="d-block w-100" src="${game.thumbnail}" alt="First slide">
                        <div class="add-to-cart">
                            <button class="btn button secondairy" @click=${(): void => this.navigateTo(RouterPage.GameDetail, game.id)}>More information</button>
                        </div>
                    </div>
                `)}  
            ...
        `;
    }
```
In Home.ts word de front-end van de game slider geladen. Hierbij word alle opgehaalde informatie verwerkt en weergeven. 
