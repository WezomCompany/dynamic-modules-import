// -----------------------------------------------------------------------------
// Deps
// -----------------------------------------------------------------------------

import { create } from '../index';

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe('pendingEvent', () => {
	test('constant event name', () => {
		const dmi = create({
			modules: {},
			selector: '.js-import'
		});
		expect(dmi.pendingEvent).toEqual('dmi:pending');
	});
});

describe('loadedEvent', () => {
	test('constant event name', () => {
		const dmi = create({
			modules: {},
			selector: '.js-import'
		});
		expect(dmi.loadedEvent).toEqual('dmi:loaded');
	});
});

describe('errorEvent', () => {
	test('constant event name', () => {
		const dmi = create({
			modules: {},
			selector: '.js-import'
		});
		expect(dmi.errorEvent).toEqual('dmi:error');
	});
});
