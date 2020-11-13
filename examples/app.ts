import $ from 'jquery';
import { create } from '../src/index';

const DMI = create({
	selector: '.js-import',
	debug: true,
	modules: {
		moduleA: {
			filter: '[data-demo]',
			importFn: (stats) => import('./modules/demo-a')
		}
	}
});

$(() => {
	DMI.importAll();
});
