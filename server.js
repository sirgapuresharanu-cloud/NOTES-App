
const http = require("http");
const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "notes.txt");
const PORT =process.env.PORT || 4000;

// Create notes.txt if it doesn't exist
if (!fs.existsSync("notes.txt")) {
    fs.writeFileSync("notes.txt", "");
}

// CREATE SERVER
const server = http.createServer((req, res) => {

    // ADD USERS
    if (req.url === "/add" && req.method === "POST") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {

            const user = JSON.parse(body);

            fs.appendFileSync(
                "notes.txt",
                JSON.stringify(user) + "\n"
            );

            res.end("User Added Successfully");
        });
    }

    // DISPLAY USERS
    else if (req.url === "/Users" && req.method === "GET") {

        const data = fs.readFileSync("notes.txt", "utf8");

        const users = data
            .split("\n")
            .filter(line => line.trim() !== "")
            .map(line => JSON.parse(line));

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify(users));
    }

    // DELETE USERS
    else if (req.url === "/delete" && req.method === "POST") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {

            const { email } = JSON.parse(body);

            const data = fs.readFileSync("notes.txt", "utf8");

            const users = data
                .split("\n")
                .filter(line => line.trim() !== "")
                .map(line => JSON.parse(line));

            const updateUsers = users.filter(
                user => user.email !== email
            );

            const newData = updateUsers
                .map(user => JSON.stringify(user))
                .join("\n");

            fs.writeFileSync(
                "notes.txt",
                newData ? newData + "\n" : ""
            );

            res.end("User Deleted Successfully");
        });
    }

    // OPEN HTML, CSS AND JS FILES
    else {

        let file = "public" + (
            req.url === "/" ? "/index.html" : req.url
        );

        fs.readFile(file, (err, data) => {

            if (err) {
                res.writeHead(404);
                res.end("File Not Found");
                return;
            }

            res.end(data);
        });
    }

});

// START SERVER
server.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
});
