require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser= require('body-parser');
const models = require('./model');
const { del } = require('express/lib/application');
const Sequelize = require('sequelize');
const fs = require('fs');
const https = require('https');
const morgan = require('morgan');


app.use(cors());
app.use(bodyParser());

app.use(morgan('dev'));


app.get('/api/ideas/:userid', async (req, res, next) => {
    const ideas = await models.Ideas.findAll({
        include: [models.Categories, models.Words],
        where: {
            active: true,
            category: 1,
            user: req.params.userid
        },
        order: [[
            'createdAt', 'DESC'
        ]]
    });

    res.json({ideas});
});

app.post('/api/ideas', async (req, res, next) => {
    console.log(req)
    const newIdea = await models.Ideas.create({
        word: req.body.word,
        idea: req.body.idea,
        category: req.body.category,
        user: req.body.user
      })

    res.status(200);
    res.send({
        msg: 'success',
        id: newIdea.dataValues.id
    });
})

app.patch('/api/ideas', async (req, res, next) => {
    console.log(req.body)
    const newIdea = await models.Ideas.update({
        idea: req.body.idea.idea,
        },{
        where: {
            id: req.body.idea.id
          }
        })

    res.status(200);
    res.send({
        msg: 'success',
        id: req.body.idea.id
    });
})

/**
 * Deletes the record indicated in the id query param and returns an array of the affected records
 */
app.delete('/api/ideas', async (req, res, next) => {
    const deleteId = req.query.id;

    if (req.query.id === '' || typeof(parseInt(req.query.id)) === NaN ) return res.status(400).send('have to specify an iteger in id query param for this request');

    try {
        await models.Ideas.destroy({
            where: {id: req.query.id}
        });

        res.status(200).json({recordAffected: deleteId});
    } catch(e) {
        console.log(e)
        res.status(200).json({recordAffected: []});
    }
})

app.get('/api/words', async (req, res, next) => {
    const words = await models.Words.findAll({
        where: {
            active: true,
            category: 1
        },
        order: [[
            'createdAt', 'DESC'
        ]]
    });

    res.json({words});
});

app.get('/api/randomword/:categoryId', async (req, res, next) => {
    if (req.params.categoryId === undefined) return res.status(400).send('Must include category id as query parameter');

    const word = await models.Words.findAll({
        where: {
        active: true,
            category: req.params.categoryId
        },
        order: [[
        Sequelize.literal('rand()')
        ]],
        limit: 1
    });

    if (word.length === 0) {// no words in category
        res.json({
            msg: 'no words in category',
            word: null
        })
    } else {
        res.json({
            msg: 'success',
            word: word[0],
        })
    }
})

app.get('/api/categories', async (req, res, next) => {
    const categories = await models.Categories.findAll({
        where: {
            active: true,
        },
        order: [[
            'createdAt', 'DESC'
        ]]
    });

    res.json({categories});
});

app.get('/api/users/:email', async (req, res, next) => {
    const user = await models.Users.findAll({
        where: {
            email: req.params.email,
        },
        order: [[
            'createdAt', 'DESC'
        ]]
    });

    res.json({user});
});

app.post('/api/users', async (req, res, next) => {
    console.log('creating new user with ', req.body)
    const newUser = await models.Users.create({
        email: req.body.email,
        firstname: req.body.given_name,
        lastname: req.body.family_name,
        picture: req.body.picture
    });

    res.status(200);
    res.send({
        msg: 'success',
        id: newUser.dataValues.id
    });
});


console.log(process.env.HTTPS)
if (process.env.HTTPS === 'true') {
    // This line is from the Node.js HTTPS documentation.
    var options = {
        key: fs.readFileSync('./codypacestudios.com.key.pem'),
        cert: fs.readFileSync('./codypacestudios.com.pem')
    };
        
    console.log('starting http server with options', options)

    // Create an HTTPS service identical to the HTTP service.
    https.createServer(options, app).listen(443);
} else {
    app.listen(process.env.PORT || 3001)
}


