module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        console.log(`💗 Aphrodite is online as ${client.user.tag}`);
    }
};
