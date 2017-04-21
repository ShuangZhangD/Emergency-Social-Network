/**
 * Created by Ling on 2017/4/3.
 */
"use strict";
class TestDBConfig{

    constructor(){
        //this.url = 'mongodb://root:1234@ds135690.mlab.com:35690/esntest';
        this.url = "mongodb://localhost:27017/esnsv7";
        //this.url=process.argv[2];
    }

    setURL(dburl){
        this.url = dburl;
    }

    getURL(){
        return this.url;
    }
}
module.exports = TestDBConfig;
