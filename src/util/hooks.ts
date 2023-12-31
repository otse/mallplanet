
// inspired by gmod lua !

namespace hooks {
	export type func = (any) => void
}

export class hooks<T = never> {
	static readonly hooks: { [name: string]: hooks.func[] }
	list: hooks.func[] = []
	static register(name: string, f: hooks.func) {
		if (!hooks[name])
			hooks[name] = [];
		hooks[name].push(f);
	}
	static clear(name: string) {
		delete hooks[name];
	}
	static unregister(name: string, f: hooks.func) {
		hooks[name] = hooks[name].filter(e => e != f);
	}
	// Call last first
	static call(name: string, x: any) {
		if (!hooks[name])
			return;
		for (let i = hooks[name].length; i--;)
			if (hooks[name][i](x))
				return;
	}
}

export default hooks;