
import assert from 'node:assert'

import { Suite, Case } from '#perf'
import { Zero } from '#perf'
import { times } from '#perf'
import { randomkey, randomvalue } from '#perf'


Zero()


const size = 10e3
const data = times(size, () => [ randomkey(), randomvalue() ])
const keys = data.map(p => p[0])

Suite('dict',
[
	Case('{} in', () =>
	{
		const dict = {}
		let T = 0

		data.forEach(([ k, v ]) => { dict[k] = v })

		assert(Object.keys(dict).length === size)

		return () =>
		{
			for (const k in dict)
			{
				T = (T + dict[k])
			}
		}
	}),
	Case('null {} in', () =>
	{
		const dict = Object.create(null)
		let T = 0

		data.forEach(([ k, v ]) => { dict[k] = v })

		assert(Object.keys(dict).length === size)

		return () =>
		{
			for (const k in dict)
			{
				T = (T + dict[k])
			}
		}
	}),
	Case('{} entries', () =>
	{
		const dict = {}
		let T = 0

		data.forEach(([ k, v ]) => { dict[k] = v })

		assert(Object.keys(dict).length === size)

		return () =>
		{
			for (const [ k, v ] of Object.entries(dict))
			{
				T = (T + v)
			}
		}
	}),
	Case('Map() of', () =>
	{
		const dict = new Map
		let T = 0

		data.forEach(([ k, v ]) => dict.set(k, v))

		assert(dict.size === size)

		return () =>
		{
			for (const [ k, v ] of dict)
			{
				T = (T + v)
			}
		}
	}),
	Case('Map() get', () =>
	{
		const dict = new Map
		let T = 0

		data.forEach(([ k, v ]) => dict.set(k, v))

		assert(dict.size === size)

		return () =>
		{
			for (const k of keys)
			{
				T = (T + dict.get(k))
			}
		}
	}),
	Case('Map try/catch', () =>
	{
		const dict = new Map
		let T = 0

		data.forEach(([ k, v ]) => dict.set(k, v))

		assert(dict.size === size)

		return () =>
		{
			try
			{

			for (const k of keys)
			{
				T = (T + dict.get(k))
			}

			}
			catch (e) {}
		}
	}),
])
