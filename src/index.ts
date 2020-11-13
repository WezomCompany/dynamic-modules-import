import JQuery from 'jquery';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface DMIModuleStats {
	moduleName: string;
}

interface DMIModule {
	filter:
		| JQuery.Selector
		| JQuery.TypeOrArray<Element>
		| JQuery
		| ((this: Element, index: number, element: Element) => boolean);
	importFn(stats: DMIModuleStats): Promise<any>;
	importCondition?(
		$elements: JQuery,
		$container: JQuery,
		stats: DMIModuleStats
	): boolean;
}

interface DMIOptions {
	selector: JQuery.Selector;
	modules: Record<string, DMIModule>;
	debug?: boolean;
	pendingCssClass?: string;
	loadedCssClass?: string;
	errorCssClass?: string;
}

interface DynamicModulesImport {
	readonly debug: boolean;
	readonly selector: JQuery.Selector;
	readonly pendingCssClass: string;
	readonly pendingEvent: string;
	readonly loadedCssClass: string;
	readonly loadedEvent: string;
	readonly errorCssClass: string;
	readonly errorEvent: string;
	importModule(
		moduleName: string,
		$container?: JQuery,
		ignoreImportCondition?: boolean
	): Promise<any>;
	importAll(
		$container?: JQuery,
		awaitAll?: boolean,
		ignoreImportCondition?: boolean
	): Promise<any>;
}

// -----------------------------------------------------------------------------
// Create
// -----------------------------------------------------------------------------

export const create = ({
	modules,
	selector,
	debug,
	pendingCssClass,
	loadedCssClass,
	errorCssClass
}: DMIOptions): DynamicModulesImport => {
	const _allowedCache = new Set<string>();

	// -----------------------------------------------------------------------------
	// Helpers
	// -----------------------------------------------------------------------------

	const _log = (message: string) => {
		if (debug) {
			console.log('[DMI]: ' + message);
		}
	};

	const _getElements = ($container: JQuery): JQuery => {
		const $elements = $container.find(selector);
		if ($elements.length <= 0) {
			_log(`No import elements with selector "${selector}"`);
		}
		return $elements;
	};

	const _resolveWithErrors = (moduleName: string, message: string | Error) => {
		console.warn(`[DMI]: Module "${moduleName}" resolved width errors!!!`);
		console.error(message);
		return Promise.resolve();
	};

	const _markAsPending = ($elements: JQuery, stats: DMIModuleStats) => {
		$elements
			.removeClass([DMI.loadedEvent, DMI.errorCssClass])
			.addClass(DMI.pendingCssClass)
			.trigger(DMI.pendingEvent, { stats });
	};

	const _markAsLoaded = ($elements: JQuery, stats: DMIModuleStats) => {
		$elements
			.removeClass([DMI.pendingCssClass, DMI.errorCssClass])
			.addClass(DMI.loadedCssClass)
			.trigger(DMI.loadedEvent, { stats });
	};

	const _markAsError = ($elements: JQuery, stats: DMIModuleStats) => {
		$elements
			.removeClass([DMI.pendingCssClass, DMI.loadedCssClass])
			.addClass(DMI.errorCssClass)
			.trigger(DMI.errorEvent, { stats });
	};

	const _importFn = (
		moduleName: keyof typeof modules,
		$elements: JQuery,
		$container: JQuery,
		useImportCondition: boolean
	) => {
		if (!modules.hasOwnProperty(moduleName)) {
			return _resolveWithErrors(moduleName, `Undefined moduleName "${moduleName}"`);
		}
		const module = modules[moduleName];
		const $moduleElements = $elements.filter(module.filter);
		if ($moduleElements.length === 0) {
			return Promise.resolve();
		}
		const stats: DMIModuleStats = { moduleName };

		if (
			useImportCondition &&
			!_allowedCache.has(moduleName) &&
			typeof module.importCondition === 'function'
		) {
			const allowed = module.importCondition($moduleElements, $container, stats);
			if (allowed !== true) {
				_log(`module "${moduleName}" skipped by ".importCondition()"`);
				return Promise.resolve();
			}
		}

		_allowedCache.add(moduleName);
		_markAsPending($moduleElements, stats);
		_log(`module "${moduleName}" is pending`);
		return module
			.importFn(stats)
			.then(({ default: _default }) => {
				if (typeof _default !== 'function') {
					_markAsError($moduleElements, stats);
					return _resolveWithErrors(
						moduleName,
						`imported module "${moduleName}" - must export default method`
					);
				}
				_markAsLoaded($moduleElements, stats);
				_default($moduleElements);
				return Promise.resolve();
			})
			.catch((err) => {
				return _resolveWithErrors(moduleName, err);
			});
	};

	const DMI: DynamicModulesImport = {
		get debug() {
			return debug === true;
		},
		get selector() {
			return selector;
		},

		get pendingCssClass() {
			return pendingCssClass || '_dmi-is-pending';
		},
		get pendingEvent() {
			return 'dmi:pending';
		},

		get loadedCssClass() {
			return loadedCssClass || '_dmi-is-loaded';
		},
		get loadedEvent() {
			return 'dmi:loaded';
		},

		get errorCssClass() {
			return errorCssClass || '_dmi-has-error';
		},
		get errorEvent() {
			return 'dmi:error';
		},

		importModule(moduleName, $container = JQuery('body'), ignoreImportCondition) {
			const $elements = _getElements($container);
			if ($elements.length === 0) {
				_log('No elements');
				return Promise.resolve();
			}
			return _importFn(
				moduleName,
				$elements,
				$container,
				ignoreImportCondition !== true
			);
		},

		importAll($container = JQuery('body'), awaitAll = false, ignoreImportCondition) {
			const $elements = _getElements($container);
			if ($elements.length === 0) {
				_log('No elements');
				return Promise.resolve();
			}

			const _getAll = () =>
				Object.keys(modules).map((moduleName) =>
					_importFn(
						moduleName,
						$elements,
						$container,
						ignoreImportCondition !== true
					)
				);

			if (awaitAll) {
				return Promise.all(_getAll());
			} else {
				_getAll();
				return Promise.resolve();
			}
		}
	};

	DMI.importModule.bind(DMI);
	return DMI;
};
