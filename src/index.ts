import app from "./app";

const PORT = process.env.PORT as unknown as number || 4000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running...`);
});
