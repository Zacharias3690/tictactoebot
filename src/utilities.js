module.exports = {
    replaceAt: function(str, index, char) {
        return str.substr(0, index) + char + str.substr(index + char.length);
    }
};