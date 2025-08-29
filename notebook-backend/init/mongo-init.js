const DB_APP_USER = process.env.DB_APP_USER;
const DB_APP_PASSWORD = process.env.DB_APP_PASSWORD;
const DB_APP_DB_NAME = process.env.DB_APP_DB_NAME;

if (!DB_APP_USER || !DB_APP_PASSWORD || !DB_APP_DB_NAME) {
    console.error("Missing required environment variables.");
    process.exit(1);
}

db = db.getSiblingDB(DB_APP_DB_NAME);
db.createUser({
    user: DB_APP_USER,
    pwd: DB_APP_PASSWORD,
    roles: [{ role: "readWrite", db: DB_APP_DB_NAME }],
});

print("Database user created successfully.");
