
import assert from 'node:assert'

import { Suite, Case } from '#perf'
import { Zero } from '#perf'
import { times } from '#perf'
import { randomkey, randomvalue } from '#perf'


Zero()


const size = 10e3
const data = times(size, () => [ randomkey(), randomvalue() ])
const keys = data.map(p => p[0])
const key  = keys[100]

Suite('dict',
[
	Case('Map() key', () =>
	{
		const dict = new Map
		let T = 0

		data.forEach(([ k, v ]) => dict.set(k, v))

		assert(dict.size === size)

		return () =>
		{
			T = (T + dict.get(key))
		}
	}),
	Case('{} key', () =>
	{
		const dict = {}
		let T = 0

		data.forEach(([ k, v ]) => { dict[k] = v })

		assert(Object.keys(dict).length === size)

		return () =>
		{
			T = (T + dict[key])
		}
	}),
	Case('null {} key', () =>
	{
		const dict = Object.create(null)
		let T = 0

		data.forEach(([ k, v ]) => { dict[k] = v })

		assert(Object.keys(dict).length === size)

		return () =>
		{
			T = (T + dict[key])
		}
	}),
])
