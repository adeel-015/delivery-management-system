API docs and admin creation

OpenAPI: `docs/openapi.yaml`

Purpose:

- Document all backend endpoints (auth, orders, stats).
- Clarify that `admin` role is supported server-side but intentionally hidden from the frontend UI.

How to create an admin account (recommended approaches):

1. Manual DB insertion (recommended for safety)

- Connect to your MongoDB instance and insert a user with `role: 'admin'` and a hashed password.
- Use a short Node script to create an admin via the same Mongoose model to ensure password hashing.

Example Node script (run in `delivery-backend` with `node create-admin.js`):

```js
// create-admin.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User =
  require("./dist/models/User").default || require("./src/models/User");

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const password = "ReplaceWithAStrongPassword";
  const hash = await bcrypt.hash(password, 10);
  const admin = new User({
    name: "Admin",
    email: "admin@example.com",
    password: hash,
    role: "admin",
  });
  await admin.save();
  console.log("Admin created, id=", admin._id);
  process.exit(0);
}
run().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

2. Use the `POST /auth/register` endpoint (not recommended)

- If your backend currently permits `role: 'admin'` in registration, you can POST an `admin` role there — but this makes admin creation public and is generally unsafe in production.

3. Add an admin creation code path protected by an env secret (optional)

- You can implement a small admin-creation route that requires a server-side `ADMIN_SECRET` to be provided; this is more secure than public registration but easier than DB insertion.

Curl example to create a normal user (buyer):

```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"pass","role":"buyer"}'
```

Security notes:

- Keep admin creation off public UIs; use direct DB or protected server-only scripts.
- Rotate any admin secrets and use strong passwords or one-time onboarding flows.

If you'd like, I can:

- Add a small `create-admin.js` script under `delivery-backend/scripts/` and a README snippet showing how to run it, or
- Add a protected `POST /admin/create` route that requires an `ADMIN_SECRET` env var.

Tell me which you'd prefer and I'll add it for you.
