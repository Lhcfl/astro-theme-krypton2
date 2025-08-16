import moment from "moment";
import fs from "node:fs";
import { exit } from "node:process";
const argc = process.argv.length;
const argv = process.argv;
console.log("Arguments:", argv);
if (argc <= 2) {
  console.log("Usage: {} <blog-name>", argv[0]);
  exit(0);
}
const blogName = argv.at(-1);
const blogPath = `./data/blog/${blogName}.md`;

fs.writeFileSync(
  blogPath,
  `---
title: ${blogName}
date: ${moment().format("YYYY-MM-DD HH:mm:ss")}
---
`
);

console.log(`Write to ${fs.realpathSync(blogPath)}`);
