const env = process.env.NODE_ENV ? process.env.NODE_ENV : "local";
const config = require("../env.json")[env];
const redisConf = config.redis

const Logger = require("./logger");
const logger = new Logger()

const redis = require("redis")

module.exports = class Cache{
    constructor(){

        if(this.constructor.instance)
            return this.constructor.instance

        this.constructor.instance = this;
        this.client = redis.createClient({ url: `redis://${redisConf.host}:${redisConf.port}` });
    }

    async connect(){
        const instance = this
        try {
            await this.client.connect();
            logger.info("Redis is connected")
            
        } catch (error) {
            logger.error(`Error Connecting to Redis: ${error}`)
            await setTimeout(instance.connect, 5000);
        }
    }

    async get(key){
        const value = await this.client.get(key);
        return value;
    }

    async set(key,value){
        await this.client.set(key, JSON.stringify(value), {
            EX: 24*60*60,
            NX: true
          });
    }

    async keys(keyPattern){
        const keys = await this.client.keys(keyPattern)
        return keys
    }

    async remove(pattern){
        let keys = await this.client.keys(pattern)

        for (const key of keys) {
            this.client.expire(key,0);
        }
    }

}