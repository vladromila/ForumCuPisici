const moment = require('moment');
module.exports = {
    generateDate: function (date, format) {
        return moment(date).format(format)
    },
    select: function (selected, options) {
        return options.fn(this).replace(new RegExp('value=\"' + selected + '\"'), '$&selected="selected"')
    },
    fieldChecker: function (string1) {
        if (string1) {
            return true;

        }
        else {
            return false;
        }

    },
    ifer: function () {
        if (user.id === profileuser.id) {
            
            console.log('ay');
            return true1;
        }
        return false;
    }
}