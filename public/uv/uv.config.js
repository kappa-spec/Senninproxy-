self.__uv$config = {
    prefix: '/service/',
    bare: 'https://uv.radon.games/bare/', 
    encodeUrl: JavaScriptObfuscator.encodeUrl,
    decodeUrl: JavaScriptObfuscator.decodeUrl,
    handler: '/uv/uv.handler.js',
    bundle: '/uv/uv.bundle.js',
    config: '/uv/uv.config.js',
    sw: '/uv/uv.sw.js',
};

// 単純なXORエンコード（安定性のために使用）
var JavaScriptObfuscator = {
    encodeUrl(str) {
        if (!str) return str;
        return encodeURIComponent(str.split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char).join(''));
    },
    decodeUrl(str) {
        if (!str) return str;
        let [input, ...search] = str.split('?');
        return decodeURIComponent(input).split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char).join('') + (search.length ? '?' + search.join('?') : '');
    }
};

