# Technische docuumentatie Register 

> ## UserService
> ```ts
> import { UserRegisterFormModel } from "@shared/formModels/UserRegisterFormModel";
> import { TokenService } from "./TokenService";
> 
> export class UserService {
>     private _tokenService: TokenService = new TokenService();
> 
>     public async register(formData: UserRegisterFormModel): Promise<boolean> {
>         // Verzend een POST-verzoek naar het registratie-eindpunt met de verstrekte registratiegegevens
>         // Als het antwoord OK is, retourneer true, anders retourneer false
>     }
> 
>     public async checkExistingEmail(email: string): Promise<boolean> {
>         // Verzend een POST-verzoek om te controleren of het e-mailadres al bestaat
>         // Retourneer true als het e-mailadres bestaat, anders retourneer false
>     }
> 
>     // Andere methoden...
> }
> ```
> De UserService-klasse is verantwoordelijk voor het verwerken van gebruikersgerelateerde functionaliteiten, zoals registratie en het controleren van bestaande e-mailadressen. In de register-methode wordt een POST-verzoek naar het registratie-eindpunt gestuurd met de verstrekte registratiegegevens, waarbij vervolgens wordt gecontroleerd of de registratie succesvol is verlopen. De checkExistingEmail-methode controleert of het opgegeven e-mailadres al bestaat in de database door middel van een POST-verzoek naar het controle-eindpunt.

> ## Routes
> ```ts
> import { Router } from "express";
> import { UserController } from "./controllers/UserController";
> 
> export const router: Router = Router();
> const userController: UserController = new UserController();
> 
> router.post("/users/register", (req, res) => userController.register(req, res));
> router.post("/users/check-email", (req, res) => userController.checkExistingEmail(req, res));
> // Andere route handlers
> ```
> De router definieert verschillende eindpunten voor het afhandelen van gebruikersverzoeken. De eindpunten voor registratie en het controleren van bestaande e-mailadressen worden gekoppeld aan de respectievelijke methoden in de UserController.

> ## UserController
> ```ts
> import { Request, Response } from "express";
> import { UserRegisterFormModel } from "@shared/formModels";
> import { UserService } from "../services/UserService";
> 
> export class UserController {
> 
>     public async register(req: Request, res: Response): Promise<void> {
>         // Verwerk het POST-verzoek voor registratie met de verstrekte formuliergegevens
>     }
> 
>     public async checkExistingEmail(req: Request, res: Response): Promise<void> {
>         // Verwerk het POST-verzoek om te controleren of het e-mailadres al bestaat
>     }
> 
>     // Andere methoden...
> }
> ```
> De UserController bevat methoden voor het verwerken van verzoeken met betrekking tot gebruikers, zoals registratie en het controleren van bestaande e-mailadressen. In de register-methode wordt het POST-verzoek voor registratie verwerkt door de verstrekte formuliergegevens naar de UserService te sturen. De checkExistingEmail-methode verwerkt het POST-verzoek om te controleren of het opgegeven e-mailadres al bestaat, ook door de UserService aan te roepen.

> ## Register
>```ts
> import { LitElement, html, css, customElement, state } from "lit";
> import { UserService } from "../services/UserService";
> import { RouterPage } from "./RouterPage";
> 
> @customElement("webshop-register")
> export class Register extends LitElement {
>     // Methoden en logica voor registratieformulier, inclusief het controleren van het bestaan van e-mail
> }
>```
> De registratiecomponent bevat het gebruikersinterface voor het registratieformulier. Het verwerkt gebruikersinvoer en communiceert met de UserService om registratieverzoeken te verzenden en het bestaan van e-mailadressen te controleren.