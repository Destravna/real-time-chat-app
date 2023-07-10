require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://root:${process.env.db_pass}@cluster0.gw2de.mongodb.net/e2echat?retryWrites=true&w=majority`,
            { useNewUrlParser: true }
        );
        console.log('Connected to the database');
    } catch (err) {
        console.log(err);
    }
})();