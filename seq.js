
import assert from 'node:assert'

import { Suite, Case } from '#perf'
import { Zero } from '#perf'
import { range } from '#perf'
import { randomvalue } from '#perf'


Zero()


const size = 10e3

Suite('Seq',
[
	Case('Set for-of', () =>
	{
		const R = new Set
		let T = 1

		for (let n = 0; (n < size); n++)
		{
			R.add(n + randomvalue())
		}

		assert(R.size === size)

		return () =>
		{
			for (const x of R)
			{
				T = (T * x)
			}
		}
	}),
	Case('Set.forEach', () =>
	{
		const R = new Set
		let T = 1

		for (let n = 0; (n < size); n++)
		{
			R.add(n + randomvalue())
		}

		assert(R.size === size)

		return () =>
		{
			R.forEach(x => { T = (T * x) })
		}
	}),
	Case('[] for', () =>
	{
		const R = []
		let T = 1

		for (let n = 0; (n < size); n++)
		{
			R.push(n + randomvalue())
		}

		assert(R.length === size)

		return () =>
		{
			for (let n = 0; (n < size); n++)
			{
				T = (T * R[n])
			}
		}
	}),
	Case('[] for-of', () =>
	{
		const R = []
		let T = 1

		for (let n = 0; (n < size); n++)
		{
			R.push(n + randomvalue())
		}

		assert(R.length === size)

		return () =>
		{
			for (const x of R)
			{
				T = (T * x)
			}
		}
	}),
	Case.skip('for [].at', () =>
	{
		const R = []
		let T = 1

		for (let n = 0; (n < size); n++)
		{
			R.push(n + randomvalue())
		}

		assert(R.length === size)

		return () =>
		{
			for (let n = 0; (n < size); n++)
			{
				T = (T * R.at(n))
			}
		}
	}),
	Case('[].forEach', () =>
	{
		const R = []
		let T = 1

		for (let n = 0; (n < size); n++)
		{
			R.push(n + randomvalue())
		}

		assert(R.length === size)

		return () =>
		{
			R.forEach(x => { T = (T * x) })
		}
	}),
])
