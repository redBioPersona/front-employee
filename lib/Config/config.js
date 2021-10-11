orion.config.add('url', 'Servidor', {
	type: String,
	label:'URL',
	optional:true
});
orion.config.add('puerto', 'Servidor', {
	type: String,
	label:'Puerto meteor',
	optional:true
	
});
orion.config.add('puertobd', 'Servidor', {
	type: String,
	label:'Puerto base de datos'
	
});

orion.config.add('coleccion', 'Servidor', {
	type: String,
	label:'Coleccion'
});

orion.config.add('minutos', 'Servidor', {
	type: Number,
	decimal:true,
	label:'Minutos entre cada Sincronizacion'
});