const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser= require('body-parser');
const models = require('./model');
const { del } = require('express/lib/application');

app.use(cors());
app.use(bodyParser());


app.get('/ideas', async (req, res, next) => {
    const ideas = await models.Ideas.findAll({
        include: [models.Categories, models.Words],
        where: {
            active: true,
            category: 1
        },
        order: [[
            'createdAt', 'DESC'
        ]]
    });

    res.json({ideas});
});

app.post('/ideas', async (req, res, next) => {
    console.log(req)
    const newIdea = await models.Ideas.create({
        word: req.body.word,
        idea: req.body.idea,
        category: req.body.category
      })

    res.status(200);
    res.send({
        msg: 'success',
        id: newIdea.dataValues.id
    });
})

/**
 * Deletes the record indicated in the id query param and returns an array of the affected records
 */
app.delete('/ideas', async (req, res, next) => {
    const deleteId = req.query.id;

    if (req.query.id === '' || typeof(parseInt(req.query.id)) === NaN ) return res.status(400).send('have to specify an iteger in id query param for this request');

    try {
        await models.Ideas.destroy({
            where: {id: req.query.id}
        });

        res.status(200).json({recordAffected: deleteId});
    } catch(e) {
        res.status(200).json({recordAffected: []});
    }
})

app.get('/words', async (req, res, next) => {
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

app.get('/categories', async (req, res, next) => {
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

app.listen(process.env.PORT || 3001)