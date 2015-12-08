/**
 * Created by adubois on 07/12/15.
 */
var DB = require('./db').DB;

var User = DB.Model.extend({
    tableName: 'tblUsers',
    idAttribute: 'userId',
});

module.exports = {
    User: User
};
