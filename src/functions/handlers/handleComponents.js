const { readdirSync } = require('fs');

module.exports = (client) => {
    client.handleComponents = () => {
        const componentFolders = readdirSync('./src/components');
        for (const folder of componentFolders) {
            const componentFiles = readdirSync(`./src/components/${folder}`).filter(file => file.endsWith('.js'));

            const { buttons, selectMenus, modals } = client;

            switch(folder) {
                case 'buttons':
                    for (const file of componentFiles) {
                        const button = require(`../../components/buttons/${file}`);
                        buttons.set(button.data.name, button);
                    }
                    break;
                case 'selectMenus':
                    for (const file of componentFiles) {
                        const selectMenu = require(`../../components/selectMenus/${file}`);
                        selectMenus.set(selectMenu.data.name, selectMenu);
                    }
                    break;
                case 'modals':
                    for (const file of componentFiles) {
                        const modal = require(`../../components/modals/${file}`);
                        modals.set(modal.data.name, modal);
                    }
                    break;
                default:
                    break;
            };
        };
    };
};