
module.exports = {
    generator: function generator(){

        let temp = ['0','1','2','3','4','5','6','7','8','9'];

        let picks = '';

        for (let i = 0; i < 6; i++) {
            let key = Math.floor(Math.random()*temp.length);
            picks += (temp[key]);
        }								
            
        return picks;
    },
}