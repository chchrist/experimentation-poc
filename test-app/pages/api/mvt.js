const fs = require("fs");

export default (req, res) => {
  if (req.method === "POST") {
    console.log(req.body);

    fs.writeFile("script.json", JSON.stringify(req.body), err => {
      if (err) console.log(err);
      console.log("Successfully Written to File.");
      res.statusCode = 200;
      res.end();
    });
  }

  if (req.method === "GET") {
    fs.readFile("color.json", (err, buf) => {
      if (err) console.log(err);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.parse(buf));
    });
  }
};
