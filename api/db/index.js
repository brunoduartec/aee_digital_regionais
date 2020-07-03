const Database = require('../helpers/Database')
const env = require('../env.json')

const database = new Database(env.mysql).getInstance();

const setup = require('./setup')
exports.setup = setup.bootstrap

module.exports = function makeDb() {
    return Object.freeze({
        add,
        findById,
        getItems,
        remove,
        replace,
        update
    })

    function setConditionQueryPart(conditions) {
        let query = ""
        let conditionKeysToAdd = Object.keys(conditions)
        let conditionValuesToAdd = Object.values(conditions)

        for (let index = 0; index < conditionKeysToAdd.length; index++) {
            const param = conditionKeysToAdd[index];
            const condition = conditionValuesToAdd[index];
            query += (param + "= " + condition)
        }

        return query
    }

    async function add(table, values) {
        let keysToAdd = Object.keys(values)
        let valuesToAdd = Object.values(values)

        let query = "INSERT INTO " + table + "(";

        for (let index = 0; index < keysToAdd.length; index++) {
            const param = keysToAdd[index];
            query += (param + ",")
        }

        //removes the last comma
        query = query.substring(0, query.length - 1);

        query += ") VALUES ("

        for (let index = 0; index < valuesToAdd.length; index++) {
            const value = valuesToAdd[index];
            const typeOfValue = typeof value;
            if (typeOfValue == "string") {
                query += ("'" + value + "',")
            } else {
                query += (value + ",")
            }
        }

        //removes the last comma
        query = query.substring(0, query.length - 1);

        query += ")"

        return await database.query(query);
    }
    async function findById(table, params, conditions) {
        let query = 'SELECT ';

        for (let index = 0; index < params.length; index++) {
            const param = params[index];
            query += (param + ",")
        }

        //removes the last comma
        query = query.substring(0, query.length - 1);
        query += (" From " + table + " WHERE ")

        query += (setConditionQueryPart(conditions));

        return await database.query(query);
    }
    async function getItems(table, params) {
        let query = 'SELECT ';

        for (let index = 0; index < params.length; index++) {
            const param = params[index];
            query += (param + ",")
        }

        //removes the last comma
        query = query.substring(0, query.length - 1);

        query += (" From " + table)

        return await database.query(query);
    }
    async function remove(table, conditions) {
        let query = "DELETE FROM " + table + " WHERE "
        query += (setConditionQueryPart(conditions));

        return await database.query(query);
    }
    async function replace(table, values, conditions) {
        await remove(table, conditions)
        await add(table, values)
    }
    async function update(table, values, conditions) {
        let keysToAdd = Object.keys(values)
        let valuesToAdd = Object.values(values)

        let query = "UPDATE " + table + " SET";

        for (let index = 0; index < keysToAdd.length; index++) {
            const param = keysToAdd[index];
            const value = valuesToAdd[index];

            const typeOfValue = typeof value;
            if (typeOfValue == "string") {
                query += (" " + param + " = '" + value + "',")
            } else {
                query += (" " + param + " = " + value + ",")
            }
        }

        //removes the last comma
        query = query.substring(0, query.length - 1);

        query += ("  WHERE ");
        query += (setConditionQueryPart(conditions));
        return await database.query(query);
    }
}