import express from "express";
const router = express.Router();
router.get("/hello", (req, res) => {
    res.json({
        messages: "heloo from movies",
    });
});
export default router;
//# sourceMappingURL=movieRoutes.js.map