/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import { handleTokenBasedAuthentication } from "./middlewares/authenticationMiddleware";
import { UserController } from "./controllers/UserController";
import { OrderItemController } from "./controllers/OrderItemController";
import { AdminController } from "./controllers/AdminController";

export const router: Router = Router();

const userController: UserController = new UserController();
const orderItemController: OrderItemController = new OrderItemController();
const adminController: AdminController = new AdminController();

router.get("/", (_, res) => {
    res.send("Hello, welcome to RetroGameStore API!");
});

router.get("/gameOverview", (_req, res) => {
    res.redirect(301, "/game-overview");
});

router.post("/users/register", (req, res) => userController.register(req, res));
router.post("/users/check-email", (req, res) => userController.checkExistingEmail(req, res));
router.post("/users/login", (req, res) => userController.login(req, res));
router.post("/users/update-password", (req, res) => userController.updatePassword(req, res));
router.get("/game-overview", orderItemController.getAllGames);
router.get("/merch-overview", orderItemController.getAllMerch);
router.get("/game-overview/:sort/:order", orderItemController.getAllGames);

router.get("/home-games", orderItemController.getFourRandomGames);
router.get("/home-merch", orderItemController.getThreeRandomMerch);
router.get("/orderItems", orderItemController.getAll);
router.get("/game-detail/:id", orderItemController.getGameById);
router.get("/getMerch/:id", (req, res) => orderItemController.getMerchById(req, res));
router.get("/related-items/:merchType-:merchId", orderItemController.getThreeRelatedItems);

router.get("/users/bills/:id", userController.getUserBills);
router.get("/users/library/:id", userController.getUserLibrary);

// Admin routes
router.get("/admin/sales", adminController.getAllSales);
router.get("/admin/bills", adminController.getAllBills);
router.get("/admin/merch", adminController.getAllMerch);
router.get("/admin/news", adminController.getAllNewsItems);


router.get("/admin/users", adminController.getAllUsers);
router.get("/admin/admins", adminController.getAllAdmins);
router.get("/admin/employees", adminController.getAllEmployees);

// Admin Create
router.post("/admin/create-game", adminController.createGame);
router.post("/admin/create-merch", adminController.createMerch);
router.post("/admin/create-news", adminController.createNews);
router.post("/admin/create-account", adminController.createAccount);


// Admin Get
router.get("/admin/user/:userId", adminController.getUserProfile); // Fetch user profile
router.get("/admin/news-detail/:id", adminController.getNewsById);
router.get("/admin/game-detail/:id", adminController.getGameById);
router.get("/admin/merch-detail/:id", adminController.getMerchById);

// Admin Edit
router.put("/admin/user/:userId", adminController.updateUserProfile); // Update user profile
router.put("/admin/user/deactivate/:userId", (req, res) => adminController.deactivateUserProfile(req, res));
router.put("/admin/news/:id", adminController.updateNews); 
router.put("/admin/game/:id", adminController.updateGame);
router.put("/admin/merch/:id", adminController.updateMerch);
router.get("/bill-detail/:billId", adminController.getBillById);
router.put("/admin/merch/:id", adminController.updateMerch);

// Admin delete
router.delete("/admin/user/:userId", adminController.deleteUserProfile); // Delete user profile
router.delete("/admin/news/:id", adminController.deleteNews);
router.delete("/admin/game/:id", adminController.deleteGame);
router.delete("/admin/merch/:id", adminController.deleteMerch);



// NOTE: Everything after this point only works with a valid JWT toke   n!
router.use(handleTokenBasedAuthentication);

router.get("/users/logout", (req, res) => userController.logout(req, res));
router.get("/users/hello", (req, res) => userController.hello(req, res));
router.post("/users/add-to-cart/:productId", (req, res) => orderItemController.addOrderItemToCart(req, res));
router.post("/users/add-in-cart/:productId", (req, res) => orderItemController.addQuantityInCart(req, res));
router.post("/users/sub-in-cart/:productId", (req, res) => orderItemController.subQuantityInCart(req, res));
router.get("/users/show-cart", (req, res) => orderItemController.showUserCartItems(req, res));
router.delete("/users/delete-in-cart/:productId", (req, res) => orderItemController.deleteUserCartItem(req, res));
router.get("/users/getUser", (req, res) => userController.getUser(req, res));
router.get("/users/userWithAddressDelivery", (req, res) => userController.getUserWithAddressDelivery(req, res));
router.post("/users/addorUpdateDeliveryAddress", (req, res) => userController.addOrUpdateDeliveryAddress(req, res));

router.get("/users/getUserWithAddressBilling", (req, res) => userController.getUserWithAddressBilling(req, res));
router.post("/users/addorUpdateBillingAddress", (req, res) => userController.addorUpdateBillingAddress(req, res));
router.post("/users/bill/createBillAndAddProducts", (req, res) => orderItemController.createBillAndAddProducts (req, res));
router.get("/users/bill/:billId", (req, res) => orderItemController.getBillData(req, res));
router.post("/users/add-to-library/:gameId", (req, res) => orderItemController.addGameToLibrary (req, res));
router.delete("/users/delete-all-user-cart-items", (req, res) => orderItemController.deleteAllUserCartItems(req, res));
router.get("/users/is-game-in-library/:gameId", (req, res) => orderItemController.isGameInLibrary(req, res));
router.get("/users/auth-level", (req, res) => userController.getAuthLevel(req, res));

export default router;
