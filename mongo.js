const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://cerros384:${password}@phonebook.ybtqikx.mongodb.net/phonebook?retryWrites=true&w=majority&appName=phonebook`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', noteSchema)

if(process.argv.length ===3){
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name, person.number)
            });
            mongoose.connection.close()
            })
} else if (process.argv.length === 5){
    const name = process.argv[3];
    const number = process.argv[4];

    const person = new Person({
      name: name,
      number: number,
    });
    person.save().then(() => {
      console.log(`added ${name} number ${number} to the phonebook`)
      mongoose.connection.close()
    });
} else {
    console.log('Please provide the name and number as arguments: node mongo.js <password> <name> <number>');
    process.exit(1);
}

