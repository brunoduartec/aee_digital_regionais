const env = process.env.NODE_ENV ? process.env.NODE_ENV : "local";
const config = require("../env.json")[env];
const redisConf = config.redis

const Logger = require("./logger");
const logger = new Logger();


const redis = require("redis")


module.exports = class Cache {
    constructor(){

        if(this.constructor.instance)
            return this.constructor.instance

        this.constructor.instance = this;
        this.client = redis.createClient({ url: `redis://${redisConf.host}:${redisConf.port}` });

        this.client.on('connect', () => {
          logger.info('Redis is connected');
        });
        this.client.on('error', (err) => {
          logger.error(`Error Connecting to Redis: ${err}`);
        });
     
        this.client.connect();
    }

    async connect(){
        try {
            await this.client.connect();
            logger.info("Redis is connected")
            
        } catch (error) {
            logger.error(`Error Connecting to Redis: ${error}`)
            await setTimeout(instance.connect, 5000);
        }
    }

    async get(key){
      try {
        const value = await this.client.get(key);
        return value;
      } catch (error) {
        throw error
      }
        
    }

    async set(key,value){
      try {
        await this.client.set(key, JSON.stringify(value), {
          EX: 24*60*60,
          NX: true
        });
      } catch (error) {
        throw error
      }
      
    }

    async keys(keyPattern){
      try {
        const keys = await this.client.keys(keyPattern)
        return keys  
      } catch (error) {
        throw error
      }  
      
    }

    async remove(pattern){
      try {
        let keys = await this.client.keys(pattern)

        for (const key of keys) {
            this.client.expire(key,0);
        }
        
      } catch (error) {
        throw error        
      }
    }

}