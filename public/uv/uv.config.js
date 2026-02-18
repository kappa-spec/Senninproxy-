self.__uv$config = {
    prefix: '/service/',
    bare: '/bare/',
    encodeUrl: function(str) {
        if (!str) return str;
        return encodeURIComponent(str.split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char).join(''));
    },
    decodeUrl: function(str) {
        if (!str) return str;
        let [input, ...search] = str.split('?');
        return decodeURIComponent(input).split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char).join('') + (search.length ? '?' + search.join('?') : '');
    },
    handler: '/uv/uv.handler.js',
    bundle: '/uv/uv.bundle.js',
    config: '/uv/uv.config.js',
    sw: '/uv/uv.sw.js',
};
