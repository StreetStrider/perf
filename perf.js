
import { add as Case } from 'benny'
import { suite } from 'benny'
import { cycle, complete } from 'benny'

function range (size)
{
	return new Array(size)
	.fill(null)
	.map((_, i) => i)
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


var mulv = range(10 * 1000).map(x => x % 3)

xSuite('mul',
[
	Case('mul hi-order', () =>
	{
		var sum = 0

		function mul (a, b)
		{
			// return (c) => (a * b * c % 1000)
			return (c) => (c * 3 * 7 % 1000)
		}

		var v = mulv
		.map((x, i) => mul(x, i % 2))

		return () =>
		{
			for (var i = 0; i < v.length; i++) sum += v[i](i)
		}
	}),

	Case('mul hi-order memo', () =>
	{
		var sum = 0
		var cache = {}

		var single = (c) => (c * 3 * 7 % 1000)

		function mul (a, b)
		{
			return single

			/*
			var key = [a, b].join(',')
			if (key in cache)
			{
				return cache[key]
			}

			return (cache[key] = (c) => (a * b * c % 1000))
			*/
		}

		var v = mulv
		.map((x, i) => mul(x, i % 2))

		return () =>
		{
			for (var i = 0; i < v.length; i++) sum += v[i](i)
		}
	}),
])

var pattern_mul = (x) => ((x > .25) && ((y) => x * y) || null)

var pattern = Array(10e3)
.fill(null)
.map(() => ([ Math.random(), Math.random() ]))
.map((_) => _.map(pattern_mul))
.map(([ left, right ]) => ({ left, right }))

xSuite('fn inline opt',
[
	Case('nulls', () =>
	{
		var sum = 0
		var seq = [ ...pattern ]

		return () =>
		{
			for (var i = 0, L = seq.length; (i < L); i++)
			{
				// var [ left, right ] = seq[i]
				if (seq[i].left)  sum = seq[i].left(sum)
				if (seq[i].right) sum = seq[i].right(sum)
			}
		}
	}),

	Case('noop', () =>
	{
		var noop = (x) => x * 1

		var sum = 0
		// var seq = pattern.map(xs => xs.map(x => x || noop))
		var seq = pattern.map(({ left, right }) => ({ left: (left || noop), right: (right || noop) }))

		return () =>
		{
			for (var i = 0, L = seq.length; (i < L); i++)
			{
				// var [ left, right ] = seq[i]
				sum = seq[i].left(sum)
				sum = seq[i].right(sum)
			}
		}
	}),

	Case('noops', () =>
	{
		var sum = 0
		// var seq = pattern.map(xs => xs.map(x => x || ((x) => x * 1)))
		var seq = pattern.map(({ left, right }) => ({ left: (left || ((x) => x * 1)), right: (right || ((x) => x * 1)) }))

		return () =>
		{
			for (var i = 0, L = seq.length; (i < L); i++)
			{
				// var [ left, right ] = seq[i]
				sum = seq[i].left(sum)
				sum = seq[i].right(sum)
			}
		}
	}),
])


function IterInside (seq)
{
	seq = [ ...seq ]

	function each (fn)
	{
		for (var item of seq) fn(item)
	}

	return { each }
}

function IterFlat (seq)
{
	seq = [ ...seq ]

	function each (fn)
	{
		for (var L = seq.length, i = 0; (i < L); i++) fn(seq[i])
	}

	return { each }
}

function IterIter (seq)
{
	seq = [ ...seq ]

	function * iter ()
	{
		for (var item of seq) yield item
	}

	return { [Symbol.iterator]: iter }
}


var iter_size = 10000

xSuite('iter',
[
	Case('flat', () =>
	{
		var n = 1
		var seq = IterFlat(Array(iter_size).fill(null).map(Math.random))

		return () =>
		{
			seq.each(x => { n = x + n })
		}
	}),
	Case('inside', () =>
	{
		var n = 1
		var seq = IterInside(Array(iter_size).fill(null).map(Math.random))

		return () =>
		{
			seq.each(x => { n = x + n })
		}
	}),
	Case('iterator', () =>
	{
		var n = 1
		var seq = IterIter(Array(iter_size).fill(null).map(Math.random))

		return () =>
		{
			for (var x of seq)
			{
				n = x + n
			}
		}
	}),
])


var vector_size = (500 * 1000)

xSuite('vector',
[
	Case('[] push', () =>
	{
		var total = 1

		function Random ()
		{
			var rnd = Math.random()
			return (x) => (x * rnd)
		}

		var r = []
		for (var n = 0; n < vector_size; n++)
		{
			r.push(Random())
		}

		return () =>
		{
			for (var n = 0; n < vector_size; n++)
			{
				total = r[n](total)
			}
		}
	}),
	Case('fixed size fill-map', () =>
	{
		var total = 1

		function Random ()
		{
			var rnd = Math.random()
			return (x) => (x * rnd)
		}

		var r = Array(vector_size).fill(null).map(Random)

		return () =>
		{
			for (var n = 0; n < vector_size; n++)
			{
				total = r[n](total)
			}
		}
	}),
	Case('fixed size', () =>
	{
		var total = 1

		function Random ()
		{
			var rnd = Math.random()
			return (x) => (x * rnd)
		}

		// var r = []; r.length = vector_size
		// var r = Array(vector_size)
		var r = Array(vector_size).fill(null)

		for (var n = 0; n < vector_size; n++)
		{
			r[n] = Random()
		}
		// Object.freeze(r)

		return () =>
		{
			for (var n = 0; n < vector_size; n++)
			{
				total = r[n](total)
			}
		}
	}),
	Case('[] unshift', () =>
	{
		var total = 1

		function Random ()
		{
			var rnd = Math.random()
			return (x) => (x * rnd)
		}

		var r = []
		for (var n = 0; n < vector_size; n++)
		{
			r.unshift(Random())
		}

		return () =>
		{
			for (var n = 0; n < vector_size; n++)
			{
				total = r[n](total)
			}
		}
	}),
])

function compose (...fns)
{
	return (value) =>
	{
		for (var fn of fns)
		{
			value = fn(value)
		}
		return value
	}
}

function compose_eval (...fs)
{
	var fns = [ ...fs ]
	var L = fns.length

	var V = []
	var H = []
	var T = []

	for (var n = (L - 1); (n >= 0); n--)
	{
		V.push(`fn_${n}=fns[${n}]`)
		H.push(`fn_${n}(`)
		T.push(')')
	}

	var fn_str = `var ${ V.join(',') };return ${ H.join('') }value${ T.join('') }`
	var fn = new Function('fns', 'value', fn_str)
	return (value) => fn(fns, value)
}

// var x = [1,2,10].map(compose(x => x + 1, x => x * 5, x => x - 1))
// console.log(x)

// var x = [1,2,10].map(compose_eval(x => x + 1, x => x * 5, x => x - 1))
// console.log(x)

xSuite('compose',
[
	Case('straightforward compose', () =>
	{
		var t = 0

		var f1 = x => x + 1
		var f2 = x => x * 5
		var f3 = x => x - 5

		var f = x => f3(f2(f1(x)))

		return () =>
		{
			;[1,2,10].map(f).map(x => { t += x })
		}
	}),
	Case('new Function compose', () =>
	{
		var t = 0
		var f = compose_eval(x => x + 1, x => x * 5, x => x - 1)

		return () =>
		{
			;[1,2,10].map(f).map(x => { t += x })
		}
	}),
	Case('inlined compose', () =>
	{
		var t = 0
		var f = x => (((x + 1) * 5) - 1)

		return () =>
		{
			;[1,2,10].map(f).map(x => { t += x })
		}
	}),
	Case('classic', () =>
	{
		var t = 0
		var f = compose(x => x + 1, x => x * 5, x => x - 1)

		return () =>
		{
			;[1,2,10].map(f).map(x => { t += x })
		}
	}),
])

xSuite('getter',
[
	Case('function getter', () =>
	{
		var t = 0
		var data = { x: { y: { z: [ 0, 0, 17 ] }}}

		function getter (...path)
		{
			return (data) =>
			{
				while (path.length)
				{
					data = data[path[0]]
					path.shift()
				}
				return data
			}
		}

		var f = getter('x', 'y', 'z', 2)

		return () =>
		{
			t += f(data)
		}
	}),
	Case('new Function getter', () =>
	{
		var t = 0
		var data = { x: { y: { z: [ 0, 0, 17 ] }}}

		function getter (...path)
		{
			var path_str = path
			.map(x => JSON.stringify(x))
			.map(x => `[${ x }]`)
			.join('')

			return new Function('data', `return data${ path_str }`)
		}

		var f = getter('x', 'y', 'z', 2)

		return () =>
		{
			t += f(data)
		}
	}),
])

xSuite('eval',
[
	Case('plain', () =>
	{
		var t = 0

		return () =>
		{
			t = 2 * 3 + 4
		}
	}),
	Case('eval', () =>
	{
		var t = 0

		return () =>
		{
			t = eval('2 * 3 + 4')
		}
	}),
	Case('function eval', () =>
	{
		var t = 0
		var f = () => eval('2 * 3 + 4')

		return () =>
		{
			t = f()
		}
	}),
	Case('new Function', () =>
	{
		var t = 0
		var f = new Function('return 2 * 3 + 4')

		return () =>
		{
			t = f()
		}
	}),
])

xSuite('pow',
[
	Case('mul', () =>
	{
		var t

		return () =>
		{
			t = (3 * 3 * 3)
			t = (t * t) / (t * t)
			t = (4 * 4 * 4 * 4 * 4)
		}
	}),
	Case('star', () =>
	{
		var t

		return () =>
		{
			t = (3 ** 3)
			t = (t * t) / (t * t)
			t = (4 ** 5)
		}
	}),
	Case('Math.pow', () =>
	{
		var t

		return () =>
		{
			t = Math.pow(3, 3)
			t = (t * t) / (t * t)
			t = Math.pow(4, 5)
		}
	}),
	Case('Math/pow', () =>
	{
		var t
		var pow = Math.pow

		return () =>
		{
			t = pow(3, 3)
			t = (t * t) / (t * t)
			t = pow(4, 5)
		}
	}),
])
