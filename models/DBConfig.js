/**
 * Created by Ling on 2017/3/22.
 */
'use strict';
class DBConfig{

    constructor(){
        //this.url = 'mongodb://root:1234@ds137730.mlab.com:37730/esnsv7';
        this.url=process.argv[2];
    }

    setURL(dburl){
        this.url = dburl;
    }

    getURL(){
        return this.url;
    }
}
module.exports = DBConfig;