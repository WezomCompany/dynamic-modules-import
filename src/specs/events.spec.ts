// -----------------------------------------------------------------------------
// Deps
// -----------------------------------------------------------------------------

import { create } from '../index';
import { fakeResolver } from './helpers';

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe('pendingEvent', () => {
	test('constant event name', () => {
		const dmi = create({
			resolver: fakeResolver,
			modules: {},
			selector: '.js-import'
		});
		expect(dmi.pendingEvent).toEqual('dmi:pending');
	});
});

describe('loadedEvent', () => {
	test('constant event name', () => {
		const dmi = create({
			resolver: fakeResolver,
			modules: {},
			selector: '.js-import'
		});
		expect(dmi.loadedEvent).toEqual('dmi:loaded');
	});
});

describe('errorEvent', () => {
	test('constant event name', () => {
		const dmi = create({
			resolver: fakeResolver,
			modules: {},
			selector: '.js-import'
		});
		expect(dmi.errorEvent).toEqual('dmi:error');
	});
});
