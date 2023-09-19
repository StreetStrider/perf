
import { add as Case } from 'benny'
import { suite } from 'benny'
import { cycle, complete } from 'benny'


export function xSuite () {}

export { Case }

export function Suite (name, cases)
{
	return suite(
		name,
		...cases,

		cycle(),
		complete(),
	)
}


export function range (size)
{
	return new Array(size)
	.fill(null)
	.map((_, i) => i)
}

export function times (n, fn)
{
	return range(n).map(fn)
}

export function randomkey ()
{
	return Math.random().toString(32).slice(2, 9)
}

export function randomvalue ()
{
	return (Math.floor(Math.random() * 10e3) * 10e6)
}

export function Zero ()
{
	return Suite('zero',
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
}
