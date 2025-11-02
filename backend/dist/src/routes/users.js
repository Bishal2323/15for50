"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/me', auth_1.requireAuth, async (req, res) => {
    const user = req.user;
    return res.json({ user });
});
exports.default = router;
//# sourceMappingURL=users.js.map