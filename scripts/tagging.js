/*! taggingJS - v1.2.5 - 2014-04-10 */
! function(a, b, c, d) {
    a.fn.tagging = function(e) {
        var f, g, h, i, j, k, l;
        return f = a(this), i = [], h = {
            "case-sensitive": !1,
            "close-char": "×",
            "close-class": "tag-i",
            "edit-on-delete": !0,
            "forbidden-chars": [",", ".", "_", "?"],
            "forbidden-chars-callback": b.alert,
            "forbidden-chars-text": "Forbidden character:",
            "forbidden-words": [],
            "forbidden-words-callback": b.alert,
            "forbidden-words-text": "Forbidden word:",
            "no-backspace": !1,
            "no-comma": !1,
            "no-del": !1,
            "no-duplicate": !0,
            "no-duplicate-callback": b.alert,
            "no-duplicate-text": "Duplicate tag:",
            "no-enter": !1,
            "no-spacebar": !1,
            "pre-tags-separator": ", ",
            "tag-box-class": "tagging",
            "tag-char": "#",
            "tag-class": "tag",
            "tags-input-name": "tag",
            "type-zone-class": "type-zone"
        }, g = a.extend({}, h, e), j = function(a) {
            var b, c, e;
            e = {};
            for (b in h) c = a.data(b), c !== d && (e[b] = c);
            return e
        }, l = function(a, b, c) {
            return a.apply(this, [b + " '" + c + "'."]), !1
        }, k = function(b, d, e) {
            var f, h, j, k, m, n, o, p;
            if (e = e || g, m = e["forbidden-words"], d || (d = b.val(), b.val("")), !d || !d.length) return !1;
            if (e["case-sensitive"] === !1 && (d = d.toLowerCase()), h = m.length, 0 !== h) for (f = 0; h > f; f += 1) if (k = d.indexOf(m[f]), - 1 !== k) return b.val(""), n = e["forbidden-words-callback"], o = e["forbidden-words-text"], l(n, o, d);
            if (e["no-duplicate"] === !0 && (h = i.length, 0 !== h)) for (f = 0; h > f; f += 1) if (j = i[f].pure_text, j === d) return b.val(""), n = e["no-duplicate-callback"], o = e["no-duplicate-text"], l(n, o, d);
            return p = a(c.createElement("div")).addClass("tag").html("<span>#</span> " + d), a(c.createElement("input")).attr("type", "hidden").attr("name", e["tags-input-name"] + "[]").val(d).appendTo(p), a(c.createElement("a")).attr("role", "button").addClass(e["close-class"]).html(e["close-char"]).click(function() {
                p.remove()
            }).appendTo(p), p.pure_text = d, i.push(p), b.before(p), !1
        }, f.each(function() {
            var b, e, f, h, m, n, o;
            h = a(this), f = a.extend({}, g, j(h)), b = h.text(), h.empty(), e = a(c.createElement("input")).addClass(f["type-zone-class"]).attr("contenteditable", !0), h.addClass(f["tag-box-class"]).append(e), m = {
                comma: 188,
                enter: 13,
                spacebar: 32
            }, o = {
                del: 46,
                backspace: 8
            }, n = a.extend({}, m, o), e.on("keydown", function(a) {
                var b, c, g, h, j, p, q, r, s, t;
                if (p = f["forbidden-chars"], q = e.val(), r = a.which, "" === q) {
                    for (c in n) if (r === n[c]) return m[c] !== d ? (a.preventDefault(), !0) : (o[c] !== d && (f["no-" + c] || (a.preventDefault(), b = i.pop(), b !== d && (b.remove(), f["edit-on-delete"] && e.focus().val("").val(b.pure_text)))), !1)
                } else {
                    for (c in m) if (r === m[c]) return f["no-" + c] ? !1 : (a.preventDefault(), k(e, null, f));
                    for (j = p.length, h = 0; j > h; h += 1) if (g = q.indexOf(p[h]), - 1 !== g) return a.preventDefault(), q = q.replace(p[h], ""), e.focus().val("").val(q), s = f["forbidden-chars-callback"], t = f["forbidden-chars-text"], l(s, t, p[h])
                }
                return !0
            }), h.on("click", function() {
                e.focus()
            }), e.on("focus", function() {
                this.selectionStart = this.selectionEnd = a(this).val().length
            }), a.each(b.split(f["pre-tags-separator"]), function() {
                k(e, this, f)
            })
        }), this
    }
}(window.jQuery, window, document);
