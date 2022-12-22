import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
// import request from 'request'
import https from 'https'

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true, limit: '30mb' }));
app.use(express.json({ extended: true, limit: '30mb' }));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Neuws Backend Server');
})

// app.post('/newsapi', async (req, res) => {
//     console.log('fetching data');
//     const { category, country, page, pageSize, apiKey } = req.body;
//     const url = `https://newsapi.org/v2/top-headlines?category=${category}&country=${country}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`
//     console.log(url);
//     request(`${url}`, (error, response, body) => {
//         console.log(response.statusCode);
//         if (!error) {
//             res.send(body);
//             console.log('****************');
//             console.log('body : ', body);
//         } else {
//             console.log('error : ', error);
//         }
//     })
//     // try{
//     //     const data= await fetch(req.params.url);
//     //     const parsedData= await data.json();
//     //     res.send(parsedData);
//     // } catch(err){
//     //     console.log(err);
//     // }
// })

app.post("/newsapi", function (req, res) {
    const userAgent = req.get('user-agent');
    const { category, country, page, pageSize, apiKey } = req.body;
    const options = {
        host: 'newsapi.org',
        path: `/v2/top-headlines?category=${category}&country=${country}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`,
        headers: {
            'User-Agent': userAgent
        }
    }
    https.get(options, function (response) {
        let data;
        response.on('data', function (chunk) {
            if (!data) {
                data = chunk;
            }
            else {
                data += chunk;
            }
        });
        response.on('end', function () {
            const newsData = JSON.parse(data);
            // console.log(newsData);
            res.send(newsData);
        });
    });
});

app.listen(PORT, () => {
    console.log('Neuws Server started on PORT : ', PORT);
})