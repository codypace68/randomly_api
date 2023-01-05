const { all } = require('express/lib/application');
const {
    Sequelize,
    Model,
    DataTypes
  } = require('sequelize');
const {removeStopwords} = require('stopword');

const sequelize = new Sequelize('mysql://root:password@localhost:3306/ideas') // Example for mysql

try {
sequelize.authenticate();
console.log("Connection has been established successfully.")
} catch (e) {
console.log("Unable to connect", e)
}

// Category Table Setup
// ---------------------------------------
const Categories = sequelize.define('Categories', {
  // Model attributes are defined here
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
  }
});

Categories.sync({alter:false}).then(err => {
  if (err) {
    console.log('Error occured while creating table', err);
  } else {
    console.log('Categories Table created successfully');
  }
})

// setTimeout(()=>{
//     Categories.create({
//         category: "General",
//         active: true
//     }).then(()=> {
//         console.log('category filled in');
//     })
// },3000)


// Ideas Table Setup
// ---------------------------------------
const Words = sequelize.define('Words', {
  // Model attributes are defined here
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
    allowNull: false,
  },
  category: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  word: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  definition: {
    type: DataTypes.STRING,
    allowNull: true
  },
  active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
  }
});

Words.belongsTo(Categories, {foreignKey: 'category'});

Words.sync({alter:false}).then(err => {
  if (err) {
    console.log('Error occured while creating table', err);
  } else {
    console.log('Ideas Table created successfully');
  }
})

// setTimeout(()=>{
//     Words.create({
//         category: 1,
//         word: 'balloon',
//         active: true
//     }).then(()=> {
//         console.log('balloon');
//     })
//     Words.create({
//         category: 1,
//         word: 'kite',
//         active: true
//     }).then(()=> {
//         console.log('kite');
//     })
//     Words.create({
//         category: 1,
//         word: 'dog',
//         active: true
//     }).then(()=> {
//         console.log('dog');
//     })
// },3000)


// Ideas Table Setup
// ---------------------------------------
const Ideas = sequelize.define('Ideas', {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
    },
    category: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    word: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idea: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
  });

Ideas.belongsTo(Categories, {foreignKey: 'category'});
Ideas.belongsTo(Words, {foreignKey: 'word'});

Ideas.sync({alter:false}).then(err => {
if (err) {
    console.log('Error occured while creating table', err);
} else {
    console.log('Ideas Table created successfully');
}
})

// setTimeout(()=>{
//     Ideas.create({
//         rating: 3,
//         category: 1,
//         word: 2,
//         idea: "fly a kite with a child",
//         active: true
//     }).then(()=> {
//         console.log('default idea added');
//     })
// },3000)

exports.Words = Words;
exports.Ideas = Ideas;
exports.Categories = Categories;


// setTimeout(removeWords, 3000);

// async function removeWords() {
//   console.log('running removeWords()');

//   const allWords = await Words.findAll({
//     where: {
//       active: true,
//     },
//   });

//   let oldWords = [];
//   let oldIds = [];
//   let newWords = [];
//   let newIds = [];

//   allWords.forEach(word => {
//     oldWords.push(word.dataValues.word);
//     oldIds.push(word.dataValues.id);
//   })

//   newWords = removeStopwords(oldWords);

//   let wordsToRemove = oldWords.filter((wd) => newWords.indexOf(wd) === -1 );
//   console.log(newWords);

//   // wordsToRemove.forEach(wd => {
//   //   Words.update({active:false},{where: {word:wd}});
//   //   console.log('deactivated ' + wd);
//   // })

// }

