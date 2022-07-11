const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const { markAsUntransferable } = require('worker_threads');

const app = express();


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/signup.html`)
})

app.post('/', (req, res) => {
    const userName = req.body.username;
    const userSurname = req.body.surname;
    const userEmail = req.body.email;

    const data = {
        members: [
            {
                email_address: userEmail,
                status: 'subscribed',
                merge_fields: {
                    FNAME: userName,
                    LNAME: userSurname,
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us12.api.mailchimp.com/3.0/lists/374bac4a5b"

    const options = {
        auth: "roman:8451d4f3518bc4622fd34bc5e9338111-us12",
        method: "POST",
    }

    const request = https.request(url, options, (response) => {

        response.statusCode === 200 ? res.sendFile(`${__dirname}/success.html`) : res.sendFile(`${__dirname}/failure.html`);
        console.log(response.statusCode);

        response.on('data', (data) => console.log(JSON.parse(data)));
    })

    request.write(jsonData);
    request.end();


});


app.listen(process.env.PORT || 3000, () => console.log('Server is running on port 3000'))

//API KEY
//8451d4f3518bc4622fd34bc5e9338111-us12

//List ID
//374bac4a5b