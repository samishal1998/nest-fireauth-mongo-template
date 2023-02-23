// module.exports = [
// 	{
// 		type: 'confirm',
// 		name: 'websocket',
// 		message: 'Do you want a Socket.io gateway?',
// 	},

// 	{
// 		type: 'input',
// 		name: 'plural',
// 		message: 'What is the plural of resource name',
// 	},
// ];
const pluralize = require('pluralize');

module.exports = {
	prompt: async ({ prompter, args }) => {
		let { websocket } = await prompter.prompt({
			type: 'confirm',
			name: 'websocket',
			message: 'Do you want a Socket.io gateway?',
		});
		const p = pluralize(args.name);
		let output = {
			websocket,
			...args,
			names: p,
			Names: p.charAt(0).toUpperCase() + p.substring(1),
		};
		console.log(output);
		return output;
	},
};
