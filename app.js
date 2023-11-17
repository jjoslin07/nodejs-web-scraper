require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const website = process.env.WEBSITE || 'https://news.sky.com';

let content = [];

async function fetchData() {
	try {
		const response = await axios.get(website);
		const data = response.data;
		const $ = cheerio.load(data);

		// Assuming you want to get all 'a' tags and their href attributes
		$('a', data).each(function () {
			const title = $(this).text().trim(); // Get the text content of the link
			const url = $(this).attr('href'); // Get the href attribute

			content.push({
				title,
				url,
			});
		});

		const jsonContent = JSON.stringify(content, null, 2);
		const filePath = 'output.json';

		// Delete the existing file if it exists
		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
		}

		// Write the JSON content to a file named output.json
		fs.writeFileSync(filePath, jsonContent);

		console.log('Content fetched and saved.');
	} catch (error) {
		console.log(error.message);
	}
}
app.get('/', (req, res) => {
	// Respond with the current content (or some other information)
	res.json(content);
});

// Initial fetch and save when the server starts
setInterval(() => {
	fetchData();
}, 10000);
app.listen(PORT, () => {
	console.log(`Server is running on PORT:${PORT}`);
});
