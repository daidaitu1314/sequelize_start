var express = require('express');
// 导入Sequelize模块
var Sequelize = require('sequelize');
// 创建Sequelize连接实例
const sequelize = new Sequelize('mytest', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql' // 指定数据库的方言
});

// 使用ORM要操作数据，必须先定义操作的数据的实体对象
var User = sequelize.define('custom', {
  id: { // 主键Id
    primaryKey: true, // 是否为主键
    allowNull: false, // 是否允许为空
    autoIncrement: true, // 主键自动增长
    type: Sequelize.INTEGER // 当前字段类型
  },
  name: { // 用户名
    allowNull: false,
    type: Sequelize.STRING
  },
  age: Sequelize.INTEGER, // 年龄
  gender: Sequelize.STRING, // 性别
  address: Sequelize.STRING, // 地址
  isdel: {// 是否删除
    type: Sequelize.BOOLEAN,
    defaultValue: false // 默认值为false
  },
  ctime: Sequelize.DATE // 创建时间
}, {
    // timestamps: false // 取消ORM框架的一些默认行为，如果不将 timestamps 设置为 false，则默认会给表添加`createdAt`和`updatedAt`两个字段
  });

// 创建express的服务器实例
var app = express();

// 创建数据
app.get('/', function (req, res) {
  // 可以使用 sync() 方法，来判断数据表是否存在，如果不存在则创建新表，如果存在则直接对表进行操作
  User.sync().then(() => {
    User.create({ // 通过 Model.create() 方法来创建数据并保存到数据库中
      name: 'zhangsan',
      age: 21,
      gender: '男',
      address: '中国北京',
      ctime: new Date()
    });
  });
  res.send('create OK');
});

// 根据Id更新数据
app.get('/update', function (req, res) {
  User.sync().then(() => {
    User.update({ // 通过 Model.update() 方法来更新数据，第一个参数是要更新的字段值，以对象的形式提供
      age: 22,
      gender: '女'
    }, { // 第二个参数是更新时候的选项
        where: { // 更新条件
          id: 1
        }
      });
  });
  res.send('update OK');
});

// 查找所有数据
app.get('/findall', function (req, res) {
  User.sync().then(() => {
    User.findAll().then((result) => {
      res.json(result);
    });
  });
});

// 根据Id获取数据
app.get('/findbyid', function (req, res) {
  User.sync().then(() => {
    User.findById(2).then((custom) => { // 通过 Model.findById() 来查询指定Id的数据
      res.json(custom);
    });
  });
});

// 根据主键获取数据
app.get('/findbyprimary', function (req, res) {
  User.findByPrimary(1).then((custom) => { // 通过 Model.findByPrimary() 来查询指定数据
    res.json(custom);
  });
});

// 查找或者创建一条新纪录
app.get('/findOrCreate', function (req, res) {
  var newUser = {
    name: '小红',
    age: 12,
    gender: '女',
    address: '中国上海'
  };
  // 查询或者创建一个新对象，返回值是一个数组：索引0保存的是查询到的数据，索引1保存的是布尔值，表示是否为新创建的对象
  User.findOrCreate({
    where: newUser
  }).then((result) => {
    var isNew = result[1];
    res.json(result);
  });
});

// 根据指定的信息删除数据
app.get('/delete', function (req, res) {
  User.sync().then(() => {
    User.destroy({ // 使用 Model.destory() 方法来根据指定信息删除数据
      where: {
        id: 4
      }
    }).then((result) => {
      res.json(result);
    });
  });
});

// 启动服务器的实例监听
app.listen(3000, function () {
  console.log('Server running at http://127.0.0.1:3000');
});