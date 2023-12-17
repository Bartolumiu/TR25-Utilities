module.exports = {
    name: 'error',
    execute(error) {
        console.log(`[Database Status] An error occurred while connecting to MongoDB: \n${error}`);
    }
}