const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  storage: './test2.db',
  dialect: 'sqlite',
});

class User extends Model { }

User.init({
  username: DataTypes.STRING,
  birthday: DataTypes.DATE
}, { sequelize, modelName: 'teachers' });

(async () => {
  await sequelize.sync();

  var jane = await User.findOne({
    username: 'janedoe'
  })

  jane.set('username', 'jane')
  jane.save()

  console.log(jane.toJSON());
})();
