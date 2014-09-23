/// <reference path="../typings/lodash/lodash.d.ts" />
export interface Model {
	getID(): string
}


export class Post implements Model {
	name: string = null
	text: string = null
	type: string = null
	id: string = null
	link: string = null
	time: string = null
	alt_text: string = null
	priority: string = "0"
	sensitive: boolean = false
	profile_image_url: string = null
	media_url: string = null

	constructor(opts) {
		_.assign(this, opts)
	}

	getID(): string {
		return this.id
	}
}
