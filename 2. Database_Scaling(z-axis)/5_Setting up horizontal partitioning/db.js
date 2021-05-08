const { LocalStorage } = require('node-localstorage')

/**
 * what happens when we have so many cats that they cannot be handled by a single database or a single file. The answer is to create shards and horizontally
 * partition our cat data. So we're gonna make this change here in the db file because we don't want to change the way the users use the database, we just want
 * to change the way the data is stored in the database. 
 */
const dbA = new LocalStorage('data-a-m')
const dbB = new LocalStorage('data-m-z')

// What we really need is a sharding function or a function that will tell us which database to use. So I'll add which db and we'll take in the name 
// of the cat and what we're gonna do is check the name.
const whichDB = name => name.match(/^[A-M]|^[a-m]/) ?
  dbA : dbB

const loadCats = db => JSON.parse(db.getItem("cats") || '[]')

const hasCat = name => loadCats(whichDB(name))
    .map(cat => cat.name)
    .includes(name)

module.exports = {

    addCat(newCat) {
        if (!hasCat(newCat.name)) {
            let db = whichDB(newCat.name)
            let cats = loadCats(db)
            cats.push(newCat)
            db.setItem("cats", JSON.stringify(cats, null, 2))
        }
    },

    findCatByName(name) {
        let db = whichDB(name)
        let cats = loadCats(db)
        return cats.find(cat => cat.name === name)
    },

    findCatsByColor(color) {
        return [
          ...loadCats(dbA).filter(cat => cat.color === color),
          ...loadCats(dbB).filter(cat => cat.color === color),
        ]
    }

}

/**
 * what happens when we have so many cats that they cannot be handled by a single database or a single file. The answer is to create shards and horizontally
 * partition our cat data. So we're gonna make this change here in the db file because we don't want to change the way the users use the database, we just want
 * to change the way the data is stored in the database. 
 */