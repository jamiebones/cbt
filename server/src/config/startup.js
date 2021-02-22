import mongoose from "mongoose";
import models from "../models";
import bcrypt from "bcrypt";
let saltRounds = 10;

const { DB_HOST, DB_PORT, DB_USER, DB_DATABASE, DB_PASSWORD } = process.env;

const collectionNames = [
  "exams",
  "examschedules",
  "examtakens",
  "questions",
  "users",
];

class DbConnection {
  constructor() {
    this._connect();
    this._createAdmin();
  }

  async _createAdmin() {
    try {
      const findAdmin = await models.User.findOne({
        email: "jamiebones147@gmail.com",
      });
      console.log("find admin is ", findAdmin);

      if (findAdmin) {
        console.log("admin is found");
      } else {
        console.log("about hashing password");
        const hash = await bcrypt.hash("blazing147", saltRounds);
        console.log("hash is ", hash);
        bcrypt.hash("blazing147", saltRounds, (err, hashData) => {
          if (!err) {
            console.log("hasing was successuful", hashData);
          }
        });
        const admin = {
          email: "jamiebones147@gmail.com",
          password: hash,
          active: true,
          userType: "super-admin",
        };
        const adminUser = new models.User(admin);
        await adminUser.save();
        console.log("admin saved");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async _connect() {
    try {
      let url;
      url = `mongodb://localhostmongo1:27017,localhostmongo2:27067,localhostmongo3:27054/${DB_DATABASE}`;
      // mongodb://<HOSTNAME>:27017,<HOSTNAME>:27018,<HOSTNAME>:27019/<DBNAME>
      if (process.env.NODE_ENV === "production") {
        // url = `mongodb://admin:blazing147server@mongo1:27017,mongo2:27018,mongo3:27019/${DB_DATABASE}`
      }
      const connection = await mongoose.connect(url, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
        keepAlive: true,
        //authSource: "admin",

        replicaSet: "rs0",
      });

      const conn = mongoose.connection;
      const collectionArray = await conn.db.listCollections().toArray();

      collectionArray.map((collection) => {
        const colName = collection.name;
        //check the index in the collection array
        const collectionIndex = collectionNames.indexOf(colName);
        if (collectionIndex === -1) {
          switch (colName) {
            case "exams":
              models.Exam.createCollection();
              break;
            case "examSchedules":
              models.ExamSchedule.createCollection();
              break;
            case "examtakens":
              models.ExamTaken.createCollection();
              break;
            case "questions":
              models.Question.createCollection();
              break;
            case "users":
              models.User.createCollection();
              break;
          }
        }
      });
      console.log("connection to database successful");
      return conn;
    } catch (error) {
      console.log(error);
    }
  }
}

const initDataBase = async () => {
  let url;
  url = `mongodb://cbt_localhostmongo1:27017,cbt_localhostmongo2:27067,cbt_localhostmongo3:27054/${DB_DATABASE}`;
  const connection = await mongoose.connect(url, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
    keepAlive: true,
    //authSource: "admin",

    replicaSet: "rs0",
  });
  const conn = mongoose.connection;
  const collectionArray = await conn.db.listCollections().toArray();

  collectionArray.map((collection) => {
    const colName = collection.name;
    //check the index in the collection array
    const collectionIndex = collectionNames.indexOf(colName);
    if (collectionIndex === -1) {
      switch (colName) {
        case "exams":
          models.Exam.createCollection();
          break;
        case "examSchedules":
          models.ExamSchedule.createCollection();
          break;
        case "examtakens":
          models.ExamTaken.createCollection();
          break;
        case "questions":
          models.Question.createCollection();
          break;
        case "users":
          models.User.createCollection();
          break;
      }
    }
  });
  console.log("connection to database successful");
  await _createAdminUser();
};

const _createAdminUser = async () => {
  try {
    const findAdmin = await models.User.findOne({
      username: "jamiebones147@gmail.com",
    });
    console.log("find admin is ", findAdmin);

    if (findAdmin) {
      console.log("admin is found");
    } else {
      const hash = bcrypt.hashSync("blazing147", saltRounds);
      const admin = {
        username : "jamiebones147@gmail.com",
        password: hash,
        name: "James Oshomah",
        active: true,
        userType: "super-admin",
      };
      const adminUser = new models.User(admin);
      await adminUser.save();
      console.log("admin saved");
    }
  } catch (error) {
    console.log(error);
  }
};

export default initDataBase;
