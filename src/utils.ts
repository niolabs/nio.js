export function linkify(text: string): string {
	text = text.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,"<a target=_blank href='$1'>$1</a>")
	text = text.replace(/(^|\s)@(\w+)/g, "$1<a target=_blank href=\"http://twitter.com/$2\">@$2</a>")
	return text.replace(/(^|\s)#(\w+)/g, "$1<a target=_blank href=\"http://twitter.com/search?q=%23$2\">#$2</a>")
}

export function json(url: string, cb: (data:any, error:XMLHttpRequest) => void): void {
	var xhr = new XMLHttpRequest()
	xhr.open('GET', url, true)
	xhr.onload = () => {
		if (xhr.status >= 200 && xhr.status < 400)
			cb(JSON.parse(xhr.responseText), null)
		else
			cb(null, xhr)
	}
	xhr.onerror = () => cb(null, xhr)
	xhr.send()
}

export function truncate(text: string, len: number): string {
	if (text.length > len)
		return text.substring(0, len - 3) + '...'
	return text
}
