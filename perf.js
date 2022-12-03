
import { add as Case } from 'benny'
import { suite } from 'benny'
import { cycle, complete } from 'benny'

function range (size)
{
	return new Array(size)
	.fill(null)
	.map((_, i) => i)
}

function times (n, fn)
{
	return range(n).map(fn)
}

function randomkey ()
{
	return Math.random().toString(32).slice(2, 9)
}

function randomvalue ()
{
	return Math.floor(Math.random() * 10e3)
}

function xSuite () {}

function Suite (name, cases)
{
	return suite(
		name,
		...cases,

		cycle(),
		complete(),
	)
}

Suite('zero',
[
	Case('zero', () =>
	{
		var n = 1

		var emit = (m) => { n = (n * m) }

		return () =>
		{
			emit(-1)
		}
	}),
])


//
// dict
{

var dict_size = 500e3

Suite('dict',
[
	Case('Map', () =>
	{
		var map = new Map
		var sum = 0

		times(dict_size, () => map.set(randomkey(), randomvalue()))

		return () =>
		{
			sum += map.get(randomkey())
		}
	}),
	Case('Map try/catch', () =>
	{
		var map = new Map
		var sum = 0

		times(dict_size, () => map.set(randomkey(), randomvalue()))

		return () =>
		{
			try
			{
				sum += map.get(randomkey())
			}
			catch (e) {}
		}
	}),
	Case('object', () =>
	{
		var dict = {}
		var sum = 0

		times(dict_size, () => dict[randomkey()] = randomvalue())

		return () =>
		{
			sum += dict[randomkey()]
		}
	}),

	Case('object null', () =>
	{
		var dict = Object.create(null)
		var sum = 0

		times(dict_size, () => dict[randomkey()] = randomvalue())

		return () =>
		{
			sum += dict[randomkey()]
		}
	}),
])
}


//
// vector
{

var vector_size = 50e3

Suite('vector',
[
	Case('[] index (no len)', () =>
	{
		var total = 1
		var r = []

		for (var n = 0; n < vector_size; n++)
		{
			r[n] = randomvalue()
		}

		return () =>
		{
			for (var n = 0; n < vector_size; n++)
			{
				total += r[n]
			}
		}
	}),
	Case('[] push', () =>
	{
		var total = 1
		var r = []

		for (var n = 0; n < vector_size; n++)
		{
			r.push(randomvalue())
		}

		return () =>
		{
			for (var n = 0; n < vector_size; n++)
			{
				total += r[n]
			}
		}
	}),
	Case('fixed size fill-map', () =>
	{
		var total = 1
		var r = Array(vector_size).fill(null).map(randomvalue)

		return () =>
		{
			for (var n = 0; n < vector_size; n++)
			{
				total += r[n]
			}
		}
	}),
	Case('fixed size', () =>
	{
		var total = 1

		// var r = []; r.length = vector_size
		var r = Array(vector_size)
		// var r = Array(vector_size).fill(null)

		for (var n = 0; n < vector_size; n++)
		{
			r[n] = randomvalue()
		}
		// Object.freeze(r)

		return () =>
		{
			for (var n = 0; n < vector_size; n++)
			{
				total += r[n]
			}
		}
	}),
	/* // super slow on allocate
	Case('[] unshift', () =>
	{
		var total = 1
		var r = []

		for (var n = 0; n < vector_size; n++)
		{
			r.unshift(randomvalue())
		}

		return () =>
		{
			for (var n = 0; n < vector_size; n++)
			{
				total += r[n]
			}
		}
	}),
	*/
])
}


//
// set
{

var set_size = 50e3

Suite('set',
[
	Case('for-of', () =>
	{
		var set = new Set
		times(set_size, () =>
		{
			set.add(randomvalue())
		})

		var n = 0
		return () =>
		{
			for (var s of set)
			{
				n = n + s
			}
		}
	}),
	Case('forEach', () =>
	{
		var set = new Set
		times(set_size, () =>
		{
			set.add(randomvalue())
		})

		var n = 0
		return () =>
		{
			set.forEach(s =>
			{
				n = n + s
			})
		}
	}),
	Case('[] forEach', () =>
	{
		var set = []
		times(set_size, () =>
		{
			set.push(randomvalue())
		})

		var n = 0
		return () =>
		{
			set.forEach(s =>
			{
				n = n + s
			})
		}
	}),
	Case('[] for', () =>
	{
		var set = []
		times(set_size, () =>
		{
			set.push(randomvalue())
		})

		var n = 0
		return () =>
		{
			for (var i = 0; i < set_size; i++)
			{
				n = n + set[i]
			}
		}
	}),
])
}
