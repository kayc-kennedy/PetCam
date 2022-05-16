const db = require('../db')

module.exports = {
    registerPet: async (data) => {
        try {
            const response = await db('animal').insert(data)
                      
            return response

        } catch (error) { 
            console.log(error)
            return error;
        }
    }
}